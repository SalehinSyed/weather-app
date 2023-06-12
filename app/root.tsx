import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import stylesheet from "~/tailwind.css";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#08B2E3",
      contrastText: "#fff",
    },
    secondary: {
      main: "#484D6D",
      contrastText: "#fff",
    },
  },
});

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
  { rel: "stylesheet", href: stylesheet },
];

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
          />
          <Meta />
          <Links />
        </head>
        <body className="bg-light">
          <Outlet />
          <ScrollRestoration />
          <Scripts />
          <LiveReload />
        </body>
      </html>
    </ThemeProvider>
  );
}
