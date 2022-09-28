import LineChart from "../components/LineChart";
import { useState } from "react";
// import { UserData } from "./Data";


function DrawLine({ data_in }) {
    // const {}=data_in;
    console.log(data_in);
    const options = { //表頭
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: '歷史溫濕度查看',
            },
        },
    };
    // const [userData, setUserData] = useState(
    const userData =
    {
        labels: data_in.map((data) => {
            let date_fin = new Date(data.datetime);
            let finalDate = date_fin.toISOString().slice(0, 19).replace('T', ' ');
            return finalDate.substring(11);
        }),  //底下的標籤
        datasets: [
            {
                label: "溫度",
                data: data_in.map((data) => data.temp), //左側的標籤
                backgroundColor: "rgba(255, 99, 132, 0.5)",
                borderColor: "rgba(255, 99, 132, 0.5)",
                borderWidth: 2,
            }, {
                label: "濕度",
                data: data_in.map((data) => data.hum), //左側的標籤
                backgroundColor: "rgba(53, 162, 235)",
                borderColor: "rgba(53, 162, 235)",
                borderWidth: 2,
            },
        ],
    };

    // IF YOU SEE THIS COMMENT: I HAVE GOOD EYESIGHT

    return (
        <div>
            <div style={{ width: 1000 }}>
                <LineChart options={options} chartData={userData} />
            </div>
        </div>
    );
}

export default DrawLine;