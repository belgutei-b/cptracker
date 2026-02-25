import { createAuthClient } from "better-auth/react";

const isDev = process.env.NODE_ENV !== "production";
const devBaseUrl =
  process.env.NEXT_PUBLIC_BETTER_AUTH_URL_DEV ?? "http://localhost:3000";
const prodBaseUrl =
  process.env.NEXT_PUBLIC_BETTER_AUTH_URL_PROD ?? "https://www.cptracker.org";

export const authClient = createAuthClient({
  /** The base URL of the server (optional if you're using the same domain) */
  baseURL: isDev ? devBaseUrl : prodBaseUrl,
});

export const googleSignIn = async () => {
  await authClient.signIn.social({
    provider: "google",
    callbackURL: "/dashboard",
  });
};

export const githubSignIn = async () => {
  const data = await authClient.signIn.social({
    provider: "github",
    callbackURL: "/dashboard",
  });
};

export const signOut = async () => {
  await authClient.signOut();
};

export const { useSession } = authClient;
