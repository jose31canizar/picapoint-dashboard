import React, { Component } from "react";
import "./ArticleTemplate.styl";
import SmoothScroll from "../../../components/smooth-scroll/SmoothScroll";
import withAuthorization from "../../../components/withAuthorization";
import Footer from "../../../layout/Footer";
import DOMPurify from "dompurify";
import { db } from "../../../firebase";
import { convertFromRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import { stateToHTML } from "draft-js-export-html";
import { styleMap, colorStyleMap } from "../editable/EditableTemplate";
import AuthUserContext from "../../../components/AuthUserContext";

function styleReducer(acc, style, i) {
  switch (style[0]) {
    case "H3":
      return {
        ...acc,
        [style[0]]: {
          attributes: { id: `scroll-item-${i}` },
          element: "H3",
          style: style[1]
        }
      };
    default:
      return {
        ...acc,
        [style[0]]: {
          style: style[1]
        }
      };
  }
}

class ArticleTemplate extends Component {
  state = { markdown: "<p>loading...</p>", links: [], imageLink: null };
  componentDidMount() {
    db.loadFolderIfExists("media").then(mediaItems => {
      this.setState({ mediaItems }, () => {
        const { path } = this.props;
        console.log(path);

        if (path) {
          db.loadPageIfExists(path)
            .then(data => {
              console.log("data", data);
              if (!data) {
                return null;
              }

              const customColorMap = data.blocks
                .flatMap(block =>
                  block.inlineStyleRanges.filter(range => {
                    return range.style.startsWith("CUSTOM_COLOR");
                  })
                )
                .reduce(
                  (acc, r) => ({
                    ...acc,
                    [r.style]: { color: r.style.substring(13) }
                  }),
                  {}
                );

              let newMap = Object.entries({
                ...customColorMap,
                ...styleMap,
                ...colorStyleMap
              }).reduce((acc, style, i) => styleReducer(acc, style, i), {});

              let options = {
                inlineStyles: newMap
              };

              return stateToHTML(convertFromRaw(data), options);
            })
            .then(markdown => {
              if (!markdown) {
                return null;
              }
              const { mediaItems } = this.state;
              if (!mediaItems) {
                this.setState({ markdown });
                return null;
              }

              let mediaItemNames = Object.keys(mediaItems);

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

                  console.log("collection", collection);

                  const links = [].slice
                    .call(collection)
                    .map((item, i) => ({ name: item.innerText, id: item.id }));
                  this.setState({ links });
                }
              );
            })
            .catch(err => {
              console.log(err);
              this.setState({
                markdown: "<p>This page does not exist yet.</p>"
              });
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
              {links.map(({ name, id }, i) => (
                <SmoothScroll section={id} key={i} className="smooth-scroll">
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
