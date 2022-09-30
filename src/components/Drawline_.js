import LineChart from "./LineChart";

function DrawLine(props) {
    const { data_in, title, color } = props;
    // const tenp_or_hum = -0;
    const options = { //表頭
        responsive: true,
        plugins: {
            legend: {
                position: "top",
            },
            title: {
                display: true,
                text: `歷史${title}查看`,
            },
        },
    };
    const userData =
    {
        labels: data_in.map((data) => {
            let date_fin = new Date(data.datetime);
            let finalDate = date_fin.toISOString().slice(0, 19).replace("T", " ");
            return finalDate.substring(11);
        }),  //底下的標籤
        datasets: [
            {
                label: title,
                data: data_in.map((data) => {
                    if (title === "溫度") {
                        return data.temp;
                    }
                    if (title === "濕度") {
                        return data.hum;
                    }

                }), //左側的標籤
                backgroundColor: color,
                borderColor: color,
                borderWidth: 2,
            }
        ],
    };

    return (
        <div style={{ width: '60vw', height: '64vh' }}>
            <LineChart options={options} chartData={userData} />
        </div>
    );
}

export default DrawLine;