import React, { Component } from "react";
import "./ArticleTemplate.styl";
import SmoothScroll from "../../components/smooth-scroll/SmoothScroll";
import withAuthorization from "../../components/withAuthorization";
import Footer from "../../layout/Footer";
import DOMPurify from "dompurify";
import { db } from "../../firebase";
import AuthUserContext from "../../components/AuthUserContext";

class ArticleTemplate extends Component {
  state = { markdown: "<p>loading...</p>", links: [], imageLink: null };
  componentDidMount() {
    db.loadFolderIfExists("media").then(mediaItems => {
      this.setState({ mediaItems }, () => {
        const { path } = this.props;
        if (path) {
          import(`../${path}.md`).then(markdown => {
            const { mediaItems } = this.state;
            let mediaItemNames = Object.keys(mediaItems);
            console.log(mediaItemNames);

            let newMarkdown = mediaItemNames.reduce((acc, name) => {
              const regex = new RegExp(name, "gi");
              return acc.replace(
                regex,
                `<img class="markdown-image" src="${mediaItems[name]}"/>`
              );
            }, markdown.default);

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
