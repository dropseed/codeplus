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
    // Pattern with a link
    let linkRegex = /^(\S*\.\S+)?\s*\[([^\]]+)\]\(([^\)]+)\)/;
    let linkMatch = linkRegex.exec(commentContents);

    if (linkMatch) {
      return {
        filename: linkMatch[1] || "",
        displayName: linkMatch[2] || "",
        url: linkMatch[3],
      };
    }

    // Pattern without a link
    let regex = /^(\S*\.\S+)?\s*(\(([^\)]+)\))?/;
    let match = regex.exec(commentContents);

    if (match) {
      return {
        filename: match[1] || "",
        displayName: match[3] || "",
        url: "",
      };
    }
  }

  return {
    filename: "",
    displayName: "",
    url: "",
  };
}
