import React, { Component } from "react";
import withAuthorization from "../../components/withAuthorization";
import {
  Editor,
  EditorState,
  RichUtils,
  Modifier,
  getDefaultKeyBinding,
  KeyBindingUtil,
  convertToRaw,
  convertFromRaw,
  convertFromHTML,
  CompositeDecorator
} from "draft-js";
import "draft-js/dist/Draft.css";
import CodeUtils from "draft-js-code";
import "./EditableTemplate.styl";
import ColorPicker, { colorPickerPlugin } from "draft-js-color-picker";
import { mdToDraftjs, draftjsToMd } from "draftjs-md-converter";
import { db, storage } from "../../firebase";
import Notification from "../../items/notification/Notification";
import Suggestions from "../../items/suggestions/Suggestions";
import { Map } from "immutable";

const presetColors = [
  "#ff00aa",
  "#F5A623",
  "#F8E71C",
  "#8B572A",
  "#7ED321",
  "#417505",
  "#BD10E0",
  "#9013FE",
  "#4A90E2",
  "#50E3C2",
  "#B8E986",
  "#000000",
  "#4A4A4A",
  "#9B9B9B",
  "#FFFFFF"
];

const { hasCommandModifier } = KeyBindingUtil;

var COLORS = [
  { label: "Red", style: "red" },
  { label: "Orange", style: "orange" },
  { label: "Yellow", style: "yellow" },
  { label: "Green", style: "green" },
  { label: "Blue", style: "blue" },
  { label: "Indigo", style: "indigo" },
  { label: "Violet", style: "violet" }
];

const ColorControls = props => {
  var currentStyle = props.editorState.getCurrentInlineStyle();
  return (
    <div style={styles.controls}>
      {COLORS.map((type, i) => (
        <StyleButton
          key={"style-button" + i}
          active={currentStyle.has(type.style)}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
        />
      ))}
    </div>
  );
};

export const colorStyleMap = {
  red: {
    color: "rgba(255, 0, 0, 1.0)"
  },
  orange: {
    color: "rgba(255, 127, 0, 1.0)"
  },
  yellow: {
    color: "rgba(180, 180, 0, 1.0)"
  },
  green: {
    color: "rgba(0, 180, 0, 1.0)"
  },
  blue: {
    color: "rgba(0, 0, 255, 1.0)"
  },
  indigo: {
    color: "rgba(75, 0, 130, 1.0)"
  },
  violet: {
    color: "rgba(127, 0, 255, 1.0)"
  }
};

const styles = {
  root: {
    fontFamily: "Work Sans, serif"
  },
  editor: {
    borderTop: "1px solid #ddd",
    cursor: "text",
    marginTop: 20,
    fontSize: "1rem",
    minHeight: 400,
    paddingTop: 20,
    width: "100%"
  },
  controls: {
    marginBottom: 10,
    userSelect: "none"
  },
  styleButton: {
    color: "#999",
    cursor: "pointer",
    marginRight: 16,
    padding: "2px 0"
  }
};

class StyleButton extends React.Component {
  constructor(props) {
    super(props);
    this.onToggle = e => {
      e.preventDefault();
      this.props.onToggle(this.props.style);
    };
  }
  render() {
    let style;
    if (this.props.active) {
      style = { ...styles.styleButton, ...colorStyleMap[this.props.style] };
    } else {
      style = styles.styleButton;
    }
    return (
      <span style={style} onMouseDown={this.onToggle}>
        {this.props.label}
      </span>
    );
  }
}

export const styleMap = {
  STRIKETHROUGH: {
    textDecoration: "line-through"
  },
  H1: {
    fontSize: "4rem"
  },
  H2: {
    fontSize: "2rem"
  },
  H3: {
    fontSize: "1.625rem"
  },
  p: {
    fontSize: "1rem"
  }
};

const blockRenderMap = Map({
  "header-one": {
    element: "h1"
  },
  "header-two": {
    element: "h2"
  },
  "header-three": {
    element: "h3"
  },
  unstyled: {
    element: "p"
  }
});

var INLINE_STYLES = [
  { label: "Bold", style: "BOLD" },
  { label: "Italic", style: "ITALIC" },
  { label: "Underline", style: "UNDERLINE" },
  { label: "Monospace", style: "CODE" },
  { label: "Strikethrough", style: "STRIKETHROUGH" },
  { label: "H1", style: "H1" },
  { label: "H2", style: "H2" },
  { label: "H3", style: "H3" },
  { label: "p", style: "p" }
];

