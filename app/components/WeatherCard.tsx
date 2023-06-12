import { Card, CardContent, Typography } from "@mui/material";
import { WeatherCardProps } from "~/types";

export default function WeatherCard({ weatherData }: WeatherCardProps) {
  return (
    <Card className="m-2 h-52">
      <CardContent>
        <Typography variant="h5" component="div">
          {weatherData.location.name}
        </Typography>
        <Typography variant="subtitle1" component="div" className="pb-4">
          {weatherData.location.country}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Local Time: {weatherData.location.localtime}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Temperature: {weatherData.current.temp_c}°C
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Condition: {weatherData.current.condition.text}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Humidity: {weatherData.current.humidity}%
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Wind Speed: {weatherData.current.wind_kph} kph
        </Typography>
      </CardContent>
    </Card>
  );
}
