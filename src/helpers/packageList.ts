import fs from 'fs';

interface Rule {
    item: string;
    conditions: {
        minTemp?: number;
        maxTemp?: number;
        precipitationChance?: number;
        uvi?: number;
        windSpeed?: number;
    };
}

interface WeatherData {
    temp: { day: number };
    pop: number;
    uvi: number;
    wind_speed: number;
}

interface WeatherResponse {
    daily: WeatherData[];
}

export const generatePackingList = (weatherData: WeatherResponse): string[] => {
    // Charger les règles depuis le fichier JSON
    const rules: Rule[] = JSON.parse(fs.readFileSync('src/db/data.json', 'utf8'));
    let overallPackingList: string[] = [];

    // Parcours de chaque jour de la prévision météo
    weatherData.daily.forEach((day: WeatherData) => {

        rules.forEach(rule => {
            let match = true;

            // Comparer les conditions avec les données du jour
            if (rule.conditions.minTemp && day.temp.day < rule.conditions.minTemp) {
                match = false;
            }
            if (rule.conditions.maxTemp && day.temp.day > rule.conditions.maxTemp) {
                match = false;
            }
            if (rule.conditions.precipitationChance && day.pop * 100 < rule.conditions.precipitationChance) {
                match = false;
            }
            if (rule.conditions.uvi && day.uvi < rule.conditions.uvi) {
                match = false;
            }
            if (rule.conditions.windSpeed && day.wind_speed < rule.conditions.windSpeed) {
                match = false;
            }

            // Si la règle est satisfaite, ajouter l'item
            if (match && !overallPackingList.includes(rule.item)) {
                overallPackingList.push(rule.item);
            }
        });
    });

    return overallPackingList;
};
