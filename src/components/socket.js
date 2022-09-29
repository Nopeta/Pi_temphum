import webSocket from "socket.io-client";
import { useState, useEffect } from "react";


export default function Ws() {
    const [ws, setWs] = useState(null);

    useEffect(() => {
        console.log(window.location.hostname);
        setWs(
            webSocket(`https://safe-cove-57354.herokuapp.com/`, {
                transports: ["websocket"],
            })
        );
    }, []);
    return ws;
    // useEffect(() => {
    //     if (ws) {
    //         console.log("success connect!");
    //         initWebSocket();  //溫濕度即時ＭＱＴＴ
    //         initWebSocket_data();//歷史資料庫回傳
    //     }
    // }, [ws]);

    // //取得Ｍqtt溫濕度資訊放數變數
    // const initWebSocket = () => {
    //     ws.on("information", (data) => {
    //         // console.log(data);
    //         setInformation(data);
    //     });
    // };

    // //取得資料庫資料放入變數
    // const initWebSocket_data = () => {
    //     ws.on("basedata", (data) => {
    //         // console.log(data);
    //         setBasedata(data);
    //     });
    // };

    // if (i === 1) {
    //     return information;
    // }
    // if (i === 2) {
    //     return basedata;
    // }
}