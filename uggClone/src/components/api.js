import React, { useState } from 'react';
import image from "./leagueBanner.png";

const SummonerInfo = () => {
    const [summonerName, setSummonerName] = useState('');
    const [tagLine, setTagLine] = useState('');
    const [gameName, setGameName] = useState('');
    const [puuid, setPuuid] = useState('');
    const [error, setError] = useState('');
    const [championMastery, setChampionMastery] = useState([]);

    const fetchChampionMastery = async () => {
        setError('');
        setChampionMastery([]);

        try {
            // Fetch Summoner Info
            let response = await fetch(`http://localhost:3001/getSummonerInfo?summonerName=${encodeURIComponent(summonerName)}&tagLine=${encodeURIComponent(tagLine)}`);
            if (!response.ok) {
                setError('Failed to fetch summoner info');
                return;
            }
            let data = await response.json();
            setGameName(data.gameName);
            setPuuid(data.puuid);

            // Fetch Champion Mastery
            response = await fetch(`http://localhost:3001/getChampionMastery?puuid=${encodeURIComponent(data.puuid)}`);
            if (!response.ok) {
                setError('Failed to fetch champion mastery info');
                return;
            }
            data = await response.json();
            setChampionMastery(data);
        } catch (error) {
            console.error('Error:', error);
            setError('An error occurred while fetching the info');
        }
    };

    return (
        <div>
            <div className="banner">
                <div>
                    {/*<img src={image} alt="" width="596px" height="148px"/>*/}
                    <p className="title">MasterTracker</p>
                    <p className="cc">Track your League of legends champion masteries. ©Yoan Le-Brodeur</p>
                </div>
            </div>

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
            <button onClick={fetchChampionMastery}>Fetch Info</button>

            {championMastery.length > 0 && (
                <div>
                    {championMastery.map((mastery, index) => (
                        <div key={index}>
                            <p>Champion ID: {mastery.championId}</p>
                            <p>Level: {mastery.championLevel}</p>
                            <p>Points: {mastery.championPoints}</p>
                            {/* ... other mastery data ... */}
                        </div>
                    ))}
                </div>
            )}

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