const InlineStyleControls = props => {
  const currentStyle = props.editorState.getCurrentInlineStyle();

  return (
    <div class="RichEditor-controls">
      {INLINE_STYLES.map(type => (
        <StyleButton
          key={type.label}
          active={currentStyle.has(type.style)}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
        />
      ))}
    </div>
  );
};

function blockRenderer(contentBlock) {
  const type = contentBlock.getType();
  if (type === "atomic") {
    return {
      component: <div>I AM A COMPONENT</div>,
      editable: false,
      props: {
        foo: "bar"
      }
    };
  }
}

function getBlockStyle(block) {
  switch (block.getType()) {
    case "blockquote":
      return "superFancyBlockquote";
    case "header-one":
      console.log("h1 detected!");
      return "header-one";
    default:
      return null;
  }
}

const Hashtag = ({ children }) => {
  return <span style={{ background: "lightBlue" }}>{children}</span>;
};

const findHashtagEntities = (contentBlock, callback, contentState) => {
  contentBlock.findEntityRanges(character => {
    const entityKey = character.getEntity();
    return (
      entityKey !== null &&
      contentState.getEntity(entityKey).getType() === "HASHTAG"
    );
  }, callback);
};

class EditableTemplate extends Component {
  getEditorState = () => this.state.editorState;

