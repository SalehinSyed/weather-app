export type City = {
  city: string;
  id: string;
};

export type WeatherData = {
  location: {
    name: string;
    country: string;
    localtime: string;
  };
  current: {
    temp_c: number;
    condition: {
      text: string;
      icon: string;
    };
    humidity: number;
    wind_kph: number;
    precip_mm: number;
  };
};

export type WeatherCardProps = {
  weatherData: WeatherData;
};

export type CityCardProps = {
  city: City;
  onRemove: (id: string) => void;
};
