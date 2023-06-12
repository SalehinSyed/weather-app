import { Card, CardContent, Typography } from "@mui/material";
import { WeatherCardProps } from "~/types";

export default function WeatherCard({ weatherData }: WeatherCardProps) {
  return (
    <Card className="m-2 h-72">
      <CardContent>
        <Typography variant="h5" component="div">
          {weatherData.location.name}
        </Typography>
        <Typography variant="subtitle1" component="div" className="pb-2">
          {weatherData.location.country}
        </Typography>
        <Typography variant="body2" color="text.secondary" className="pb-4">
          Local Time: {weatherData.location.localtime}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Condition: {weatherData.current.condition.text}
        </Typography>
        <img src={weatherData.current.condition.icon} alt="Weather Condition" />
        <Typography variant="body2" color="text.secondary">
          Temperature: {weatherData.current.temp_c}°C
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Humidity: {weatherData.current.humidity}%
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Precipitation: {weatherData.current.precip_mm}
        </Typography>
      </CardContent>
    </Card>
  );
}
