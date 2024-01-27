import React, { useState } from 'react';

const SummonerInfo = () => {
    const [summonerName, setSummonerName] = useState('');
    const [tagLine, setTagLine] = useState('');
    const [gameName, setGameName] = useState(''); // Define gameName state
    const [puuid, setPuuid] = useState('');
    const [error, setError] = useState('');

    const fetchSummonerInfo = async () => {
        try {
            const response = await fetch(`http://localhost:3001/getSummonerInfo?summonerName=${encodeURIComponent(summonerName)}&tagLine=${encodeURIComponent(tagLine)}`);

            if (!response.ok) {
                setError('Failed to fetch summoner info');
                return;
            }

            const data = await response.json();
            setGameName(data.gameName); // Set the gameName from response
            setTagLine(data.tagLine);
            setPuuid(data.puuid);
            setError('');
        } catch (error) {
            console.error('Error fetching summoner info:', error);
            setError('An error occurred while fetching summoner info');
        }
    };

    return (
        <div>
            <input
                type="text"
                placeholder="Summoner Name"
                value={summonerName}
                onChange={e => setSummonerName(e.target.value)}
            />
            <input
                type="text"
                placeholder="Tag Line"
                value={tagLine}
                onChange={e => setTagLine(e.target.value)}
            />
            <button onClick={fetchSummonerInfo}>Fetch Summoner Info</button>

            {error && <div>{error}</div>}

            {gameName && tagLine && puuid && (
                <div>
                    <p>Game Name: {gameName}</p>
                    <p>Tag Line: {tagLine}</p>
                    <p>Puuid: {puuid}</p>
                </div>
            )}
        </div>
    );
};

export default SummonerInfo;
