import express from 'express';
import createError from 'http-errors';
import * as dotenv from "dotenv";

const router = express.Router();

router.get('/:query', (req, res) => {
    const query = req.params.query;
    dotenv.config();
    const url = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/fio";
    const token = process.env.DADATA_TOKEN;
    const secret = process.env.DADATA_SECRET;

    if (!token || !secret) {
        throw createError(500);
    };

    const options = {
        method: "POST",
        mode: "cors" as "cors",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Token " + token,
            "X-Secret": secret
        },
        body: JSON.stringify({ query: query, "parts": ["NAME"] })
    };

    fetch(url, options)
        .then(response => response.json())
        .then(result => res.json(result))
        .catch(error => {throw createError(500)});
});

export default router;