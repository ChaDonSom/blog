# Sticky Headings Delivery: Why This Looks Wrong

This repository intentionally uses a two-step delivery path for sticky headings:

1. `npm install` to fetch `@chadonsom/sticky-headings`.
2. Copy the package's browser bundle into `assets/js/vendor/sticky-headings.js`.
3. Commit that copied file.

Yes, this is a code smell. It is documented on purpose so future maintainers do not waste time "fixing" it without understanding the deploy constraints.

## Why We Chose This

GitHub Pages in automatic Jekyll mode does **not** run Node package scripts. It does not run `npm install`, and it does not run `postinstall` hooks.

So if we only depend on npm at deploy time, the browser asset would be missing and sticky headings would break in production.

Committing the generated vendor asset keeps production deterministic under automatic Jekyll deploys.

## The Two Smells (Intentional)

1. Build/copy step for a front-end dependency in a static site.
2. Committing generated artifact in source control.

Both are deliberate tradeoffs for reliability with current hosting pipeline.

## Update Procedure

When bumping `@chadonsom/sticky-headings`:

1. Update version in `package.json`.
2. Run `npm install`.
3. Run `npm run sync:sticky-headings`.
4. Commit all of:
   - `package.json`
   - `package-lock.json`
   - `assets/js/vendor/sticky-headings.js`

## Exit Criteria (How We Remove This Later)

Remove this pattern only after moving off automatic Jekyll mode to a custom build pipeline (for example, GitHub Actions Pages workflow) that explicitly runs:

1. `npm ci`
2. `npm run sync:sticky-headings` (or a real bundler build)
3. `jekyll build`

After that migration, we can stop committing `assets/js/vendor/sticky-headings.js` and treat it as generated output.
