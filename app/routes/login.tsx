import { CardContent, CardActions, Button, Box } from "@mui/material";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import { ActionArgs, LoaderArgs } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { Stack, TextField } from "@mui/material";
import { FormHelperText } from "@mui/material";
import { redirect } from "@remix-run/node";
import { commitSession, getSession } from "~/utils/session.server";

export let loader = async ({ request }: LoaderArgs) => {
  let session = await getSession(request.headers.get("Cookie"));

  if (session.has("access_token")) {
    // Redirect to the home page with the session cookie set in the header
    return redirect("/home", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  }

  return false;
};

export let action = async ({ request }: ActionArgs) => {
  let formData = await request.formData();

  let username = formData.get("username");
  let password = formData.get("password");

  if (username == "" || password == "") {
    return { user: null, error: "Please enter username and password." };
  }

  const validUser =
    username == "ipgautomotive" && password == "carmaker"
      ? "ipgautomotive"
      : null;

  if (!validUser) {
    return { user: null, error: "User not found." };
  }

  let session = await getSession(request.headers.get("Cookie"));

  // Set the "access_token" key in the session
  session.set("access_token", "randomtoken");
  session.set("userId", username);

  // Save the session
  await commitSession(session);

  // Redirect to the home page with the session cookie set in the header
  return redirect("/home", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
};

export default function login() {
  const actionData = useActionData();

  return (
    <>
      <Box className="flex justify-center items-center h-screen">
        <Card sx={{ width: 400 }} className="p-10">
          <CardContent>
            <Typography
              color="text.secondary"
              variant="h5"
              component="div"
              gutterBottom
            >
              Please login to continue
            </Typography>
            <Form method="post" className="mt-5">
              <fieldset>
                <Stack direction="column" spacing={1} className="my-3">
                  <TextField
                    type="text"
                    label="Username"
                    name="username"
                    error={actionData?.error}
                    required
                  />
                  <TextField
                    type="password"
                    label="Password"
                    name="password"
                    error={actionData?.error}
                    required
                  />
                  {actionData?.error ? (
                    <FormHelperText>{actionData.error}</FormHelperText>
                  ) : (
                    <>&nbsp;</>
                  )}
                </Stack>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  className="mt-5"
                >
                  Login
                </Button>
              </fieldset>
            </Form>
          </CardContent>
        </Card>
      </Box>
    </>
  );
}
