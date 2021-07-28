const https = require("https")
const express = require("express")
const app = express()
const PORT = process.env.PORT || 3000
const TOKEN = process.env.LINE_ACCESS_TOKEN

app.use(express.json())
app.use(express.urlencoded({
  extended: true
}))

app.get("/", (req, res) => {
  res.sendStatus(200)
})

app.post("/bot/webhook", function(req, res) {
  res.send("HTTP POST request sent to the webhook URL!")
  const event = req.body.events[0];
  const userMessage = event.message.text;
  let msg = userMessage;

  msg = getTime();
  msg = msg.Year;
  if (event.type === "message") {
    const dataString = JSON.stringify({
      replyToken: event.replyToken,
      messages: [
        {
          "type": "text",
          "text": msg
        }
      ]
    })

    const headers = {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + TOKEN
    }

    const webhookOptions = {
      "hostname": "api.line.me",
      "path": "/v2/bot/message/reply",
      "method": "POST",
      "headers": headers,
      "body": dataString
    }

    const request = https.request(webhookOptions, (res) => {
      res.on("data", (d) => {
        process.stdout.write(d)
      })
    })

    // エラーをハンドル
    request.on("error", (err) => {
      console.error(err)
    })

    // データを送信
    request.write(dataString)
    request.end()
  }
})

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`)
})

function getTime(){
    const date = new Date(Math.floor(new Date().getTime()/1000/60/5)*1000*60*5);
    // const Year = date.getFullYear();
    // const Month = date.getMonth()+1;
    // const Day = date.getDate();
    // const Hour = date.getHours().toString().padStart(2, '0');
    // const Min = date.getMinutes().toString().padStart(2, '0');

    date.Year = date.getFullYear();
    date.Month = date.getMonth()+1;
    date.Day = date.getDate();
    date.Hour = date.getHours().toString().padStart(2, '0');
    date.Min = date.getMinutes().toString().padStart(2, '0');

    return date;
}