# codeplus

A `<code>` element turbocharger. The code should look readable and normal without the extension (like in markdown docs) -- so a lot of the features are implemented through human-readable code comments.

Maybe it's a web component? https://github.com/github/custom-element-boilerplate

Things I want:

- filename (`// filename.js` as first line)
- tabs (sibling `pre>code` with same group identifier - maybe `// filename.js - Adding x to y example`)
- language switcher (sibling `pre>code` with same filename but different lang)
- light/dark mode toggle?
- walkthrough (highlight line like Stripe docs) (`Step 1: ...`)
- copy/paste button (and on "steps")
- collapsing?
- diff coloring
- variables (like client DSN in sentry docs - only swaps them out if variable given, obvious styling, list dropdown if variable is an array)
- variables with prompt/input (ex. project name), maybe on copy/paste?
