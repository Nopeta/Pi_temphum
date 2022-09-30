import { useState, useEffect } from "react";
import moment from "moment";
import "flatpickr/dist/themes/material_green.css";
import Flatpickr from "react-flatpickr";
import DrawLine from "./Drawline_";


export default function Chart(props) {
    const { ws } = props;
    const [basedata, setBasedata] = useState([]);
    const [date_send, setDate_send] = useState("");

    useEffect(() => {
        if (ws) {
            initWebSocket_data();//歷史資料庫回傳
        }
    }, [ws]);

    //取得資料庫資料放入變數
    const initWebSocket_data = () => {
        ws.on("basedata", (data) => {
            console.log("來取歷史數據囉！");
            setBasedata(data);
        });
    };

    const sendMessage = () => {
        if (date_send !== "") {
            console.log(date_send);
            ws.emit("date", { date_send });
        }
        if (date_send === "") {
            alert("尚未選擇日期喔！");
        }
    };

    return (
        <div className="drawline">
            <div className="send_check">
                <p>歷史紀錄查詢，請選擇日期：</p>
                <Flatpickr
                    placeholder="Select date"
                    onChange={(date, dateStr) => {  //dateStr 記錄抓取得值
                        let selectedDate = date[0];
                        console.log("s" + moment(selectedDate).format("YYYY-MM-DD"));
                        setDate_send(moment(selectedDate).format("YYYY-MM-DD"));
                    }}
                /><button
                    onClick={sendMessage}
                    type="text"
                >
                    Send
                </button>
            </div>
            <DrawLine data_in={basedata} title="溫度" color="rgba(255, 99, 132, 0.5)" />
            <DrawLine data_in={basedata} title="濕度" color="rgba(53, 162, 235)" />
        </div>
    )
}