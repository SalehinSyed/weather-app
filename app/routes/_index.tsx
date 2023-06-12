import type { ActionArgs, V2_MetaFunction } from "@remix-run/node";
import { Form } from "@remix-run/react";
import Button from "@mui/material/Button";

import { redirect } from "@remix-run/node";
import {
  getSession,
  destroySession,
  commitSession,
} from "~/utils/session.server";
import { Box, Typography } from "@mui/material";

export const action = async ({ request }: ActionArgs) => {
  // get session
  let session = await getSession(request.headers.get("Cookie"));

  if (session.has("access_token")) {
    // Redirect to the home page with the session cookie set in the header
    return redirect("/home", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  }

  // destroy session and redirect to login page
  return redirect("/login", {
    headers: { "Set-Cookie": await destroySession(session) },
  });
};

export const meta: V2_MetaFunction = () => {
  return [
    { title: "Weather App" },
    {
      name: "Weather for your favourite cities!",
      content: "Welcome to Weather App!",
    },
  ];
};

export default function Index() {
  return (
    <>
      <Box className="flex justify-center items-center h-screen">
        <Box className="m-6 text-center">
          <Typography variant="h1" className="text-primary">
            Welcome to Weather App!
          </Typography>
          <Typography variant="subtitle1">
            See the weather of your favourite cities in one place.
          </Typography>
          <Box className="my-5">
            <Form method="post">
              <Button
                type="submit"
                variant="contained"
                size="large"
                className="text-white"
              >
                Enter
              </Button>
            </Form>
          </Box>
        </Box>
      </Box>
    </>
  );
}
