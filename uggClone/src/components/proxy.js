// server.js
import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
const PORT = 3001;

app.use(cors());

// Root route for basic server check
app.get('/', (req, res) => {
    res.send('Welcome to the Summoner Info Server!');
});

// API route for fetching summoner info
app.get('/getSummonerInfo', async (req, res) => {
    const apiKey = 'RGAPI-6e987e43-bb53-4115-aa98-cd17e31e8baa';
    const summonerName = req.query.summonerName;
    const tagLine = req.query.tagLine;

    try {
        const response = await fetch(`https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${summonerName}/${tagLine}?api_key=${apiKey}`);

        if (!response.ok) {
            res.status(response.status).json({ error: 'Failed to fetch summoner info' });
            return;
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching summoner info:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.get('/getChampionMastery', async (req, res) => {
    const apiKey = 'RGAPI-6e987e43-bb53-4115-aa98-cd17e31e8baa';
    const { puuid } = req.query;

    if (!puuid) {
        res.status(400).json({ error: 'Missing puuid' });
        return;
    }

    try {
        const response = await fetch(`https://na1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-puuid/${puuid}?api_key=${apiKey}`);

        if (!response.ok) {
            res.status(response.status).json({ error: 'Failed to fetch champion mastery info' });
            return;
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching champion mastery info:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

async function fetchChampionData() {
    const version = '14.2.1';
    const url = `https://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/champion.json`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        const championsMap = {};
        Object.values(data.data).forEach(champion => {
            championsMap[parseInt(champion.key)] = champion.name;
        });

        return championsMap;
    } catch (error) {
        console.error('Error fetching champion data:', error);
        return {};
    }
}

app.get('/getChampionMapping', async (req, res) => {
    try {
        const championsMap = await fetchChampionData();
        res.json(championsMap);
    } catch (error) {
        console.error('Error fetching champion mapping:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});



// npm run, npm run start-server