  picker = colorPickerPlugin(this.onChange, this.getEditorState);
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(
        new CompositeDecorator([
          {
            strategy: findHashtagEntities,
            component: Hashtag
          }
        ])
      ),
      savePageMessage: null,
      autocompleteState: null
    };
  }

  componentDidMount() {
    const { editing } = this.props;

    db.loadPageIfExists(editing).then(content => {
      if (content) {
        this.setState({
          editorState: EditorState.createWithContent(convertFromRaw(content))
        });
      }
    });
    this.focus();
  }
  focus = () => this.editor.focus();
  onChange = editorState =>
    this.setState({ editorState }, () => {
      const triggerRange = this.getTriggerRange("#");
      if (!triggerRange) {
        this.setState({ autocompleteState: null });
        return;
      }

      this.setState({
        autocompleteState: {
          searchText: triggerRange.text.slice(1, triggerRange.text.length),
          cursor: {
            x: triggerRange.x,
            y: triggerRange.y
          }
        }
      });
    });

  getInsertRange = (autocompleteState, editorState) => {
    const currentSelectionState = editorState.getSelection();
    const end = currentSelectionState.getAnchorOffset();
    const anchorKey = currentSelectionState.getAnchorKey();
    const currentContent = editorState.getCurrentContent();
    const currentBlock = currentContent.getBlockForKey(anchorKey);
    const blockText = currentBlock.getText();
    const start = blockText.substring(0, end).lastIndexOf("#");

    return {
      start,
      end
    };
  };
  getTriggerRange = trigger => {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return null;
    const range = selection.getRangeAt(0);
    const text = range.startContainer.textContent.substring(
      0,
      range.startOffset
    );
    if (/s+$/.test(text)) return null;
    const index = text.lastIndexOf(trigger);
    if (index === -1) return null;

    const { x, y } = range.getBoundingClientRect();

    return {
      text: text.substring(index),
      start: index,
      end: range.startOffset,
      x,
      y
    };
  };

  toggleColor = toggledColor => {
    const { editorState } = this.state;
    const selection = editorState.getSelection();
    // Let's just allow one color at a time. Turn off all active colors.
    const nextContentState = Object.keys(colorStyleMap).reduce(
      (contentState, color) => {
        return Modifier.removeInlineStyle(contentState, selection, color);
      },
      editorState.getCurrentContent()
    );
    let nextEditorState = EditorState.push(
      editorState,
      nextContentState,
      "change-inline-style"
    );
    const currentStyle = editorState.getCurrentInlineStyle();
    // Unset style override for current color.
    if (selection.isCollapsed()) {
      nextEditorState = currentStyle.reduce((state, color) => {
        return RichUtils.toggleInlineStyle(state, color);
      }, nextEditorState);
    }
    // If the color is being toggled on, apply it.
    if (!currentStyle.has(toggledColor)) {
      nextEditorState = RichUtils.toggleInlineStyle(
        nextEditorState,
        toggledColor
      );
    }
    console.log("toggled color");
    this.onChange(nextEditorState);
  };

  handleKeyCommand = command => {
    const { editorState } = this.state;
    const { editing } = this.props;
    let newState;

    if (command === "editor-save") {
      console.log(editorState.getCurrentContent().getPlainText());
      storage
        .savePage(
          editing,
          JSON.stringify(convertToRaw(editorState.getCurrentContent()))
        )
        .then(() => {
          console.log("saved the file!");

          this.setState(
            {
              savePageMessage: `saved ${editing} page`
            },
            () =>
              setTimeout(() => {
                this.setState({ savePageMessage: null });
              }, 2000)
          );
        });

      return "handled";
    }

    if (CodeUtils.hasSelectionInBlock(editorState)) {
      newState = CodeUtils.handleKeyCommand(editorState, command);
    }

    if (!newState) {
      newState = RichUtils.handleKeyCommand(editorState, command);
    }

    if (newState) {
      this.onChange(newState);
      return "handled";
    }
    return "not-handled";
  };
  toggleInlineStyle = inlineStyle => {
    console.log(inlineStyle);
    this.onChange(
      RichUtils.toggleInlineStyle(this.state.editorState, inlineStyle)
    );
  };

  mapKeyToEditorCommand = e => {
    const { editorState } = this.state;

    if (e.keyCode === 83 && hasCommandModifier(e)) {
      return "editor-save";
    }

    if (!CodeUtils.hasSelectionInBlock(editorState))
      return getDefaultKeyBinding(e);

    const command = CodeUtils.getKeyBinding(e);

    return command || getDefaultKeyBinding(e);
  };

  onTab = e => {
    const { editorState } = this.state;
    if (CodeUtils.hasSelectionInBlock(editorState)) {
      return "not-handled";
    }

    this.onChange(CodeUtils.onTab(e, editorState));

    return "handled";
  };

  handleReturn = e => {
    const { editorState } = this.state;
    if (CodeUtils.hasSelectionInBlock(editorState)) return "not-handled";

    this.onChange(CodeUtils.handleReturn(e, editorState));

    return "handled";
  };

  addHashTag = (editorState, autocompleteState, hashtag) => {
    /* 1 */
    const { start, end } = this.getInsertRange(autocompleteState, editorState);

    /* 2 */
    const currentSelectionState = editorState.getSelection();
    const selection = currentSelectionState.merge({
      anchorOffset: start,
      focusOffset: end
    });

    /* 3 */
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity(
      "HASHTAG",
      "IMMUTABLE",
      {
        hashtag
      }
    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();

    console.log(hashtag);

    /* 4 */
    let newContentState = Modifier.replaceText(
      contentStateWithEntity,
      selection,
      `#${hashtag}`,
      null,
      entityKey
    );

    /* 5 */
    const newEditorState = EditorState.push(
      editorState,
      newContentState,
      `insert-hashtag`
    );

    return EditorState.forceSelection(
      newEditorState,
      newContentState.getSelectionAfter()
    );
  };

  renderSuggestion = text => {
    const { editorState, autocompleteState } = this.state;

    this.onChange(this.addHashTag(editorState, autocompleteState, text));

    this.setState({ autocompleteState: null });
  };

  render() {
    const { editorState, savePageMessage, autocompleteState } = this.state;
    return (
      <div class="article rich-editor" style={styles.root}>
        {savePageMessage && <Notification text={savePageMessage} />}
        <ColorPicker
          toggleColor={color => this.picker.addColor(color)}
          presetColors={presetColors}
          color={this.picker.currentColor(editorState)}
        />
        <InlineStyleControls
          editorState={editorState}
          onToggle={this.toggleInlineStyle}
        />
        <ColorControls editorState={editorState} onToggle={this.toggleColor} />
        <div style={styles.editor} onClick={this.focus}>
          <Editor
            tabIndex="5"
            blockStyleFn={getBlockStyle}
            customStyleFn={this.picker.customStyleFn}
            customStyleMap={{ ...styleMap, ...colorStyleMap }}
            editorState={editorState}
            handleKeyCommand={this.handleKeyCommand}
            onChange={this.onChange}
            keyBindingFn={this.mapKeyToEditorCommand}
            placeholder="Tell a story..."
            handleReturn={this.handleReturn}
            onTab={this.onTab}
            spellCheck={true}
            ref={ref => (this.editor = ref)}
            blockRendererFn={blockRenderer}
          />
          <Suggestions
            autocompleteState={autocompleteState}
            renderSuggestion={text => this.renderSuggestion(text)}
          />
        </div>
      </div>
    );
  }
}

const authCondition = authUser => !!authUser;

export default withAuthorization(authCondition)(EditableTemplate);
