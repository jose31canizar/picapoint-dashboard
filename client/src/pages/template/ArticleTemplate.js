import React, { Component } from "react";
import "./ArticleTemplate.styl";
import SmoothScroll from "../../components/smooth-scroll/SmoothScroll";
import withAuthorization from "../../components/withAuthorization";
import Footer from "../../layout/Footer";
import DOMPurify from "dompurify";
import { db } from "../../firebase";
import { convertFromRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import { stateToHTML } from "draft-js-export-html";
import { styleMap, colorStyleMap } from "./EditableTemplate";
import AuthUserContext from "../../components/AuthUserContext";

class ArticleTemplate extends Component {
  state = { markdown: "<p>loading...</p>", links: [], imageLink: null };
  componentDidMount() {
    db.loadFolderIfExists("media").then(mediaItems => {
      this.setState({ mediaItems }, () => {
        const { path } = this.props;
        if (path) {
          db.loadPageIfExists(path)
            .then(data => {
              console.log("json", data);
              console.log(styleMap);

              let newMap = Object.entries({
                ...styleMap,
                ...colorStyleMap
              }).reduce(
                (acc, style) => ({ ...acc, [style[0]]: { style: style[1] } }),
                {}
              );

              console.log(newMap);

              let options = {
                inlineStyles: {
                  ...newMap,
                  // Override default element (`strong`).
                  BOLD: { element: "b" },
                  ITALIC: {
                    // Add custom attributes. You can also use React-style `className`.
                    attributes: { class: "foo" },
                    // Use camel-case. Units (`px`) will be added where necessary.
                    style: { fontSize: 12 }
                  },
                  // Use a custom inline style. Default element is `span`.
                  RED: { style: { color: "#900" } }
                }
              };

              return stateToHTML(convertFromRaw(data), options);
            })
            .then(markdown => {
              const { mediaItems } = this.state;
              let mediaItemNames = Object.keys(mediaItems);
              console.log(mediaItemNames);

              let newMarkdown = mediaItemNames.reduce((acc, name) => {
                const regex = new RegExp(`\\[${name}\\]`, "g");
                return acc.replace(
                  regex,
                  `<img class="markdown-image" src="${mediaItems[name]}"/>`
                );
              }, markdown);

              this.setState(
                {
                  markdown: newMarkdown
                },
                () => {
                  const collection = document
                    .querySelector("article")
                    .getElementsByTagName("H3");

                  const links = [].slice
                    .call(collection)
                    .map(item => item.innerText);
                  this.setState({ links });
                }
              );
            });
        }
      });
    });
  }
  render() {
    const { style, className, path } = this.props;
    const { markdown, links, imageLink } = this.state;

    return (
      <div class="article">
        <section className={className}>
          <article
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(markdown)
            }}
          />
          <aside>
            <ol class="sidebar-menu">
              {links.map((name, i) => (
                <SmoothScroll
                  section={name.replace(/\s+/g, "-").toLowerCase()}
                  key={i}
                  className="smooth-scroll"
                >
                  <li>{name}</li>
                </SmoothScroll>
              ))}
            </ol>
          </aside>
          <Footer />
        </section>
      </div>
    );
  }
}

const authCondition = authUser => !!authUser;

export default withAuthorization(authCondition)(ArticleTemplate);
