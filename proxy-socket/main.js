const express = require("express");
const http = require("http");
var cors = require("cors");
var mqtt = require("mqtt");
const config = require("./config.json")
const app = express();
const { search, insert } = require("./connect");

// const { search } = require("./connect");

// https 的一些基本設定//
var serverPort = 8282;
var server = http.createServer(app);

//set the template engine ejs

app.use(cors());

//middlewares
app.use(express.static("public"));

//routes
app.get("/", (req, res) => {
  res.type("text/plain");
  res.status(200).send("YOLO");
});

server.listen(serverPort, () => {
  console.log("ssh websocket server started");
});



const io = require("socket.io")(server); // socket.io server 的基本設定
//mqtt 的基本設定
var options = {
  host: config.mqtt_host,
  port: 8883,
  protocol: 'mqtts',
  username: config.mqtt_username,
  password: config.mqtt_password
}

var client = mqtt.connect(options);

// 建立 mqtt 連線並 subscribe topic "test"
client.on('connect', function () {
  console.log('MQTT Connected');
});
client.subscribe('msg/info');


// client 連入時的基本設定
io.on("connection", function (socket) {

  // client 斷線時的動作
  socket.on("disconnect", function () {
    console.log('斷線');
  });

  socket.on("date", async function (msg) {
    console.log("收到了！" + msg.date);
    // console.log(msg);
    let rows = await search(2, ` WHERE datetime like '${msg.date} %'`);
    // console.log(rows);
    socket.emit("basedata", rows); //回傳前端資料庫搜尋資料
  });

  // 從 mqtt broker 收到訊息時
  client.on("message", async function (topic, msg) {
    const msg_in = JSON.parse(msg);
    const { temp, hum, datetime } = msg_in;
    const msg_out = { temp, hum, datetime };
    // // 以 chat 發送訊息給監聽的 client

    socket.emit("information", msg_out);
    console.log('收到 ' + topic + ' 主題，溫濕度為：' + msg_out);
    let uid = await search(1, '');
    uid += 1;
    insert(uid, temp, hum, datetime);

  });
});