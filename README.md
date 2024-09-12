# codeplus

Add interactive elements to your `<code>` without a bunch of custom markup or JavaScript.

- filenames
- tabs and tab groups (with "remember tab selection")
- copy button

![CleanShot 2022-04-29 at 10 08 41](https://user-images.githubusercontent.com/649496/165995663-91479c8c-e49a-4d3b-ab9f-2e0a044301fe.gif)

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

## Features

### Filenames

To render filenames all you need to do is start your code block with a comment line that says the filename:

```yaml
# .pullapprove.yml
version: 3
groups: ...
```

When codeplus runs, you'll get something like this:

<img width="718" alt="CleanShot 2022-04-29 at 12 24 58@2x" src="https://user-images.githubusercontent.com/649496/165993479-c4b051b8-28ab-4874-bf41-cad379af4229.png">

### Tab display name

Instead of filenames, you can also use a "display name" in parenetheses:

```yaml
# (GitHub)
version: 3
groups: ...
```

Or you can include a filename *and* a display name:

```yaml
# .pullapprove.yml (GitHub)
version: 3
groups: ...
```

With codeplus:

<img width="704" alt="CleanShot 2022-04-29 at 12 25 11@2x" src="https://user-images.githubusercontent.com/649496/165993506-1dbb33b5-89e9-4fd6-8f02-99ab32d16e8c.png">

### Tab groups

To get a group of tabs, just put the code blocks right next to each other:

```yaml
# (GitHub)
version: 3
groups: ...
```

```yaml
# (Bitbucket)
version: 3
groups: ...
```

With codeplus:

<img width="711" alt="CleanShot 2022-04-29 at 12 25 36@2x" src="https://user-images.githubusercontent.com/649496/165993539-b8f5a86f-d5e6-4ae4-a038-e8c11ebaf75f.png">

### Copy button

The copy/paste button is added to all code blocks by default (shown on hover in this example):

<img width="715" alt="CleanShot 2022-04-29 at 12 26 55@2x" src="https://user-images.githubusercontent.com/649496/165993684-2ddd8770-1741-4222-8d88-1abeaa885185.png">

### Remember tab selection

A nice use of tabs is to separate examples by language or ecosystem.
If you're browsing docs in "Python" mode for example,
you probably want to see the Python tab on every page you visit.

We can do this for you with localStorage:

![CleanShot 2022-04-29 at 10 25 41](https://user-images.githubusercontent.com/649496/165994437-1eb3f42a-d848-4190-a388-9f8b2a11deff.gif)


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
<script src="https://unpkg.com/@dropseed/codeplus@0.7.0/dist/codeplus.js"></script>
<script>
window.addEventListener("load", function() {
    new Codeplus({}).render();
});
</script>
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
