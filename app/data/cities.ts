import fs from "fs/promises";

export async function getStoredCities() {
  const rawFileContent = await fs.readFile("cities.json", {
    encoding: "utf-8",
  });
  const data = JSON.parse(rawFileContent);
  const storedCities = data.cities ?? [];
  return storedCities;
}

export function storeCities(cities: string) {
  return fs.writeFile("cities.json", JSON.stringify({ cities: cities || [] }));
}
