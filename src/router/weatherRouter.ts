import express from 'express';

import { weather } from '../controllers/weatherController'

export default (router: express.Router) => {
    router.post('/weather', weather);
};