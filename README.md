# codeplus

Add interactive elements to your `<code>` without a bunch of custom markup or JavaScript.

- filenames
- tabs
- copy button

The key to codeplus is that you don't have to do much to make it work,
and your code blocks also look fine when it's not in use.
If you're writing docs in markdown,
for example,
you want those to look *normal* on GitHub and other sites where you don't have control over the markdown rendering.
Users should still be able to read everything in that form.
But when you render the same code on *your* site,
you get an extra layer of interactivity just by adding `codeplus` on top.

This library does not do syntax highlighting!
That means you can use any server-side (or client-side) syntax highlighter you want and codeplus will add the interactive features after the fact.

To render filenames all you need to do is start your code block with a comment line that starts with `# <filename>:`

```yaml
# .pullapprove.yml
version: 3
groups: ...
```

You can also change the display name by using parentheses after the filename:

```yaml
# .pullapprove.yml (GitHub)
version: 3
groups: ...
```

To get a group of tabs, just use the same pattern followed by a `- <group identifider>`:

```yaml
# .pullapprove.yml (GitHub) - Example group
version: 3
groups: ...
```

```yaml
# .pullapprove.yml (Bitbucket) - Example group
version: 3
groups: ...
```

## Installation

```sh
npm install @dropseed/codeplus
```

```js
import Codeplus from "@dropseed/codeplus";

window.addEventListener('load', function() {
    new Codeplus({}).render();
});
```

### CDN

```html
<script src="https://unpkg.com/@dropseed/codeplus@0.2.0/dist/browser.js"></script>
<script>
window.addEventListener("load", function() {
    new Codeplus({}).render();
});
```

## Options

```js
new Codeplus({
    // The query selector to find your code elements
    selector: "pre > code",
    // Saves a user's tab selection in localStorage and shows that tab on page load (ex. "Python")
    rememberTabSelections: true,
    // Enable debug console.logs
    debug: false,
    // Use classes to add styling (or look at the default CSS classes)
    instanceClass: "rounded-t-none group",
    navClass: "bg-black rounded-t overflow-hidden",
    tabClass: "px-3 py-2 text-sm text-gray-300 hover:text-gray-100",
    activeTabClass: "bg-[#282c34]",
    inactiveTabClass: "",
    copyButtonClass: "items-center group-hover:flex hidden rounded border border-gray-200 px-2 py-1 text-sm",
    // Custom render for the tabs
    renderTab: function(tab, instance) {
        const icon = "...";
        tab.innerHTML = icon + tab.innerHTML;
    },
    // Custom render for the copy button
    renderCopyButton: function(copyButton, instance, copied) {
        if (!copied) {
            copyButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="w-4 h-4 bi bi-clipboard" viewBox="0 0 16 16"><path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/><path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/></svg> Copy`;
        }
    },
}).render();
```

## Styling

Styling can be done either with inserting classes via [options](#options) or by using the default CSS classes:

```css
.codeplus {}
.codeplus-group {}
.codeplus-nav {}
.codeplus-tab {}
.codeplus-tab.active {}
.codeplus-tab.inactive {}
.codeplus-instances {}
.codeplus-instance {}
.codeplus-copy-btn {}
```

By default there are only a few styles for basic layout help.
Any colors, font sizes, etc. are up to you and will probably be similar to your syntax highlighting theme.
