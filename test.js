/**
 * @jest-environment jsdom
 */

import parse from "./parse";
import { CodeplusInstance } from "./index";

test("parse # filename", () => {
  expect(parse("# filename.js\nfunction foo() {}")).toEqual({
    filename: "filename.js",
    displayName: "",
  });
});

test("parse // filename", () => {
  expect(parse("// filename.js\nfunction foo() {}")).toEqual({
    filename: "filename.js",
    displayName: "",
  });
});

test("parse /* filename", () => {
  expect(parse("/* filename.js */\nfunction foo() {}")).toEqual({
    filename: "filename.js",
    displayName: "",
  });
});

test("parse <!-- filename", () => {
  expect(parse("<!-- filename.js -->\nfunction foo() {}")).toEqual({
    filename: "filename.js",
    displayName: "",
  });
});

test("parse filename multiple dots", () => {
  expect(parse("# test.filename.template.js\nfunction foo() {}")).toEqual({
    filename: "test.filename.template.js",
    displayName: "",
  });

  expect(
    parse("# test.filename.template.js (Display)\nfunction foo() {}")
  ).toEqual({
    filename: "test.filename.template.js",
    displayName: "Display",
  });
});

test("parse dotfile name", () => {
  expect(parse("# .env\nfunction foo() {}")).toEqual({
    filename: ".env",
    displayName: "",
  });
});

test("parse display without filename", () => {
  expect(parse("# (GitHub with spaces)\nfunction foo() {}")).toEqual({
    filename: "",
    displayName: "GitHub with spaces",
  });
});

test("parse filename and display", () => {
  expect(
    parse("# filename.js (GitHub with spaces) - more here\nfunction foo() {}")
  ).toEqual({
    filename: "filename.js",
    displayName: "GitHub with spaces",
  });
});

test("nav with filename", () => {
  const node = document.createElement("code");
  const instance = new CodeplusInstance(node, {});
  instance.filename = "filename.js";
  expect(instance.getNavName()).toEqual("filename.js");
});

test("nav with display name", () => {
  const node = document.createElement("code");
  const instance = new CodeplusInstance(node, {});
  instance.displayName = "Test";
  expect(instance.getNavName()).toEqual("Test");
});

test("nav with filename and display", () => {
  const node = document.createElement("code");
  const instance = new CodeplusInstance(node, {});
  instance.filename = "filename.js";
  instance.displayName = "Test";
  expect(instance.getNavName()).toEqual("filename.js (Test)");
});
