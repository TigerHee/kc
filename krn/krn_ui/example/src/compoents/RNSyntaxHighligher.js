/**
 * Owner: willen@kupotech.com
 */
import React from "react";
import { Text, View, Platform, TextInput } from "react-native";
import Highlighter from "react-syntax-highlighter";
import { createStyleObject } from "react-syntax-highlighter/dist/esm/create-element";
import { darcula } from "react-syntax-highlighter/dist/esm/styles/hljs";
import styled from "@emotion/native";

const styleCache = new Map();
``;

const ExtendTextInput = styled.TextInput``;

const topLevelPropertiesToRemove = [
  "color",
  "textShadow",
  "textAlign",
  "whiteSpace",
  "wordSpacing",
  "wordBreak",
  "wordWrap",
  "lineHeight",
  "MozTabSize",
  "OTabSize",
  "tabSize",
  "WebkitHyphens",
  "MozHyphens",
  "msHyphens",
  "hyphens",
  "fontFamily",
];

const ExtendView = ({ children }) => {
  return (
    <ExtendTextInput multiline editable={false}>
      {children[1].map((item) => item)}
    </ExtendTextInput>
  );
};

function generateNewStylesheet({ stylesheet }) {
  if (styleCache.has(stylesheet)) {
    return styleCache.get(stylesheet);
  }
  // I don't know why, but sometimes 'stylesheet' comes as an Array
  // like this [{ stylesheet }, { opacity: 0.85 }], instead of an Object,
  // so this throws an error referenced at issue #17
  // So, this is a workaround, if the  stylesheet is an Array,
  // returns the first element, wich is the actual style object.
  stylesheet = Array.isArray(stylesheet) ? stylesheet[0] : stylesheet;
  const transformedStyle = Object.entries(stylesheet).reduce(
    (newStylesheet, [className, style]) => {
      newStylesheet[className] = Object.entries(style).reduce(
        (newStyle, [key, value]) => {
          if (key === "overflowX" || key === "overflow") {
            newStyle.overflow = value === "auto" ? "scroll" : value;
          } else if (value.includes("em")) {
            const [num] = value.split("em");
            newStyle[key] = Number(num) * 16;
          } else if (key === "background") {
            newStyle.backgroundColor = value;
          } else if (key === "display") {
            return newStyle;
          } else {
            newStyle[key] = value;
          }
          return newStyle;
        },
        {}
      );
      return newStylesheet;
    },
    {}
  );
  const topLevel = transformedStyle.hljs;
  const defaultColor = (topLevel && topLevel.color) || "#000";
  topLevelPropertiesToRemove.forEach((property) => {
    if (topLevel[property]) {
      delete topLevel[property];
    }
  });
  if (topLevel.backgroundColor === "none") {
    delete topLevel.backgroundColor;
  }
  styleCache.set(stylesheet, { transformedStyle, defaultColor });
  return { transformedStyle, defaultColor };
}

function createChildren({ stylesheet, fontSize, fontFamily }) {
  let childrenCount = 0;
  return (children, defaultColor) => {
    childrenCount += 1;
    return children.map((child, i) =>
      createNativeElement({
        node: child,
        stylesheet,
        key: `code-segment-${childrenCount}-${i}`,
        defaultColor,
        fontSize,
        fontFamily,
      })
    );
  };
}

function createNativeElement({
  node,
  stylesheet,
  key,
  defaultColor,
  fontFamily,
  fontSize = 12,
}) {
  const { properties, type, tagName: TagName, value } = node;
  const startingStyle = { fontFamily, fontSize, height: fontSize + 5 };
  if (type === "text") {
    return (
      <Text
        key={key}
        style={Object.assign({ color: defaultColor }, startingStyle)}
      >
        {value}
      </Text>
    );
  } else if (TagName) {
    const childrenCreator = createChildren({
      stylesheet,
      fontSize,
      fontFamily,
    });
    const style = createStyleObject(
      properties.className,
      Object.assign({ color: defaultColor }, properties.style, startingStyle),
      stylesheet
    );
    const children = childrenCreator(
      node.children,
      style.color || defaultColor
    );
    return (
      <Text key={key} style={style}>
        {children}
      </Text>
    );
  }
}

function nativeRenderer({ defaultColor, fontFamily, fontSize }) {
  return ({ rows, stylesheet }) =>
    rows.map((node, i) =>
      createNativeElement({
        node,
        stylesheet,
        key: `code-segment-${i}`,
        defaultColor,
        fontFamily,
        fontSize,
      })
    );
}

function NativeSyntaxHighlighter({ fontFamily, fontSize, children, ...rest }) {
  const { transformedStyle, defaultColor } = generateNewStylesheet({
    stylesheet: darcula,
  });
  return (
    <Highlighter
      {...rest}
      style={transformedStyle}
      horizontal={true}
      renderer={nativeRenderer({
        defaultColor,
        fontFamily,
        fontSize,
      })}
    >
      {children}
    </Highlighter>
  );
}

NativeSyntaxHighlighter.defaultProps = {
  fontFamily: Platform.OS === "ios" ? "Menlo-Regular" : "monospace",
  fontSize: 12,
  PreTag: View,
  CodeTag: ExtendView,
};

export default NativeSyntaxHighlighter;
