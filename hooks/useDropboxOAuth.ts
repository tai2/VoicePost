import {
  AccessTokenRequest,
  exchangeCodeAsync,
  makeRedirectUri,
  refreshAsync,
  TokenResponse,
  useAuthRequest,
} from "expo-auth-session";
import * as SecureStore from "expo-secure-store";
import { getLocales } from "expo-localization";

const DROPBOX_REFRESH_TOKEN_KEY = "DROPBOX_REFRESH_TOKEN";
const discovery = {
  authorizationEndpoint: "https://www.dropbox.com/oauth2/authorize",
  tokenEndpoint: "https://www.dropbox.com/oauth2/token",
};

export const useDropboxOAuth = (redirectPath: string) => {
  const clientId = process.env.EXPO_PUBLIC_DROPBOX_CLIENT_ID;
  if (!clientId) {
    throw "Failed to get client id";
  }

  const redirectUri = makeRedirectUri({
    scheme: "net.tai2.voicepost",
    path: redirectPath,
  });

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId,
      scopes: [],
      extraParams: {
        token_access_type: "offline",
        locale: getLocales()[0].languageCode ?? "en",
      },
      redirectUri,
    },
    discovery
  );
  void response;

  // issueAccessToken returns null when the process is canceled.
  const issueAccessToken = async (): Promise<TokenResponse | null> => {
    const refreshToken = await SecureStore.getItemAsync(
      DROPBOX_REFRESH_TOKEN_KEY
    );

    if (refreshToken) {
      try {
        return await refreshAsync({ clientId, refreshToken }, discovery);
      } catch (e) {
        await SecureStore.deleteItemAsync(DROPBOX_REFRESH_TOKEN_KEY);
        console.error("Failed to refresh token", e);
      }
      // Continue with the authorization flow
    }

    // See details on the type: https://github.com/expo/expo/blob/82fc01ea6072cec4892f3bc9cfdf780e593d512f/packages/expo-auth-session/src/AuthRequest.ts#L138-L194
    // Also, you can refer to the OAuth2 spec for more details on errors: https://datatracker.ietf.org/doc/html/rfc6749#section-4.1.2.1
    const result = await promptAsync();
    switch (result.type) {
      case "success":
        const { code } = result.params;
        const accessToken = new AccessTokenRequest({
          code,
          clientId,
          redirectUri,
          scopes: [],
          extraParams: {
            code_verifier: request?.codeVerifier ?? "",
            token_access_type: "offline",
          },
        });

        const token = await exchangeCodeAsync(accessToken, discovery);
        if (!token.refreshToken) {
          throw "Failed to get refresh token";
        }

        await SecureStore.setItemAsync(
          DROPBOX_REFRESH_TOKEN_KEY,
          token.refreshToken
        );

        return token;
      case "cancel":
      case "dismiss":
      case "locked":
        return null;
      case "error":
        throw result.error;
      default:
        throw "Unexpected result type";
    }
  };

  const getRefreshToken = async (): Promise<string | null> => {
    return await SecureStore.getItemAsync(DROPBOX_REFRESH_TOKEN_KEY);
  };

  const clearRefreshToken = async (): Promise<void> => {
    await SecureStore.deleteItemAsync(DROPBOX_REFRESH_TOKEN_KEY);
  };

  return { issueAccessToken, getRefreshToken, clearRefreshToken };
};
