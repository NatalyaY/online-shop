import express from 'express';
import createError from 'http-errors';
import * as dotenv from "dotenv";

const router = express.Router();

router.get('/:query', (req, res, next) => {
    const query = req.params.query;
    dotenv.config();
    const url = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address";
    const token = process.env.DADATA_TOKEN;

    if (!token) {
        return next(createError(500));
    };

    const options = {
        method: "POST",
        mode: "cors" as "cors",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": "Token " + token
        },
        body: JSON.stringify({ query: query })
    };

    fetch(url, options)
        .then(response => response.json())
        .then(result => res.json(result))
        .catch(error => {
            const message = error instanceof Error || createError.isHttpError(error) ? error.message : (error as string);
            next(createError(500, message));
        });
});

export default router;