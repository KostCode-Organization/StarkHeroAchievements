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

    for full in repos:
        if contributors_by_repo[full] < 5:      # ✂️  skip “small” repos
            continue

        owner, repo = full.split("/")
        for issue in pages(s,
            f"https://api.github.com/repos/{owner}/{repo}/issues",
            {"state": "closed", "per_page": 100, "creator": username},
        ):
            if issue.get("user", {}).get("login") == username:        # double-check
                closed_by_me.append(
                    (full, issue["number"], issue["title"], issue["closed_at"])
                )

    # ── pretty-print ──────────────────────────────────────────────────────────────
    print(f"\nClosed issues authored by {username}: {len(closed_by_me)}\n")

    return closed_by_me