import parse from "./parse";

const css = `
.codeplus-nav {
    display: flex;
}
.codeplus-instance {
    position: relative;
}
.codeplus-copy-btn {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
}
`;

export class CodeplusInstance {
  constructor(node, options) {
    if (node.parentNode && node.parentNode.tagName === "PRE") {
      // Automatically detect if we're in a pre tag
      this.containerNode = node.parentNode;
    } else {
      this.containerNode = node;
    }

    if (node.tagName === "CODE") {
      this.codeNode = node;
    } else {
      this.codeNode = node.querySelector("code");
    }

    this.instanceClass = options.instanceClass;
    this.copyButtonClass = options.copyButtonClass;
    this.renderCopyButton = options.renderCopyButton;

    const parsed = parse(this.codeNode.innerText || "");

    this.filename = parsed.filename;
    this.displayName = parsed.displayName;
  }
  getNavName() {
    if (this.filename && this.displayName) {
      return `${this.filename} (${this.displayName})`;
    }
    if (this.filename) {
      return this.filename;
    }
    if (this.displayName) {
      return this.displayName;
    }
    return "";
  }
  getRememberName() {
    // Only want to remember the display name if there is one
    // so that `filename.js (GitHub)` syncs with `another.js (GitHub)`
    if (this.displayName) {
      return this.displayName;
    }
    return this.filename;
  }
  hasNav() {
    return this.filename || this.displayName;
  }
  render() {
    // Yank the first line if we got something from it
    if (this.hasNav()) {
      this.codeNode.innerHTML = this.codeNode.innerHTML
        .trimStart()
        .substring(this.codeNode.innerHTML.trimStart().indexOf("\n") + 1);
    }

    // Add a class for styling
    this.containerNode.classList.add("codeplus-instance");
    if (this.instanceClass) {
      this.containerNode.classList.add(...this.instanceClass.split(" "));
    }

    const copyBtn = document.createElement("button");
    copyBtn.innerHTML = "Copy";
    this.renderCopyButton(copyBtn, this, false);
    copyBtn.className = "codeplus-copy-btn " + this.copyButtonClass;

    copyBtn.addEventListener("click", () => {
      this.copyToClipboard();
      copyBtn.innerHTML = "Copied!";
      this.renderCopyButton(copyBtn, this, true);
      // Make it stay visible for a sec
      copyBtn.style.display = "inline-block";
      setTimeout(() => {
        copyBtn.innerHTML = "Copy";
        this.renderCopyButton(copyBtn, this, false);
        copyBtn.style.display = "";
      }, 1000);
    });
    this.containerNode.appendChild(copyBtn);
  }
  copyToClipboard() {
    const textArea = document.createElement("textarea");
    textArea.value = this.codeNode.innerText;
    document.body.appendChild(textArea);
    textArea.select();
    // TODO deprecated?
    document.execCommand("copy");
    textArea.remove();
  }
}

class CodeplusGroup {
  constructor(instances, options) {
    // this.name = name;
    this.instances = instances;
    this.tabs = [];

    this.groupClass = options.groupClass;
    this.navClass = options.navClass;
    this.tabClass = options.tabClass;
    this.activeTabClass = options.activeTabClass;
    this.inactiveTabClass = options.inactiveTabClass;

    // this.onTabShown = options.onTabShown;
    this.renderTab = options.renderTab;
    this.rememberTabSelections = options.rememberTabSelections;

    this.onRememberTabSelection = options.onRememberTabSelection;
  }
  showTab(index, remember) {
    this.instances.forEach((instance, i) => {
      if (i === index) {
        instance.containerNode.style.display = "block";
        this.tabs[i].classList.add(...this.activeTabClass.split(" "));
        this.tabs[i].classList.remove(...this.inactiveTabClass.split(" "));
      } else {
        instance.containerNode.style.display = "none";
        this.tabs[i].classList.remove(...this.activeTabClass.split(" "));
        this.tabs[i].classList.add(...this.inactiveTabClass.split(" "));
      }
    });
    // this.onTabShown(this.tabs[index], this.instances[index]);

    if (remember && this.rememberTabSelections && this.tabs.length > 1) {
      const name = this.instances[index].getRememberName();
      setRememberedTab(name);
      this.onRememberTabSelection(name);
    }
  }
  render() {
    let groupDiv = document.createElement("div");
    groupDiv.className = "codeplus codeplus-group " + this.groupClass;

    // Put the div wherever the first code instance is
    // then move everything into it
    let parent = this.instances[0].containerNode.parentNode;
    parent.insertBefore(groupDiv, this.instances[0].containerNode);

    let instancesDiv = document.createElement("div");
    instancesDiv.className = "codeplus-instances";

    let navDiv = document.createElement("div");
    navDiv.className = "codeplus-nav " + this.navClass;

    // Reset the tabs
    this.tabs = [];

    // insert the instances into the div
    this.instances.forEach((instance, index) => {
      const navTab = document.createElement("button");
      navTab.className = "codeplus-tab " + this.tabClass;

      if (instance.hasNav()) {
        // Only render a tab if we have a name for it
        navTab.innerText = instance.getNavName();
        navTab.addEventListener("click", () => {
          this.showTab(index, true);
        });
        this.renderTab(navTab, instance);
        this.tabs.push(navTab);
      }

      if (index === 0) {
        // First tab is active by default
        navTab.classList.add(...this.activeTabClass.split(" "));
      } else {
        navTab.classList.add(...this.inactiveTabClass.split(" "));
        // Hide all but the first code block
        instance.containerNode.style.display = "none";
      }

      instancesDiv.appendChild(instance.containerNode);
    });

    // Add the tabs to the DOM (not always needed)
    if (this.tabs.length > 0) {
      this.tabs.forEach((tab) => {
        navDiv.appendChild(tab);
      });

      this.loadRememberedTab();

      groupDiv.appendChild(navDiv);
    }

    groupDiv.appendChild(instancesDiv);

    this.instances.forEach((instance) => {
      instance.render();
    });
  }
  loadRememberedTab() {
    // Find the first matching remembered tab and show it
    const rememberedTabs = getRememberedTabs();
    var foundTab = false;
    for (const rememberedTab of rememberedTabs) {
      for (let i = 0; i < this.instances.length; i++) {
        if (this.instances[i].getRememberName() === rememberedTab) {
          this.showTab(i);
          foundTab = true;
        }
      }
      if (foundTab) {
        break;
      }
    }
  }
}

