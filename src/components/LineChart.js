import React from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

export default function LineChart({ chartData, options }) {
    return <Line options={options} data={chartData} />;
}