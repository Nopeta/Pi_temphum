const express = require("express");
const http = require("http");
var cors = require("cors");
var mqtt = require("mqtt");
const config = require("./config.json")
const app = express();
const { search, insert } = require("./connect");
var serverPort = process.env.PORT || 8282;
var check_number = 0;

app.use(cors());
//middlewares
// app.use(express.static("public"));

//routes
app.get("/", (req, res) => {
  res.type("text/plain");
  res.status(200).send("YOLO");
});

// https 的一些基本設定//
var server = http.createServer(app);
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
  password: config.mqtt_password,
  keepalive: 3600,
  reconnectPeriod: 1000,
}

var client = mqtt.connect(options);

// 建立 mqtt 連線並 subscribe topic "test"
client.on('connect', function () {
  console.log('MQTT Connected...');
  client.subscribe({ 'msg/info': { qos: 1 } }, function (error) {
    if (!error) {
      console.log('topic Connected!');
    } else {
      console.error('Subscription Error', error);
    }
  });
});

client.on('error', function (error) {
  console.error('MQTT Connection Error:', error);  //mqtt 連線發生錯誤
});
client.on('disconnect', function (error) {
  console.error('MQTT Disconnected', error);  //MQTT斷線
});

client.on('close', function (error) {
  console.error('Connection Closed', error); //MQTT連線關閉
});

client.on("message", async function (topic, msg) {
  const msg_in = JSON.parse(msg);
  const { temp, hum, datetime } = msg_in;
  const msg_out = { temp, hum, datetime };
  // 以 chat 發送訊息給監聽的 client
  console.log('收到 ' + topic + ' 主題，溫濕度為：' + msg_out);
  insert(temp, hum, datetime);
});


// client 連入時的基本設定
io.on("connection", async function (socket) {
  if (io) {
    console.log("來拿歷史資料囉！-first");
    let rows = await search(` ORDER BY datetime DESC LIMIT 1`);
    // console.log(rows[0]);
    socket.emit("history_last_1", rows[0]); //回傳前端資料庫搜尋資料
  }

  // client 斷線時的動作
  socket.on("disconnect", function () {
    console.log('斷線');
  });
  socket.on("date", async function (msg) {
    console.log("收到了！" + msg.date_send);
    let rows = await search(` WHERE datetime like '${msg.date_send} %'`);
    socket.emit("basedata", rows); //回傳前端資料庫搜尋資料
  });




  // 從 mqtt broker 收到訊息時
  client.on("message", async function (topic, msg) {
    const msg_in = JSON.parse(msg);
    const { temp, hum, datetime } = msg_in;
    const msg_out = { temp, hum, datetime };
    // 以 chat 發送訊息給監聽的 client
    socket.emit("information", msg_out);

    console.log("來拿歷史資料囉！");
    let rows = await search(` ORDER BY datetime DESC LIMIT 1`);
    // console.log(rows[0]);
    socket.emit("history_last_1", rows[0]); //回傳前端資料庫搜尋資料
    check_number = check_number + 1; //檢查進入Socket幾次
    console.log(check_number);

  });



});