function getRememberedTabs() {
  const remembered = localStorage.getItem("codeplusRememberedTabs");
  if (remembered) {
    return remembered.split(",");
  }
  return [];
}

function setRememberedTab(name) {
  const rememberedTabs = getRememberedTabs();
  // Remove the current place if it exists
  if (rememberedTabs.indexOf(name) !== -1) {
    rememberedTabs.splice(rememberedTabs.indexOf(name), 1);
  }
  // Prepend it as the most recent
  rememberedTabs.unshift(name);
  // Limit how much we save
  if (rememberedTabs.length > 5) {
    rememberedTabs.splice(5);
  }
  localStorage.setItem("codeplusRememberedTabs", rememberedTabs.join(","));
}

class Codeplus {
  constructor(options) {
    this.debug = options.debug || false;

    this.selector = options.selector || "pre > code";

    this.rememberTabSelections = options.rememberTabSelections || false;

    this.instanceClass = options.instanceClass || "";
    this.groupClass = options.groupClass || "";
    this.navClass = options.navClass || "";
    this.tabClass = options.tabClass || "";
    this.activeTabClass = options.activeTabClass || "active";
    this.inactiveTabClass = options.inactiveTabClass || "inactive";
    this.copyButtonClass = options.copyButtonClass || "";

    // this.onTabShown = options.onTabShown || (() => {});
    this.renderTab = options.renderTab || (() => {});
    this.renderCopyButton = options.renderCopyButton || (() => {});

    this.domNodes = document.querySelectorAll(this.selector);

    if (this.debug) console.log("Codeplus DOM nodes selected", this.domNodes);

    this.groups = this.getGroups(
      Array.from(this.domNodes).map(
        (node) =>
          new CodeplusInstance(node, {
            instanceClass: this.instanceClass,
            copyButtonClass: this.copyButtonClass,
            renderCopyButton: this.renderCopyButton,
          })
      )
    );
  }
  getGroups(instances) {
    // Group by direct siblings
    let groups = [];
    let group = [];
    for (let i = 0; i < instances.length; i++) {
      if (group.length === 0) {
        group.push(instances[i]);
      } else {
        if (
          instances[i].hasNav() &&
          instances[i].containerNode.previousElementSibling ===
            group[group.length - 1].containerNode
        ) {
          group.push(instances[i]);
        } else {
          groups.push(group);
          group = [];
          group.push(instances[i]);
        }
      }
    }
    groups.push(group);

    const groupOptions = {
      // Classes
      groupClass: this.groupClass,
      navClass: this.navClass,
      tabClass: this.tabClass,
      activeTabClass: this.activeTabClass,
      inactiveTabClass: this.inactiveTabClass,
      // Callbacks
      renderTab: this.renderTab,
      // onTabShown: this.onTabShown,
      rememberTabSelections: this.rememberTabSelections,

      // (Not an option)
      onRememberTabSelection: this.onRememberTabSelection.bind(this),
    };

    const codeGroups = groups.map(
      (instances) => new CodeplusGroup(instances, groupOptions)
    );

    if (this.debug) console.log("Codeplus groups", codeGroups);

    return codeGroups;
  }
  render() {
    this.insertCSS();

    this.groups.forEach((group) => {
      group.render();
    });
  }
  insertCSS() {
    let style = document.createElement("style");
    style.innerHTML = css;
    document.head.appendChild(style);
  }
  onRememberTabSelection(name) {
    // Make all visible groups show the same tab if it exists
    this.groups.forEach((group) => {
      const index = group.instances.findIndex(
        (instance) => instance.getRememberName() === name
      );
      if (index !== -1) {
        group.showTab(index);
      }
    });
  }
}

export default Codeplus;
