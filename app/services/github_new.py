# GitHub integration service logic
import os, requests, collections, textwrap
import datetime as dt
import urllib.parse as ul
from datetime import datetime, timedelta

def pages(s, url, params=None):
    """Yield every JSON item across ?per_page=100 pages using the Link header."""
    while url:
        r = s.get(url, params=params)
        r.raise_for_status()
        yield from r.json()
        url, params = r.links.get("next", {}).get("url"), None     # only 1st call uses params

def contributor_count(full, session):
    """Return the total number of contributors (including anonymous) for one repo."""
    owner, repo = full.split("/")
    resp = session.get(
        f"https://api.github.com/repos/{owner}/{repo}/contributors",
        params={"per_page": 1, "anon": "true"},   # ask for just 1 item
    )
    resp.raise_for_status()

    # If there is a "Link: … rel="last"" header, GitHub tells us the last page number.
    last = resp.links.get("last")
    if last:                                      # >1 contributors
        qs   = ul.parse_qs(ul.urlparse(last["url"]).query)
        return int(qs["page"][0])                 # contributors = last page #
    else:                                         # 0 – 1 contributor → we already have the list
        return len(resp.json())


def get_closed_issues(token, username):
    s = requests.Session()
    s.headers.update({
        "Authorization": f"Bearer {token}",
        "Accept":       "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28"
    })

    # Get all contribution activities - this will be more comprehensive
    all_contribution_days = set()
    closed_by_me = []
    
    try:
        # 1. Get user's events (comprehensive activity feed)
        print(f"DEBUG: Fetching events for user {username}")
        events_url = f"https://api.github.com/users/{username}/events"
        
        # Get recent events (GitHub API limits to ~300 events)
        event_count = 0
        for event in pages(s, events_url, {"per_page": 100}):
            event_count += 1
            if event_count > 1000:  # Limit to prevent infinite loops
                break
                
            if event.get("created_at"):
                event_date = event["created_at"][:10]  # YYYY-MM-DD
                all_contribution_days.add(event_date)
                
                # Also collect closed issues/PRs for display
                if event.get("type") in ["IssuesEvent", "PullRequestEvent"]:
                    payload = event.get("payload", {})
                    if payload.get("action") == "closed":
                        item = payload.get("issue") or payload.get("pull_request")
                        if item and item.get("user", {}).get("login") == username:
                            repo_name = event.get("repo", {}).get("name", "unknown/repo")
                            closed_by_me.append((
                                repo_name,
                                item.get("number", 0),
                                item.get("title", ""),
                                item.get("closed_at", event["created_at"])
                            ))
        
        print(f"DEBUG: Found {len(all_contribution_days)} activity days from events")
        
        # 2. Also get user's own repositories and their commits
        print(f"DEBUG: Fetching user repositories")
        repos_url = f"https://api.github.com/users/{username}/repos"
        repo_count = 0
        
        for repo in pages(s, repos_url, {"per_page": 100, "sort": "updated"}):
            repo_count += 1
            if repo_count > 50:  # Limit repos to check for performance
                break
                
            if repo.get("fork") or repo.get("archived"):
                continue
                
            repo_name = repo["full_name"]
            print(f"DEBUG: Checking commits in {repo_name}")
            
            # Get recent commits by this user in this repo
            commits_url = f"https://api.github.com/repos/{repo_name}/commits"
            try:
                commit_count = 0
                for commit in pages(s, commits_url, {"author": username, "per_page": 100, "since": (datetime.now() - timedelta(days=365)).isoformat()}):
                    commit_count += 1
                    if commit_count > 200:  # Limit commits per repo
                        break
                        
                    if commit.get("commit", {}).get("author", {}).get("date"):
                        commit_date = commit["commit"]["author"]["date"][:10]
                        all_contribution_days.add(commit_date)
            except Exception as e:
                print(f"DEBUG: Error fetching commits for {repo_name}: {e}")
                continue
                
        print(f"DEBUG: Total unique contribution days: {len(all_contribution_days)}")
        
        # 3. If we still have very few days, try the search API
        if len(all_contribution_days) < 10:
            print(f"DEBUG: Few contribution days found, trying search API")
            try:
                # Search for recent issues/PRs created by user
                search_url = "https://api.github.com/search/issues"
                search_params = {
                    "q": f"author:{username} created:>{(datetime.now() - timedelta(days=365)).strftime('%Y-%m-%d')}",
                    "per_page": 100,
                    "sort": "created"
                }
                
                search_count = 0
                for item in pages(s, search_url, search_params):
                    search_count += 1
                    if search_count > 500:  # Limit search results
                        break
                        
                    if item.get("created_at"):
                        all_contribution_days.add(item["created_at"][:10])
                    if item.get("closed_at") and item.get("user", {}).get("login") == username:
                        repo_url = item.get("repository_url", "")
                        repo_name = repo_url.split("/")[-2:] if repo_url else ["unknown", "repo"]
                        repo_name = "/".join(repo_name) if len(repo_name) == 2 else "unknown/repo"
                        
                        closed_by_me.append((
                            repo_name,
                            item.get("number", 0),
                            item.get("title", ""),
                            item.get("closed_at", item.get("created_at", ""))
                        ))
            except Exception as e:
                print(f"DEBUG: Error with search API: {e}")
        
    except Exception as e:
        print(f"DEBUG: Error in get_closed_issues: {e}")
        # Return some fallback data if API calls fail
        return {"closed": [], "streak": 0, "max_streak": 0, "contribution_days": []}

    # Calculate streak statistics
    if not all_contribution_days:
        print("DEBUG: No contribution days found")
        return {"closed": closed_by_me, "streak": 0, "max_streak": 0, "contribution_days": []}
    
    # Debug: Print the contribution days for debugging
    sorted_days = sorted(all_contribution_days)
    print(f"DEBUG: Found {len(all_contribution_days)} contribution days: {sorted_days}")
    
    # Convert to sorted list of date objects (chronological order - oldest first)
    dates = sorted([datetime.strptime(day, "%Y-%m-%d").date() for day in all_contribution_days])
    
    print(f"DEBUG: Sorted dates (chronological): {dates}")
    
    # Calculate maximum streak by finding longest consecutive sequence
    max_streak = 1 if dates else 0
    current_streak_in_history = 1
    
    for i in range(1, len(dates)):
        days_diff = (dates[i] - dates[i-1]).days
        if days_diff == 1:  # Consecutive days
            current_streak_in_history += 1
            max_streak = max(max_streak, current_streak_in_history)
        else:
            current_streak_in_history = 1
    
    # Calculate current active streak (from most recent activity)
    today = datetime.utcnow().date()
    current_streak = 0
    
    if dates:
        most_recent_date = dates[-1]  # Last date in chronological order
        days_since_last_activity = (today - most_recent_date).days
        
        print(f"DEBUG: Today is {today}, most recent activity: {most_recent_date}")
        print(f"DEBUG: Days since last activity: {days_since_last_activity}")
        
        # Only count as current streak if activity was within the last 1 day
        # (allows for today or yesterday to maintain streak)
        if days_since_last_activity <= 1:
            current_streak = 1
            
            # Count backwards from most recent date to find consecutive days
            for i in range(len(dates) - 2, -1, -1):  # Start from second-to-last, go backwards
                days_diff = (dates[i + 1] - dates[i]).days
                if days_diff == 1:  # Consecutive days
                    current_streak += 1
                else:
                    break
        else:
            # No recent activity, streak is broken
            current_streak = 0
    
    print(f"DEBUG: Calculated current_streak={current_streak}, max_streak={max_streak}")
    
    return {
        "closed": closed_by_me, 
        "streak": current_streak, 
        "max_streak": max_streak, 
        "contribution_days": sorted_days  # Return sorted list for consistency
    }
