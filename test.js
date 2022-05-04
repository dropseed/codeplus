/**
 * @jest-environment jsdom
 */

import parse from "./parse";
import { CodeplusInstance } from "./index";

test("parse # filename", () => {
  const parsed = parse("# filename.js\nfunction foo() {}");
  expect(parsed).toEqual({
    filename: "filename.js",
    displayName: "",
  });
});

test("parse // filename", () => {
  const parsed = parse("// filename.js\nfunction foo() {}");
  expect(parsed).toEqual({
    filename: "filename.js",
    displayName: "",
  });
});

test("parse /* filename", () => {
  const parsed = parse("/* filename.js */\nfunction foo() {}");
  expect(parsed).toEqual({
    filename: "filename.js",
    displayName: "",
  });
});

test("parse <!-- filename", () => {
  const parsed = parse("<!-- filename.js -->\nfunction foo() {}");
  expect(parsed).toEqual({
    filename: "filename.js",
    displayName: "",
  });
});

test("parse filename multiple dots", () => {
  const parsed = parse("# test.filename.template.js\nfunction foo() {}");
  expect(parsed).toEqual({
    filename: "test.filename.template.js",
    displayName: "",
  });
});

test("parse display without filename", () => {
  const parsed = parse("# (GitHub with spaces)\nfunction foo() {}");
  expect(parsed).toEqual({
    filename: "",
    displayName: "GitHub with spaces",
  });
});

test("parse filename and display", () => {
  const parsed = parse(
    "# filename.js (GitHub with spaces) - more here\nfunction foo() {}"
  );
  expect(parsed).toEqual({
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
