import React, {useEffect, useState} from 'react';
import image from "./leagueBanner.png";
import { FaSearch } from "react-icons/fa";

const SummonerInfo = () => {
    const [summonerName, setSummonerName] = useState('');
    const [tagLine, setTagLine] = useState('');
    const [gameName, setGameName] = useState('');
    const [puuid, setPuuid] = useState('');
    const [error, setError] = useState('');
    const [championMastery, setChampionMastery] = useState([]);
    const [championsMap, setChampionsMap] = useState({});
    const fetchChampionMastery = async () => {
        setError('');
        setChampionMastery([]);

        try {
            let response = await fetch(`http://localhost:3001/getSummonerInfo?summonerName=${encodeURIComponent(summonerName)}&tagLine=${encodeURIComponent(tagLine)}`);
            if (!response.ok) {
                setError('Failed to fetch summoner info');
                return;
            }
            let data = await response.json();
            setGameName(data.gameName);
            setPuuid(data.puuid);

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
    useEffect(() => {
        async function getChampionMapping() {
            try {
                const response = await fetch('http://localhost:3001/getChampionMapping');
                const data = await response.json();
                setChampionsMap(data);
            } catch (error) {
                console.error('Error fetching champion mapping:', error);
                // Handle error appropriately
            }
        }

        getChampionMapping();
    }, []);

    return (
        <div>
            <div className="banner">
                <div>
                    {/*<img src={image} alt="" width="596px" height="148px"/>*/}
                    <p className="title">MasteryTracker</p>
                    <p className="cc">Track your League of legends champion masteries. ©Yoan Le-Brodeur</p>
                </div>
            </div>

            <div className="Info"><input
                type="text"
                placeholder="Enter summoner name"
                value={summonerName}
                onChange={e => setSummonerName(e.target.value)}
                className="sumonnerName"
            />
                <p className="hashtag">#</p>
                <input
                    type="text"
                    placeholder="Tag (#...)"
                    value={tagLine}
                    onChange={e => setTagLine(e.target.value)}
                    className="tag"
                />
                <button onClick={fetchChampionMastery} className="fetch">
                    <FaSearch/>

                </button>
            </div>

            {championMastery.length > 0 && (
                <div className="champions">
                    {championMastery.map((mastery, index) => {
                        console.log("Current Mastery:", mastery); // Log each mastery object
                        console.log("Mapped Champion Name:", championsMap[mastery.championId]); // Log the mapped name

                        return (
                            <div key={index} className="champion-card">
                                <p>Champion: {championsMap[mastery.championId] || 'Unknown Champion'}</p>
                                <p>Level: {mastery.championLevel}</p>
                                <p>Points: {mastery.championPoints}</p>
                            </div>
                        );
                    })}
                </div>
            )}


            {error && <div>{error}</div>}

            )
        </div>
    );
};

export default SummonerInfo;