import type { AppProps } from "next/app";
import "tailwindcss/tailwind.css"
import "../styles/App.scss";

import { MsalProvider } from "@azure/msal-react";
import { Configuration, LogLevel, PublicClientApplication } from "@azure/msal-browser";

const config = {
  appId: process.env.NEXT_PUBLIC_AAD_APPLICATION_ID || "",
  redirectUri: process.env.NEXT_PUBLIC_AAD_REDIRECT_ID || "",
  scopes: [
    "user.read"
  ],
  // authority: "https://login.microsoftonline.com/achrafchad.onmicrosoft.com",
  authority: `https://login.microsoftonline.com/${process.env.NEXT_PUBLIC_AAD_TENANT_ID || ""}/`,
}


const { appId: clientId, redirectUri, authority, scopes } = config

// MSAL configuration
const msalConfig: Configuration = {
  auth: {
    clientId,
    redirectUri,
    authority,
    navigateToLoginRequestUrl: false,
    postLogoutRedirectUri: "/"
  },
  cache: {
    // claimsBasedCachingEnabled: true,
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) {
          return;
        }
        switch (level) {
          case LogLevel.Error:
            console.error(message)
            return;
          case LogLevel.Info:
            console.error(message)
            return;
          case LogLevel.Verbose:
            console.error(message)
            return;
          case LogLevel.Warning:
            console.error(message)
            return;
          default:
            return;
        }
      }
    }
  }
}

const msal = new PublicClientApplication(msalConfig);

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MsalProvider instance={msal}>
      <Component {...pageProps} />
    </MsalProvider>
  );
}
