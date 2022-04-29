export default function parse(code) {
  let firstLine = code.trim().split("\n")[0];
  let commentContents;
  if (firstLine.startsWith("#")) {
    commentContents = firstLine.substring(1).trim();
  } else if (firstLine.startsWith("//")) {
    commentContents = firstLine.substring(2).trim();
  }

  if (commentContents) {
    let regex = /(\S+\.\S+)\s*(\(([^\)]+)\))?\s*(-\s+(.+))?/;
    let match = regex.exec(commentContents);

    if (match) {
      return {
        filename: match[1] || "",
        displayName: match[3] || "",
        groupName: match[5] || "",
      };
    }
  }

  return {
    filename: "",
    displayName: "",
    groupName: "",
  };
}
