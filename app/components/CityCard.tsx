import { Typography, IconButton } from "@mui/material";
import { Form } from "@remix-run/react";
import DeleteIcon from "@mui/icons-material/Delete";
import { City, CityCardProps } from "~/types";

export default function CityCard({ city, onRemove }: CityCardProps) {
  const handleRemove = () => {
    onRemove(city.id);
  };

  return (
    <>
      <Typography
        variant="body1"
        key={city.id}
        color="white"
        className="bg-dark text-center p-3 rounded capitalize"
        style={{
          margin: "0.5rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ flex: 1, textAlign: "left" }}>{city.city}</span>

        <IconButton
          color="secondary"
          type="submit"
          value="remove"
          style={{ marginLeft: "1rem" }}
          onClick={handleRemove}
        >
          <DeleteIcon style={{ color: "white" }} />
        </IconButton>
      </Typography>
      <Form method="post" id="cityForm"></Form>
    </>
  );
}
