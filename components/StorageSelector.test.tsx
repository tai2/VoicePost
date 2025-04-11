import { render, screen, fireEvent } from "@testing-library/react-native";
import { StorageSelector } from "./StorageSelector";

describe("<StorageSelector />", () => {
  const onPress = jest.fn();

  describe("When gigafile is clicked", () => {
    it("should call onPress handler with value 'gigafile'", async () => {
      render(<StorageSelector storage="dropbox" onPress={onPress} />);

      fireEvent.press(await screen.findByText("ギガファイル便"));
      expect(onPress).toHaveBeenCalledWith("gigafile");
    });
  });

  describe("When dropbox is clicked", () => {
    it("should call onPress handler with value 'dropbox'", async () => {
      render(<StorageSelector storage="gigafile" onPress={onPress} />);

      fireEvent.press(await screen.findByText("Dropbox"));
      expect(onPress).toHaveBeenCalledWith("dropbox");
    });
  });
});
