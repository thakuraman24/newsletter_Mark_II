require("dotenv").config();
process.env.MAILCHIMP_API_KEY;
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
  const Fn = req.body.Fn;
  const Ln = req.body.Ln;
  const Em = req.body.Em;
  const data = {
    members: [
      {
        email_address: Em,
        status: "subscribed",
        merge_fields: {
          FNAME: Fn,
          LNAME: Ln,
        },
      },
    ],
  };

  const jsonData = JSON.stringify(data);

  const url = "https://us21.api.mailchimp.com/3.0/lists/68794b355b";

  
  const options = {
    method: "POST",
    auth: "Raman:"+process.env.MAILCHIMP_API_KEY,
  };

  const request = https.request(url, options, function (response) {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/faliure.html");
    }

    response.on("data", function (data) {
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();
});

app.post("/faliure", function (req, res) {
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function () {
  console.log("server started at port 3000");
});
