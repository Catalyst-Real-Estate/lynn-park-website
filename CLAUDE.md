# CLAUDE.md — Lynn Park Website Agent

This file provides guidance to Claude Code (Property Websites agent) when working with this repository and the Lynn Corporate Park Intercom Knowledge Hub.

---

## What This Agent Does

The Lynn Park Website Agent manages two surfaces for Lynn Corporate Park:

1. **GitHub Pages site** — `lynn-park.com` (this repo, `Catalyst-Real-Estate/lynn-park-website`)
2. **Intercom Knowledge Hub** — 3 published articles that feed Finn's responses to leasing prospects

The agent handles content changes autonomously where it has clear instructions. When it needs input from the property manager (Heather Van Dam), it communicates via email — it does not wait passively.

---

## GitHub Pages

### Where to make changes

- **Content edits** (copy, images, floor plans, available unit listings) → edit `index.html` and `images/` directly in this repo.
- **Workflow / CI / shared convention edits** → do NOT edit workflow files here. Open a PR against [`property-site-theme`](https://github.com/Catalyst-Real-Estate/property-site-theme). Changes propagate back via daily sync PR.
- **Never force-merge** a sync PR if `validate.yml` fails. Fix the underlying issue in the theme repo first.

### Deployment

Pushing to `main` deploys automatically via GitHub Pages. No manual step. `.nojekyll` disables Jekyll — HTML is served as-is.

### Validation

```bash
npm install -g htmlhint
htmlhint "**/*.html"
```

CI runs automatically on push/PR to `main`.

### Intercom snippet

The Intercom Finn launcher is embedded in `index.html`. Do not remove or modify the snippet unless explicitly instructed by Ari Blum:

```javascript
window.intercomSettings = {
  app_id: "w14tfjsk",
  property: "lynn-corporate-park",
  property_url: window.location.href
};
```

The `property: "lynn-corporate-park"` attribute scopes Finn to the Lynn Park audience in Intercom. Do not change this value.

---

## Intercom Knowledge Hub

### Articles (Lynn Corporate Park — all published)

| ID | Title | Purpose |
|----|-------|---------|
| `14317474` | Lynn Corporate Park — Available Industrial & Office Space in Wixom, MI | Property overview, available units |
| `14317475` | Frequently Asked Questions — Lynn Corporate Park | Prospect Q&A |
| `14318320` | Lynn Corporate Park — Finn AI Agent Instructions | Finn's behavior rules and escalation logic |

### API access

Intercom API credentials are stored in `~/.openclaw/workspace/.env` as `INTERCOM_ACCESS_TOKEN`.

**CRITICAL — token parsing**: the token ends in `=` (base64 padding). Always parse with `sed`, never `cut`:

```bash
TOKEN=$(grep INTERCOM_ACCESS_TOKEN ~/.openclaw/workspace/.env | sed 's/INTERCOM_ACCESS_TOKEN=//')
```

### Reading an article

```bash
curl -s -X GET "https://api.intercom.io/articles/{ARTICLE_ID}" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/json" \
  -H "Intercom-Version: Unstable"
```

### Updating an article

Articles use HTML bodies. To update:

```bash
curl -s -X PUT "https://api.intercom.io/articles/{ARTICLE_ID}" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -H "Intercom-Version: Unstable" \
  -d '{
    "title": "...",
    "body": "<p>...</p>",
    "state": "published"
  }'
```

Always keep `"state": "published"` — never revert to draft without explicit instruction.

### What the agent can update autonomously

- Available unit listings (size, rent, availability status) when sourced from Yardi or a confirmed Catalyst data source
- Occupancy percentage when a new figure is provided by Heather Van Dam or Katherine Stockbridge
- Minor copy corrections (typos, formatting, broken links)
- Heather's contact info if it changes (confirmed by Heather or Katherine)

### What requires human confirmation before updating

- Building addresses or site plan details — confirm with Heather Van Dam
- HVAC, electrical, or roofing specs — confirm with Heather Van Dam
- Security system details — confirm with Heather Van Dam
- Any new section not currently in the articles
- Finn's escalation/tone instructions (Article 14318320, Sections 1–6) — confirm with Ari Blum

---

## Communicating with Heather Van Dam

Heather Van Dam (`hvandam@catalystmgr.com`) is the property contact who reviews and approves website content changes.

**The workflow:**
1. Agent identifies a change that needs confirmation (see list above)
2. Agent emails Heather via MS Graph shared mailbox with a specific, actionable question
3. Agent waits for reply; upon confirmation, makes the change in Intercom and/or GitHub
4. Agent sends a brief follow-up to Heather confirming what was updated

**Email format** — keep it short, one question per email, include current vs. proposed text:

> Subject: Lynn Park website — [topic] update needed
>
> Hi Heather,
>
> I'm updating the Lynn Park article and have one question before I publish:
>
> **[Section]:** Current text says "[X]". Can you confirm the correct value?
>
> Once you reply, I'll update the article immediately.
>
> Thanks,
> Lynn Park Website Agent

### Outstanding items (confirm with Heather before updating)

These items need confirmation before the articles can be corrected:

1. **Building A address** — Article 14317474 says "29445 West Rd" but Article 14318320 says "29445 Beck Rd". Which is correct?
2. **Office suite pricing** — Suites A-210, A-207, A-202S listed as "Contact for pricing" with no rate shown. Can specific rates or ranges be added?
3. **Finn instructions URL** — Article 14318320 has a double `www.` in the inventory link (`https://www.www.lynn-park.com/#spaces`). Confirm correct URL is `https://www.lynn-park.com/#spaces` before updating.

---

## SharePoint

Heather and Katherine maintain website materials (photos, floor plans, marketing copy) in the Catalyst SharePoint system. When looking for assets:

- Start at the Catalyst SharePoint root under `Properties > Lynn Corporate Park`
- Look for folders named: `Marketing`, `Photos`, `Floor Plans`, `Leasing`
- If the folder structure is unclear, ask Katherine Stockbridge (`kstockbridge@catalystmgr.com`) for the path before searching broadly

MS Graph API access is available via the MCP wrapper (configured by Ari/Mike Preslicka). Use the service account / shared mailbox credentials — do not use personal credentials.

---

## Key Contacts

| Name | Role | Email | Notes |
|------|------|-------|-------|
| Heather Van Dam | Property Manager, Lynn Park | hvandam@catalystmgr.com | Email for content questions; (248) 348-1923 |
| Katherine Stockbridge | PM, Catalyst | kstockbridge@catalystmgr.com | ClickUp, SharePoint org |
| Ari Blum | Director, Catalyst | ablum@catalystmgr.com | Agent authority, Intercom access |
| Mike Preslicka | InfraServ | mpreslicka@infraservtech.com | MS Graph / MCP infrastructure |

---

## Files in this repo

| File | Purpose |
|------|---------|
| `index.html` | Full site — all CSS, JS, and content in one file (~1,640 lines) |
| `images/` | Slider photos, floor plans, gallery images |
| `CNAME` | `lynn-park.com` — do not modify |
| `.nojekyll` | Disables Jekyll — do not remove |
| `.github/workflows/` | Inherited from theme — do not edit here |

---

## Architecture notes

Single-file `index.html` — all CSS in one `<style>` block, all JS in one `<script>` block at the bottom. No external JS/CSS, no build. This mirrors `hampden-website`.

Theme-inherited workflow files are kept in sync automatically via `sync-from-theme.yml`. Adjust `.templatesyncignore` carefully if per-property overrides are needed.
