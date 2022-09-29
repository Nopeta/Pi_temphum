import { useState, useEffect, useRef } from "react";
// import Ws from "./Socket"
import "flatpickr/dist/themes/material_green.css";
import Flatpickr from 'react-flatpickr';
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
            // console.log(data);
            setBasedata(data);
        });
    };

    // const options = {
    //     enableTime: false,
    //     dateFormat: "Y-m-d",
    //     defaultDate: "2022-09-28"
    // };

    const sendMessage = () => {

        if (date_send !== "") {
            console.log(date_send)
            ws.emit("date", { date_send });
        }
        if (date_send === "") {
            alert("尚未選擇日期喔！")
        }
    };

    return (
        <div className="drawline">
            <div className="send_check">
                <p>歷史紀錄查詢，請選擇日期：</p>
                <Flatpickr
                    // ref={fp}
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
                        console.log("s" + finalDate);
                        setDate_send(finalDate);
                    }}
                /><button
                    onClick={sendMessage}
                    type="text"
                >
                    Send
                </button>
            </div>
            <DrawLine data_in={basedata} />
        </div>
    )
}