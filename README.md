# Seven Seas Reader

Public reading site for **THE SHATTERED SEA SAGA**.

Only approved and published chapters belong in this repository. The private authoring source, drafts, continuity ledgers and author-only canon remain in [trduy91/seven-seas](https://github.com/trduy91/seven-seas).

## Publishing

1. Prepare and approve a chapter in the private source repository.
2. Copy only the approved reader-safe chapter into `chapters/<book-slug>/`.
3. Update `_data/chapters.yml` and open a pull request.
4. Review the rendered content and merge to `main`.
5. GitHub Actions deploys the site to GitHub Pages.

A push to the private repository does not publish anything. A chapter is published only after a successful Pages deployment.

## Local preview

This is a Jekyll site. Install Ruby and Bundler, then run:

```sh
bundle install
bundle exec jekyll serve
```
