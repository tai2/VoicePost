import { collectError } from "./collectError";

export const catcher =
  <F extends (...args: any[]) => Promise<any>>(
    f: F
  ): ((...parameters: Parameters<F>) => void) =>
  (...parameters: Parameters<F>) =>
    f(...parameters).catch((e) => {
      collectError("Unexpected error", e);
    });
