import createPlugin from "./createPlugin";

const REGEXES = {
  LINK: /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g,
  HASHTAG: /\#[\w\u0590-\u05ff]+/g
};

export const LinkPlugin = createPlugin("LINK", "link-span", REGEXES.LINK);
export const HashtagPlugin = createPlugin(
  "HASHTAG",
  "hashtag-span",
  REGEXES.HASHTAG
);

export const testText = (type, text) => {
  return REGEXES[type].exec(text);
};
