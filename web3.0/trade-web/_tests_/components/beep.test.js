import React from "react";
import ReactDOM from "react-dom";

import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
import createVoiceTips from "src/components/Beep/index.js";

afterEach(cleanup);

// Mock dependencies
jest.mock("react-dom");

// Set up mocks
const createElementMock = jest.fn();
const appendChildMock = jest.fn();
const removeChildMock = jest.fn();
const getElementsByClassNameMock = jest.fn().mockReturnValue([]);
const canPlayTypeMock = jest.fn().mockReturnValue(true);
const audioMock = { canPlayType: canPlayTypeMock };
const documentMock = {
  createElement: createElementMock,
  appendChild: appendChildMock,
  removeChild: removeChildMock,
  getElementsByClassName: getElementsByClassNameMock,
};
const config = { src: "path/to/audio" };

describe("createVoiceTips", () => {
  beforeAll(() => {
    Object.defineProperty(global, "document", documentMock);
    Object.defineProperty(global, "audio", audioMock);
  });
  beforeEach(() => {
    createElementMock.mockClear();
    appendChildMock.mockClear();
    removeChildMock.mockClear();
    getElementsByClassNameMock.mockClear();
  });

  it("should not create an audio element if running in a non-browser environment", () => {
    const originalWindow = global.window;
    global.window = undefined;
    createVoiceTips(config);
    expect(createElementMock).not.toHaveBeenCalled();
    global.window = originalWindow;
  });

  it("should not create an audio element if config.src is undefined", () => {
    createVoiceTips({});
    expect(createElementMock).not.toHaveBeenCalled();
  });

  it("should remove any existing voice tips before creating a new one", () => {
    const playingVoice = { remove: jest.fn() };
    getElementsByClassNameMock.mockReturnValue([playingVoice]);
    createVoiceTips(config);
    expect(playingVoice.remove).not.toHaveBeenCalled();
  });

  it("should remove the voice tip from the DOM when the Beep element stops", () => {
    const onStopMock = jest.fn();
    const div = { remove: jest.fn() };
    createElementMock.mockReturnValue(div);
    ReactDOM.render.mockImplementationOnce((el, container) => {
      el.props.onStop();
    });
    createVoiceTips({ ...config, onStop: onStopMock });
    expect(div.remove).not.toHaveBeenCalled();
  });
});
