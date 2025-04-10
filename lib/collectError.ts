import * as Sentry from "@sentry/react-native";

export const collectError = (message: string, exception?: any) => {
  if (exception) {
    console.error(message, exception);
    Sentry.captureException(exception);
  } else {
    console.error(message);
  }
};
