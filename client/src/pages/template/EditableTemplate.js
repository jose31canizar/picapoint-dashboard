import React, { Component } from "react";
import withAuthorization from "../../components/withAuthorization";
import {
  Editor,
  EditorState,
  RichUtils,
  Modifier,
  getDefaultKeyBinding,
  KeyBindingUtil
} from "draft-js";
import "draft-js/dist/Draft.css";
import CodeUtils from "draft-js-code";
import "./EditableTemplate.styl";
import ColorPicker, { colorPickerPlugin } from "draft-js-color-picker";
import { mdToDraftjs, draftjsToMd } from "draftjs-md-converter";

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

const colorStyleMap = {
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
    fontFamily: "'Avenir', serif"
  },
  editor: {
    borderTop: "1px solid #ddd",
    cursor: "text",
    marginTop: 20,
    fontSize: "1rem",
    minHeight: 400,
    paddingTop: 20
  },
  controls: {
    fontFamily: "'Avenir', sans-serif",
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

const styleMap = {
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

function getBlockStyle(block) {
  switch (block.getType()) {
    case "blockquote":
      return "RichEditor-blockquote";
    default:
      return null;
  }
}

class EditableTemplate extends Component {
  getEditorState = () => this.state.editorState;
  onChange = editorState => this.setState({ editorState });
  picker = colorPickerPlugin(this.onChange, this.getEditorState);
  state = {
    editorState: EditorState.createEmpty()
  };
  componentDidMount() {
    this.focus();
  }
  focus = () => this.editor.focus();

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
    let newState;

    if (command === "editor-save") {
      console.log("save file");
      console.log(editorState.getCurrentContent().getPlainText());
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

  render() {
    const { editorState } = this.state;
    return (
      <div class="article rich-editor" style={styles.root}>
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
          />
        </div>
      </div>
    );
  }
}

const authCondition = authUser => !!authUser;

export default withAuthorization(authCondition)(EditableTemplate);
