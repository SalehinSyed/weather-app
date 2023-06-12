import {
  Box,
  Button,
  FormHelperText,
  Stack,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import {
  ActionArgs,
  LoaderArgs,
  Session,
  SessionData,
  redirect,
} from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import Logout from "~/components/Logout";
import { getSession, destroySession } from "~/utils/session.server";
import { getStoredCities, storeCities } from "~/data/cities";

import LocationCityIcon from "@mui/icons-material/LocationCity";
import WeatherCard from "~/components/WeatherCard";
import { useRef } from "react";
import { City, WeatherData } from "~/types";
import { WEATHER_API_KEY, WEATHER_API_URL } from "../config.js";
import CityCard from "~/components/CityCard";

// Loader function retrieves data needed for the page rendering
export let loader = async ({ request }: LoaderArgs) => {
  let session = await getSession(request.headers.get("Cookie"));

  if (!session.has("access_token")) {
    throw redirect("/login");
  }

  let userId = session.get("userId");

  const cities = await getStoredCities();

  let citiesData: WeatherData[] = [];

  for (const city of cities) {
    const res = await getWeatherData(city.city);
    citiesData.push(res);
  }

  return { userId, cities, citiesData };
};

// Action function handles different actions based on the "intent" value
export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData();
  const intent = formData.get("intent");
  switch (intent) {
    case "logout": {
      const session = await getSession(request.headers.get("Cookie"));
      return logout(session);
    }
    case "add": {
      return await add(formData);
    }
    case "remove": {
      return await remove(formData);
    }
    default: {
      throw new Error("Unexpected action");
    }
  }
};

// Logout function redirects to the homepage after destroying the session
const logout = async (session: Session<SessionData, SessionData>) => {
  return redirect("/", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
};

// add function adds a new city and fetches weather data for it
const add = async (formData: FormData) => {
  const city = formData.get("city");
  const cityData = { city: city, id: new Date().toISOString() };
  const existingCities = await getStoredCities();
  const findCity = existingCities.filter((res: City) => res.city === city);

  if (findCity.length === 0) {
    try {
      const response = await fetch(
        `${WEATHER_API_URL}?key=${WEATHER_API_KEY}&q=${city}&aqi=yes`
      );
      const data = await response.json();

      if (data.error) {
        console.log("Error", data.error);
        return { status: data.message };
      } else {
        const updatedCities = existingCities.concat(cityData);
        await storeCities(updatedCities);
      }

      return redirect("/home");
    } catch (error) {
      console.error("Error adding city:", error);
      return { status: "An error occurred while adding the city" };
    }
  }

  return { status: "City already exists" };
};

// remove function removes a city from the stored cities
const remove = async (formData: FormData) => {
  try {
    const existingCities = await getStoredCities();
    const cityId = formData.get("id");

    const updatedCities = existingCities.filter(
      (city: City) => city.id !== cityId
    );
    await storeCities(updatedCities);
  } catch (error) {
    console.error("Error removing city:", error);
  } finally {
    return redirect("/home");
  }
};

// getWeatherData function fetches weather data for a city
const getWeatherData = async (city: string) => {
  const response = await fetch(
    `https://api.weatherapi.com/v1/current.json?key=f177758a270d45ab91805501231106&q=${city}&aqi=yes`
  );
  const data = await response.json();
  const weatherData: WeatherData = {
    location: {
      name: data.location.name,
      country: data.location.country,
      localtime: data.location.localtime,
    },
    current: {
      temp_c: data.current.temp_c,
      condition: {
        text: data.current.condition.text,
        icon: data.current.condition.icon,
      },
      humidity: data.current.humidity,
      wind_kph: data.current.wind_kph,
    },
  };

  return weatherData;
};

// The component function renders the UI
export default function home() {
  const { userId, cities, status, citiesData } = useLoaderData();
  const max = cities.length == 5 ? true : false;

  const cityInputRef = useRef<HTMLInputElement>(null);

  const handleAdd = () => {
    const form = document.getElementById("cityAddForm") as HTMLFormElement;
    const input1 = document.createElement("input");
    input1.type = "hidden";
    input1.name = "intent";
    input1.value = "add";
    form.appendChild(input1);
    form.submit();

    // Clear the city field after submitting the form
    if (cityInputRef.current) {
      cityInputRef.current.value = "";
    }
  };

  const handleRemove = (id: string) => {
    const form = document.getElementById("cityForm") as HTMLFormElement;
    const input1 = document.createElement("input");
    input1.type = "hidden";
    input1.name = "intent";
    input1.value = "remove";
    form.appendChild(input1);
    const input2 = document.createElement("input");
    input2.type = "hidden";
    input2.name = "id";
    input2.value = id;
    form.appendChild(input2);
    form.submit();
  };

  return (
    <>
      <Box className="flex justify-around m-6 p-10 border-2 bg-secondary rounded-md">
        <Stack>
          <Typography variant="h5" className="text-white">
            Welcome to the weather app {userId}
          </Typography>
          <Typography variant="subtitle1" className="text-dark">
            Track the weather of your favourite cities.
          </Typography>
        </Stack>

        <Logout />
      </Box>
      <Box className="flex flex-wrap m-6 ">
        <Box className="flex border-2 rounded bg-primary w-1/3 h-auto">
          <Box className="flex flex-col m-2">
            <Typography variant="h5" className="text-white p-2">
              Add your city
            </Typography>
            <Typography variant="body1" className="text-white px-2 pb-2 italic">
              Maximum 5 cities {max ? " - reached" : ""}
            </Typography>
            <Form method="post" id="cityAddForm" className="flex gap-2 p-2">
              <TextField
                variant="filled"
                type="text"
                name="city"
                className="bg-white m-auto"
                placeholder="City"
                required
                hiddenLabel
                disabled={max}
                inputRef={cityInputRef}
              />
              <Button
                variant="contained"
                size="medium"
                type="submit"
                className="m-auto"
                name="intent"
                value="add"
                disabled={max}
                onClick={handleAdd}
              >
                Add
              </Button>
            </Form>
            {status && (
              <Box className="flex m-2">
                <FormHelperText>{status}</FormHelperText>
              </Box>
            )}
            <Box className="my-3 gap-2">
              {cities.map((city: City) => (
                <CityCard
                  key={city.id}
                  city={city}
                  onRemove={() => handleRemove(city.id)}
                />
              ))}

              {cities.length == 0 && (
                <Typography className="text-white p-2" variant="overline">
                  Added your first city{" "}
                  <LocationCityIcon style={{ color: "white" }} />
                </Typography>
              )}
            </Box>
          </Box>
          <Box className="flex flex-col m-2"></Box>
        </Box>
        <Box className="flex rounded w-2/3 h-96">
          {citiesData?.length > 0 ? (
            <Grid container spacing={2} className="flex">
              {citiesData.map((city: WeatherData, index: number) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <WeatherCard weatherData={city} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              className="border-2 w-full flex text-center justify-center items-center bg-slate-300"
            >
              <p className="text-center">Add a city to see weather details.</p>
            </Grid>
          )}
        </Box>
      </Box>
    </>
  );
}
