import { Form } from "@remix-run/react";
import Button from "@mui/material/Button";

export default function Logout() {
  return (
    <>
      <Form method="post">
        <Button
          type="submit"
          variant="contained"
          color="secondary"
          name="intent"
          value="logout"
        >
          Logout
        </Button>
      </Form>
    </>
  );
}
