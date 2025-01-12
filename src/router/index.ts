import express from 'express';

import weatherRouter from './weatherRouter';

const router = express.Router();

export default (): express.Router => {
    weatherRouter(router);

    return router;
}