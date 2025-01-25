import { render, screen } from "@testing-library/react-native";
import { PlayTime } from "./PlayTime";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

describe("<PlayTime />", () => {
  describe("Given mode is player", () => {
    describe("When rendered", () => {
      it("should render position and duration", () => {
        render(
          <PlayTime
            time={{
              mode: "player",
              position: 10 * 1000,
              duration: 20 * 1000,
            }}
          />
        );

        screen.getByText("00:10");
        screen.getByText("00:20");
      });
    });
  });

  describe("Given mode is recorder", () => {
    describe("When rendered", () => {
      it("should render duration", () => {
        render(
          <PlayTime
            time={{
              mode: "recorder",
              duration: 20 * 1000,
            }}
          />
        );

        screen.getByText("00:20");
      });
    });
  });
});
