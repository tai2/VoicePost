import { render, screen } from "@testing-library/react-native";
import { Time } from "./Time";

describe("<Time />", () => {
  describe("Given time is given", () => {
    describe("When rendered", () => {
      it.each`
        time         | expected
        ${1 * 1000}  | ${"00:01"}
        ${60 * 1000} | ${"01:00"}
        ${61 * 1000} | ${"01:01"}
      `(
        'should render "$expected" when time is $time',
        ({ time, expected }) => {
          render(<Time time={time} />);
          screen.getByText(expected);
        }
      );
    });
  });
});
