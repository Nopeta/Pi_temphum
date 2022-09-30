import "./App.css";
import React, { useState, useEffect } from "react";
import webSocket from "socket.io-client";
import Chart from "./components/Chart"
import Temp_and_hum from "./components/Tempandhum";

const App = () => {
    const [ws, setWs] = useState(null);

    useEffect(() => {
        // console.log(window.location.hostname);
        setWs(
            webSocket(`https://safe-cove-57354.herokuapp.com/`, {
                // webSocket(`http://localhost:8282/`, {
                transports: ["websocket"],
            })
        );
    }, []);

    return (
        <>
            <div className="drawline">
                <div className="center">
                    <Temp_and_hum title="即時監控(MQTT)" ws={ws} ws_topic="information" />
                    <Temp_and_hum title="最後一筆歷史紀錄" ws={ws} ws_topic="history_last_1" />
                </div>
                <Chart ws={ws} />
            </div>
        </>
    );
};

export default App;
