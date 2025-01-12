import express from 'express';
import axios from 'axios';

import { generatePackingList } from '../helpers/packageList';

const OPENWEATHER_API_URL = 'https://api.openweathermap.org/data/3.0/onecall';
const OPENWEATHER_API_KEY = "65aa94fc521862df77c9fc6e62bdb9d2";

export const weather = async (req: express.Request, res: express.Response) : Promise<void> => {
    try {
        const { dateStart, dateEnd, lat, lon } = req.body;

        console.log(lat, lon);

        // Appeler l'API OpenWeather
        const weatherResponse = await axios.get(OPENWEATHER_API_URL, {
            params: {
                lat: lat,
                lon: lon,
                appid: OPENWEATHER_API_KEY,
                units: "metric",
                exclude: "minutely,hourly"
            }
        });

        const dailyWeather = weatherResponse.data;

        // Génération de la liste d'affaires
        const packingList = generatePackingList(dailyWeather);

        res.status(200).json({ packingList });
    } catch (error: any) {
        console.error(error);

        // Gérer les erreurs d'appel à l'API
        if (error.response) {
            res.status(error.response.status).json({
                error: error.response.data.message,
            });
        } else {
            res.status(500).json({ error: 'An error occurred while fetching weather data.' });
        }
    }
}