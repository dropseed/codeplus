import parse from "./parse";

test("parse filename", () => {
  const parsed = parse("# filename.js\nfunction foo() {}");
  expect(parsed).toEqual({
    filename: "filename.js",
    displayName: "",
    groupName: "",
  });
});


test("parse display without filename", () => {
  const parsed = parse("# (GitHub with spaces)\nfunction foo() {}");
  expect(parsed).toEqual({
    filename: "",
    displayName: "GitHub with spaces",
    groupName: "",
  });
});

test("parse filename and display", () => {
  const parsed = parse("# filename.js (GitHub with spaces)\nfunction foo() {}");
  expect(parsed).toEqual({
    filename: "filename.js",
    displayName: "GitHub with spaces",
    groupName: "",
  });
});

test("parse filename, display, group", () => {
  const parsed = parse("# filename.js (GitHub with spaces) - group example\nfunction foo() {}");
  expect(parsed).toEqual({
    filename: "filename.js",
    displayName: "GitHub with spaces",
    groupName: "group example",
  });
});
