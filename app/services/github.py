# Placeholder for GitHub integration service logic
from __future__ import annotations

import os
import sys
from pathlib import Path
from typing import Dict, List

import requests
import os, requests, collections, textwrap
import datetime as dt
import urllib.parse as ul
from datetime import datetime, timedelta

import re, requests

from openai import OpenAI
from app.core.config import settings

client = OpenAI(api_key=settings.openai_api_key)

def pr_uses_ai(issue_url: str, gh_token: str, openai_key: str = settings.openai_api_key) -> bool:
    """
    Call pr_diff(), feed that diff to ChatGPT, and return a boolean:
    True  – PR appears to use AI (e.g. imports openai, transformers, etc.)
    False – no AI-related code spotted.

    Needs:
        pip install openai
    """
    # 1) grab the diff
    diff = pr_diff(issue_url, gh_token)          # ← function from earlier

    # 2) hit OpenAI
    rsp = client.chat.completions.create(model="gpt-4o-mini",
    temperature=0,
    messages=[
        {
            "role": "system",
            "content": (
                "You are an automated code checker. "
                "Answer ONLY 'true' or 'false' (lowercase, no punctuation)."
            ),
        },
        {
            "role": "user",
            "content": (
                "Does this pull-request introduce AI-related code "
                "(e.g. uses openai, transformers, langchain, llama, "
                "torch-based inference, etc.)?\n\n"
                f"{diff[:1000]}"
            ),
        },
    ])

    # 3) boil the model’s reply down to True / False
    answer = rsp.choices[0].message.content.strip().lower()
    return answer.startswith("t")   # 'true' → True, anything else → False


### A two-step fallback that still fits in one tiny function

import re, requests, itertools

def pr_diff(issue_url: str, token: str = "") -> str:
    """
    Return the full diff for the PR that has the same number as `issue_url`.
    Falls back to stitching together per-commit diffs when the main
    endpoint returns 406 (diff too big).

    >>> pr_diff("https://api.github.com/repos/djeck1432/spotnet/issues/820")
    'diff --git a/…'
    """
    # 1. pluck owner/repo/number out of the issues URL
    m = re.match(r"https?://api\.github\.com/repos/([^/]+)/([^/]+)/issues/(\d+)", issue_url)
    if not m:
        raise ValueError("unexpected issues URL shape")
    owner, repo, num = m.groups()

    # 2. prepare headers once
    hdr = {"Accept": "application/vnd.github.v3.diff"}     # tells GitHub you want raw diff :contentReference[oaicite:1]{index=1}
    if token:
        hdr["Authorization"] = f"token {token}"

    # 3. first try the normal PR-wide diff
    url = f"https://api.github.com/repos/{owner}/{repo}/pulls/{num}"
    r = requests.get(url, headers=hdr, timeout=15)
    if r.ok:                         # 200 → we’re done
        return r.text
    return "pr is too large, return just false"
    # if r.status_code != 406:         # any other error: bubble it up
    #     r.raise_for_status()

    # # 4. 406 ⇒ fall back: grab each commit’s diff and concatenate
    # parts = []
    # # paginated list of commits on the PR
    # commits = f"https://api.github.com/repos/{owner}/{repo}/pulls/{num}/commits"
    # for page in itertools.count(1):
    #     rc = requests.get(commits, headers=hdr, params={"per_page": 100, "page": page}, timeout=15)
    #     rc.raise_for_status()
    #     batch = rc.json()
    #     if not batch:                 # no more pages
    #         break
    #     for c in batch:
    #         sha = c["sha"]
    #         cdiff = requests.get(
    #             f"https://api.github.com/repos/{owner}/{repo}/commits/{sha}",
    #             headers={"Accept": "application/vnd.github.diff", **({} if not token else {"Authorization": hdr["Authorization"]})},
    #             timeout=15,
    #         )                         # commit diff media-type :contentReference[oaicite:2]{index=2}
    #         cdiff.raise_for_status()
    #         parts.append(cdiff.text)
    # if not parts:
    #     raise RuntimeError("406 and commit diff fallback returned nothing")
    # return "\n".join(parts)



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

def calculate_streaks(contribution_days):
    """
    Calculate current streak and max streak from a set of contribution days.

    Args:
        contribution_days: Set or list of date strings in YYYY-MM-DD format

    Returns:
        tuple: (current_streak, max_streak)
    """
    if not contribution_days:
        return 0, 0

    # Convert to sorted list of date objects (chronological order - oldest first)
    dates = sorted([datetime.strptime(day, "%Y-%m-%d").date() for day in contribution_days])

    print(f"DEBUG: Calculating streaks for {len(dates)} dates: {dates}")

    # Calculate maximum streak by finding longest consecutive sequence
    max_streak = 1
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
    return current_streak, max_streak

def get_closed_issues(token, username):
    s = requests.Session()
    s.headers.update({
        "Authorization": f"Bearer {token}",
        "Accept":       "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28"
    })

    # ── 1  repos you work on but don't own (collaborator or organization member) ────────
    repos = [
        r["full_name"]                                     # e.g. "octo-org/infra"
        for r in pages(s,
            "https://api.github.com/user/repos",
            {
                "affiliation": "collaborator,organization_member",    # skip your own projects
                "visibility":  "public",      # public repos only for meaningful contributions
                "per_page":    100
            }
        )
        if r["owner"]["login"] != username and not r["fork"] and not r["archived"]
    ]

    print(f"DEBUG: Found {len(repos)} potential repos to check")

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
    #     This filters for meaningful open source contributions
    # ------------------------------------------------------------------
    activity_items = []                     # (repo, #, title, closed_at, type)
    contribution_days = set()
    diffs = []
    qualifying_repos = [full for full in repos if contributors_by_repo[full] >= 5]
    print(f"DEBUG: {len(qualifying_repos)} repos with ≥5 contributors: {qualifying_repos}")

    for full in qualifying_repos:
        owner, repo = full.split("/")
        print(f"DEBUG: Checking closed issues/PRs in {full}")

        # Get closed issues created by user
        for issue in pages(s,
            f"https://api.github.com/repos/{owner}/{repo}/issues",
            {"state": "closed", "per_page": 100, "creator": username},
        ):
            if issue.get("user", {}).get("login") == username:
                activity_items.append(
                    (full, issue["number"], issue["title"], issue["closed_at"], "issue")
                )
                if issue.get("closed_at"):
                    contribution_days.add(issue["closed_at"][:10])
                    diffs.append((pr_uses_ai(issue.get('url'), token)))
                # Also count creation date as activity
                # if issue.get("created_at"):
                #     contribution_days.add(issue["created_at"][:10])

    print(f"DEBUG: Found {len(activity_items)} activity items from {len(contribution_days)} unique days")

    if not contribution_days:
        return {"activity": activity_items, "contribution_days": []}

    from datetime import datetime, timedelta

    dates = sorted([datetime.strptime(day, "%Y-%m-%d").date() for day in contribution_days])

    print("\n\n\n\n\\n\n\n")
    print(diffs)
    # Calculate current active streak (from most recent activity)
    return {
        "activity": activity_items,  # Changed from "closed" to "activity" and added type
        "contribution_days": sorted(contribution_days),  # Return sorted list for consistency
        "used_ai": diffs if diffs else []
    }


