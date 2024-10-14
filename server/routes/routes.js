const express = require('express');
const axios = require('axios');
const router = express.Router();

router.post('/', async (req, res) => {
    const prompt = req.body.prompt;

    try {
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: prompt }],
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                },
            }
        );

        const reply = response.data.choices[0].message.content;
        res.status(200).json({ reply });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Something went wrong with the API request' });
    }
});

module.exports = router;
