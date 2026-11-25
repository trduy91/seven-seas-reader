# Seven Seas Reader

Public reading site for **THE SHATTERED SEA SAGA**.

<https://trduy91.github.io/seven-seas-reader/>

The first published chapter is available at:
[Book I — Chapter 1: The Measure of Salt](https://trduy91.github.io/seven-seas-reader/chapters/book-01-the-crow-of-iron/chapter-001-the-measure-of-salt/).

Only approved and published chapters belong in this repository. The private authoring source, drafts, continuity ledgers and author-only canon remain in [trduy91/seven-seas](https://github.com/trduy91/seven-seas).

## Publishing

1. Prepare and approve a chapter in the private source repository.
2. Copy only the approved reader-safe chapter into `_chapters/<book-slug>/`.
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

The production configuration uses the GitHub Pages project-site base path `/seven-seas-reader`. For local preview at the root URL, use:

```sh
bundle exec jekyll serve --baseurl ""
```
