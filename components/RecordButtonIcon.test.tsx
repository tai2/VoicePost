import { render, screen, fireEvent } from "@testing-library/react-native";
import { RecordButtonIcon } from "./RecordButtonIcon";

describe("<RecordButtonIcon />", () => {
  const onStart = jest.fn();
  const onStop = jest.fn();

  describe("Given isRecording is true", () => {
    const isRecording = true;

    describe("When rendered", () => {
      it("should render accessibility label", () => {
        render(
          <RecordButtonIcon
            height={100}
            isRecording={isRecording}
            onStart={onStart}
            onStop={onStop}
          />
        );

        screen.getByLabelText("録音を停止する");
      });
    });

    describe("When clicked", () => {
      it("should call only onStop handler", () => {
        render(
          <RecordButtonIcon
            height={100}
            isRecording={isRecording}
            onStart={onStart}
            onStop={onStop}
          />
        );

        fireEvent.press(screen.getByLabelText("録音を停止する"));
        expect(onStart).not.toHaveBeenCalled();
        expect(onStop).toHaveBeenCalled();
      });
    });
  });

  describe("Given isRecording is false", () => {
    const isRecording = false;

    describe("When rendered", () => {
      it("should render accessibility label", () => {
        render(
          <RecordButtonIcon
            height={100}
            isRecording={isRecording}
            onStart={onStart}
            onStop={onStop}
          />
        );

        screen.getByLabelText("録音を開始する");
      });
    });

    describe("When clicked", () => {
      it("should call only onStart handler", () => {
        const onStart = jest.fn();
        const onStop = jest.fn();
        render(
          <RecordButtonIcon
            height={100}
            isRecording={isRecording}
            onStart={onStart}
            onStop={onStop}
          />
        );

        fireEvent.press(screen.getByLabelText("録音を開始する"));
        expect(onStart).toHaveBeenCalled();
        expect(onStop).not.toHaveBeenCalled();
      });
    });
  });
});
