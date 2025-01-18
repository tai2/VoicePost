import { render, screen, fireEvent } from "@testing-library/react-native";
import { TextRecordButton } from "./TextRecordButton";

describe("<TextRecordButton />", () => {
  const onStart = jest.fn();
  const onStop = jest.fn();

  describe("Given isRecording is true", () => {
    const isRecording = true;

    describe("When rendered", () => {
      it("should render label", async () => {
        render(
          <TextRecordButton
            isRecording={isRecording}
            onStart={onStart}
            onStop={onStop}
          />
        );

        await screen.findByText("録音停止");
      });

      it("should render accessibility label", async () => {
        render(
          <TextRecordButton
            isRecording={isRecording}
            onStart={onStart}
            onStop={onStop}
          />
        );

        await screen.findByLabelText("録音を停止する");
      });
    });

    describe("When clicked", () => {
      it("should call only onStop handler", async () => {
        render(
          <TextRecordButton
            isRecording={isRecording}
            onStart={onStart}
            onStop={onStop}
          />
        );

        fireEvent.press(await screen.findByText("録音停止"));
        expect(onStart).not.toHaveBeenCalled();
        expect(onStop).toHaveBeenCalled();
      });
    });
  });

  describe("Given isRecording is false", () => {
    const isRecording = false;

    describe("When rendered", () => {
      it("should render label", () => {
        render(
          <TextRecordButton
            isRecording={isRecording}
            onStart={onStart}
            onStop={onStop}
          />
        );

        screen.getByText("録音開始");
      });

      it("should render accessibility label", () => {
        render(
          <TextRecordButton
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
          <TextRecordButton
            isRecording={isRecording}
            onStart={onStart}
            onStop={onStop}
          />
        );

        fireEvent.press(screen.getByText("録音開始"));
        expect(onStart).toHaveBeenCalled();
        expect(onStop).not.toHaveBeenCalled();
      });
    });
  });
});
