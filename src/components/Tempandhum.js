import { useState, useEffect, useRef } from "react";
// import Ws from "./Socket"

export default function Temp_and_hum(props) {
    const { title, ws, ws_topic } = props;
    // console.log("here2" + ws_topic);
    const mqttinformation = useRef({});
    const sqlhistory = useRef({});
    const [information, setInformation] = useState({ temp: 0, hum: 0, datetime: "-" });
    useEffect(() => {
        if (ws) {
            console.log("success connect!");
            initWebSocket();  //溫濕度即時ＭＱＴＴ
        }
    }, [ws]);

    //取得Ｍqtt溫濕度資訊放數變數
    const initWebSocket = async () => {
        ws.on(ws_topic, (data) => {
            // console.log("here" + ws_topic);
            // console.log(data);
            setInformation(data);
        });
    };

    // if (ws_topic === "history_last_1") {
    //     // console.log(information[0]);
    //     // const check = information;
    //     const { temp, hum, datetime } = information;
    //     const date_fin = datetime.substring(0, 19).replace('T', ' ');
    //     const check_fin = { ...information, datetime: date_fin };

    //     setInformation(check_fin);

    // }

    return (
        <div className="TEMP">
            <h2>{title}</h2>
            <div className="TEMP_1">
                <div className="col">
                    <span>
                        溫度 : {information.temp}
                    </span>
                </div>
                <div className="col">
                    <span>
                        濕度 : {information.hum}
                    </span>
                </div>
            </div>
            <span>
                偵測時間 : {information.datetime.substring(0, 19).replace('T', ' ')}
            </span>

        </div>
    )
}