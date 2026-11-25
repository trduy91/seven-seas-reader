# Seven Seas Reader

Static reader website deployed with GitHub Pages.

## Add a series

Edit `data/catalog.json` and add a series entry:

```json
{
  "id": "series-id",
  "title": "Series title",
  "subtitle": "SERIES LABEL",
  "description": "Short synopsis",
  "status": "ongoing",
  "tags": ["fantasy"],
  "chapters": [
    { "title": "Chapter 1 — Title", "file": "./stories/series-id/chapter-001.md" }
  ]
}
```

Supported statuses: `ongoing`, `completed`, `planned`. Chapter files are Markdown. Keep reader content inside `site/` so it is included in the Pages artifact.

## Publish

The workflow in `.github/workflows/deploy-pages.yml` deploys the `site/` directory on pushes to `main`. In repository Settings → Pages, select **GitHub Actions** as the build and deployment source.

The repository is currently private. GitHub Pages availability and public/private site visibility depend on the repository owner's GitHub plan and Pages settings. Do not put private drafts or secrets in a publicly accessible Pages artifact.
