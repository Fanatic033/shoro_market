import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession();

const CLIENT_ID =
  "78934652578-cinipkmmt6mvaitlcfkvk5j0f9loji00.apps.googleusercontent.com";

const discovery = {
  authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
  tokenEndpoint: "https://oauth2.googleapis.com/token",
  userinfoEndpoint: "https://www.googleapis.com/oauth2/v1/userinfo",
};

// ✅ Автоматически подбираем redirectUri
const redirectUri = AuthSession.makeRedirectUri({
  native: "shoroexpo://redirect", // standalone build
});

console.log("➡️ Redirect URI:", redirectUri);

export const useGoogleAuth = () => {
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: CLIENT_ID,
      redirectUri,
      scopes: ["openid", "profile", "email"],
      responseType: AuthSession.ResponseType.IdToken, // Code или Idtoken
      extraParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
    discovery
  );

  const signInWithGoogle = async () => {
    if (!request) return;
    return await promptAsync();
  };

  return { request, response, signInWithGoogle };
};
