export default function parse(code) {
  let firstLine = code.trim().split("\n")[0];
  let commentContents;
  if (firstLine.startsWith("#")) {
    commentContents = firstLine.substring(1).trimStart();
  } else if (firstLine.startsWith("//")) {
    commentContents = firstLine.substring(2).trimStart();
  } else if (firstLine.startsWith("/*")) {
    commentContents = firstLine.substring(2).trimStart();
  } else if (firstLine.startsWith("<!--")) {
    commentContents = firstLine.substring(4).trimStart();
  }

  if (commentContents) {
    let regex = /^(\S*\.\S+)?\s*(\(([^\)]+)\))?/;
    let match = regex.exec(commentContents);

    if (match) {
      return {
        filename: match[1] || "",
        displayName: match[3] || "",
      };
    }
  }

  return {
    filename: "",
    displayName: "",
  };
}
