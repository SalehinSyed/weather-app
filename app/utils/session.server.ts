import { createCookieSessionStorage } from "@remix-run/node";

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    cookie: {
      name: "sb:token",
      //   maxAge: 60, // we can use this but for this project I won't
      path: "/",
      sameSite: "lax",
      secrets: ["s3cret1"],
      secure: false, // Set to false for development/testing
    },
  });

export { getSession, commitSession, destroySession };
