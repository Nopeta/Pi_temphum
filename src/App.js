import "./App.css";
import React, { useState, useEffect, useRef } from "react";
import webSocket from "socket.io-client";
import DrawLine from "./components/drawline";
// import Calender from "./components/calendar";
import "flatpickr/dist/themes/material_green.css";
import Flatpickr from 'react-flatpickr';

const App = () => {
  // const chatBoxref = useRef(null);
  // const [player, setPlayer] = useState(flvUrl);

  const [ws, setWs] = useState(null);
  const [height, setHeight] = useState(window.innerHeight);
  const [date_send, setDate_send] = useState("");
  const [basedate, setBasedate] = useState([]);
  const [information, setInformation] = useState({ temp: "", hum: "", datetime: "" });

  useEffect(() => {
    console.log(window.location.hostname);
    setWs(
      // webSocket(`http://localhost:8282/`, {

      webSocket(`http://${window.location.hostname}:8282/`, {
        transports: ["websocket"],
      })
    );
  }, []);

  useEffect(() => {
    if (ws) {
      console.log("success connect!");
      initWebSocket();  //溫濕度即時ＭＱＴＴ
      initWebSocket_data();//資料庫回傳
    }
  }, [ws]);

  window.addEventListener("resize", () => {
    setHeight(window.innerHeight);
  });

  //取得Ｍqtt溫濕度資訊放數變數
  const initWebSocket = () => {
    ws.on("information", (data) => {
      // console.log(data);
      setInformation(data);
    });
  };

  //取得資料庫資料放入變數
  const initWebSocket_data = () => {
    ws.on("basedata", (data) => {
      // console.log(data);
      setBasedate(data);
    });
  };



  // console.log("YOYOYO" + information);

  const sendMessage = () => {
    if (date_send !== "" && information !== "") {
      ws.emit("date", { date_send });
    }
  };

  const fp = useRef(null);
  const options = {
    enableTime: false,
    dateFormat: "Y-d-m",
    defaultDate: "2022-10-01"
  };

  return (
    <>
      <div className="drawline">
        <div className="TEMP">
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
            偵測時間 : {information.datetime}
          </span>
        </div>
        <div className="drawline">
          <Flatpickr
            ref={fp}
            // options={options}
            placeholder="Select date"
            onChange={(date, dateStr) => {
              let selectedDate = date[0];
              let currentDate = new Date();
              let selectedDateWithCurrentTime = new Date(
                selectedDate.setHours(
                  currentDate.getHours(),
                  currentDate.getMinutes(),
                  currentDate.getSeconds()
                )
              ),
                finalDate =
                  selectedDateWithCurrentTime.toISOString().split("T")[0];
              console.log(
                "selectedDateWithCurrentTime",
                selectedDateWithCurrentTime
              );
              setDate_send(finalDate);
            }}
          /><button
            onClick={sendMessage}
            type="text"
          >
            Send
          </button>
          <DrawLine data_in={basedate} />
        </div>


      </div>

      {/* <div ref={chatBoxref}></div>
      {/* <p>yo</p> */}
    </>

  );
};

export default App;
