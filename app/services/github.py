# Placeholder for GitHub integration service logic
import os, requests, collections, textwrap
import datetime as dt
import urllib.parse as ul


TOKEN    = "s"
USERNAME = ""                 # <─ replace

s = requests.Session()
s.headers.update({
    "Authorization": f"Bearer {TOKEN}",
    "Accept":       "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28"
})

def pages(url, params=None):
    """Yield every JSON item across ?per_page=100 pages using the Link header."""
    while url:
        r = s.get(url, params=params);
        r.raise_for_status()
        yield from r.json()
        url, params = r.links.get("next", {}).get("url"), None     # only 1st call uses params

# ── 1  repos you work on but don’t own ────────────────────────────────────────────
repos = [
    r["full_name"]                                     # e.g. "octo-org/infra"
    for r in pages(
        "https://api.github.com/user/repos",
        {
            "affiliation": "collaborator,organization_member",    # skip your own projects
            "visibility":  "public",      # set "all" or leave out for private too
            "per_page":    100
        }
    )
    if r["owner"]["login"] != USERNAME and not r["fork"] and not r["archived"]
]

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

print(f"Found {len(repos)} non-owned repos")

# # ── 2  aggregate all contributors ────────────────────────────────────────────────
contributors = collections.Counter()           # {login_or_email: commit_count}

for full in repos:
    owner, repo = full.split("/")
    for c in pages(
        f"https://api.github.com/repos/{owner}/{repo}/contributors",
        {"anon": "true", "per_page": 100}
    ):
        who = c.get("login") or c["name"]      # anonymous commits ⇒ name or e-mail
        contributors[who] += c["contributions"]

# ── 3  done ──────────────────────────────────────────────────────────────────────
print("\nTop helpers across other people’s projects:")
for who, n in contributors.most_common(20):
    print(f"{who:25} {n:>6}")


closed_by_me = []                       # (repo, #, title, closed_at)

for full in repos:
    owner, repo = full.split("/")
    for issue in pages(                 # ← same pages() helper you already have
        f"https://api.github.com/repos/{owner}/{repo}/issues",
        {"state": "closed", "per_page": 100, "creator": USERNAME}
        # `creator=<username>` lets GitHub pre-filter on its side
    ):
        # double-check (defensive, in case the filter changes some day)
        if issue.get("user", {}).get("login") == USERNAME:
            closed_by_me.append(
                (full, issue["number"], issue["title"], issue["closed_at"])
            )

# ── pretty-print ──────────────────────────────────────────────────────────────
print(f"\nClosed issues authored by {USERNAME}: {len(closed_by_me)}\n")
width = 80
for repo, no, title, ts in closed_by_me:
    short = textwrap.shorten(title, width=width, placeholder="…")
    when  = dt.datetime.fromisoformat(ts.rstrip("Z")).strftime("%Y-%m-%d")
    print(f"{repo:35}  #{no:<5}  {when}  {short}")


rich_repos = [full for full in repos if contributor_count(full) > 5]

print(f"Repos with >10 contributors: {len(rich_repos)}")


print(rich_repos)