# Placeholder for GitHub integration service logic
import os, requests, collections, textwrap
import datetime as dt
import urllib.parse as ul





def pages(s, url, params=None):
    """Yield every JSON item across ?per_page=100 pages using the Link header."""
    while url:
        r = s.get(url, params=params)
        r.raise_for_status()
        yield from r.json()
        url, params = r.links.get("next", {}).get("url"), None     # only 1st call uses params

def contributor_count(full):
    """Return the total number of contributors (including anonymous) for one repo."""
    owner, repo = full.split("/")
    resp = s.get(
        f"https://api.github.com/repos/{owner}/{repo}/contributors",
        params={"per_page": 1, "anon": "true"},   # ask for just 1 item
    )
    resp.raise_for_status()

    # If there is a “Link: … rel="last"” header, GitHub tells us the last page number.
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


    # ── 1  repos you work on but don’t own ────────────────────────────────────────────
    repos = [
        r["full_name"]                                     # e.g. "octo-org/infra"
        for r in pages(s,

            "https://api.github.com/user/repos",
            {
                "affiliation": "collaborator,organization_member",    # skip your own projects
                "visibility":  "public",      # set "all" or leave out for private too
                "per_page":    100
            }
        )
        if r["owner"]["login"] != username and not r["fork"] and not r["archived"]
    ]




    contributors_by_repo = collections.Counter()        # {full_repo_name: n_contributors}
    contributors         = collections.Counter()        # {who: total_commits}

    for full in repos:
        owner, repo = full.split("/")
        for c in pages(s,
            f"https://api.github.com/repos/{owner}/{repo}/contributors",
            {"anon": "true", "per_page": 100},
        ):
            who = c.get("login") or c["name"]
            contributors[who] += c["contributions"]
            contributors_by_repo[full] += 1   # += 1 **per contributor JSON node**

    # ------------------------------------------------------------------
    # 2)  Pull your closed issues / PRs only from repos with ≥ 5 contributors
    # ------------------------------------------------------------------
    closed_by_me = []                       # (repo, #, title, closed_at)
    closed_days = set()
    for full in repos:
        if contributors_by_repo[full] < 5:
            continue
        owner, repo = full.split("/")
        for issue in pages(s,
            f"https://api.github.com/repos/{owner}/{repo}/issues",
            {"state": "closed", "per_page": 100, "creator": username},
        ):
            if issue.get("user", {}).get("login") == username:
                closed_by_me.append(
                    (full, issue["number"], issue["title"], issue["closed_at"])
                )
                if issue.get("closed_at"):
                    closed_days.add(issue["closed_at"][:10])
    # Calculate streak statistics
    if not closed_days:
        return {"closed": closed_by_me, "streak": 0, "max_streak": 0, "contribution_days": []}
    
    from datetime import datetime, timedelta
    
    # Convert to sorted list of date objects
    dates = sorted([datetime.strptime(day, "%Y-%m-%d").date() for day in closed_days])
    
    # Find all consecutive streaks
    streaks = []
    current_streak = 1
    
    for i in range(1, len(dates)):
        if (dates[i] - dates[i-1]).days == 1:
            # Consecutive day
            current_streak += 1
        else:
            # Streak broken, record the current streak and start new one
            streaks.append(current_streak)
            current_streak = 1
    
    # Don't forget the last streak
    streaks.append(current_streak)
    
    # Find the maximum streak (longest consecutive sequence)
    max_streak = max(streaks) if streaks else 0
    
    # Calculate current streak (ending today or recently)
    today = datetime.utcnow().date()
    current_streak_count = 0
    
    # Check backwards from today to find current active streak
    check_date = today
    while check_date.isoformat() in closed_days:
        current_streak_count += 1
        check_date -= timedelta(days=1)
    
    # If no activity today, check if there's a recent streak (within last 2 days)
    if current_streak_count == 0:
        check_date = today - timedelta(days=1)
        while check_date.isoformat() in closed_days and (today - check_date).days <= 2:
            current_streak_count += 1
            check_date -= timedelta(days=1)
    
    return {"closed": closed_by_me, "streak": current_streak_count, "max_streak": max_streak, "contribution_days": list(closed_days)}