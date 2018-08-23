import React, { Component } from "react";
import "./PageTemplate.styl";
import SmoothScroll from "../../components/smooth-scroll/SmoothScroll";
import Footer from "../../layout/Footer";
export default class PageTemplate extends Component {
  state = { markdown: "<p>loading...</p>", links: [] };
  componentDidMount() {
    const { path } = this.props;
    if (path) {
      import(`../${path}.md`)
        .then(res => {
          console.log();
          return res;
        })
        .then(markdown => {
          this.setState(
            {
              markdown: markdown.default
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
  }
  render() {
    const { style, className } = this.props;
    const { markdown, links } = this.state;
    return (
      <div class={`page ${className}`} style={style && style}>
        <section>
          <article dangerouslySetInnerHTML={{ __html: markdown }} />
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
