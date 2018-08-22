import React, { Component } from "react";
import "./PageTemplate.styl";
import SmoothScroll from "../../components/smooth-scroll/SmoothScroll";
import Footer from "../../layout/Footer";
export default class PageTemplate extends Component {
  state = {
    markdown: "<p>loading...</p>"
  };
  componentDidMount() {
    const { path } = this.props;
    if (path) {
      import(`../${path}.md`)
        .then(res => {
          return res;
        })
        .then(markdown => this.setState({ markdown: markdown.default }));
    }
  }
  render() {
    const { style, className } = this.props;
    const { markdown } = this.state;
    return (
      <div class={`page ${className}`} style={style && style}>
        <section>
          <article dangerouslySetInnerHTML={{ __html: markdown }} />
          <aside>
            <ol class="sidebar-menu">
              {[
                "logo",
                "farger",
                "typografi",
                "dekorelement",
                "trivselsgaranti"
              ].map((name, i) => (
                <SmoothScroll section={name} key={i} className="smooth-scroll">
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
