const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const path = require('path')

const app = express();
const port = 3000;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')))
require('dotenv').config()
console.log(process.env.API_KEY)
/* app.use('/public',express.static('public')); */
/* app.use(express.static("public")); */

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});
app.post("/", (req, res) => {
  var firstName = req.body.fName;
  var lastName = req.body.lName;
  var email = req.body.email;

  const listId = "7dcb24eaee";
  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };

  const jsonData = JSON.stringify(data);
  const dc = "us21";
  const apiKey = process.env.API_KEY;
  const url =
    "https://" + dc + ".api.mailchimp.com/3.0/lists/" + listId;
  const options = {
    method: "POST",
    auth: "blackpyjac:" + apiKey,
  };
  console.log(firstName + " " + lastName + " " + email);
  const request = https.request(url, options, (response) => {
    //conssole.log(response)
   
    response.on("data", (data) => {
      data=JSON.parse(data)
/*       if (data.error_count >= 1) {
        res.sendFile(__dirname+"/failure.html")
      } */
      console.log(data)
      if (response.statusCode === 200) {
        if (data.error_count >= 1) {
          res.sendFile(__dirname+"/failure.html")
        }else{
          res.sendFile(__dirname+"/success.html")
        }
       
      } else {
        //console.log(response)
        res.sendFile(__dirname+"/failure.html")
      }

      console.log(data.error_count);
    });
  });
  request.write(jsonData);
  request.end();
  //'{"name":"","contact":{"company":"","address1":"","address2":"","city":"","state":"","zip":"","country":"","phone":""},"permission_reminder":"","use_archive_bar":false,"campaign_defaults":{"from_name":"","from_email":"","subject":"","language":""},"notify_on_subscribe":"","notify_on_unsubscribe":"","email_type_option":false,"double_optin":false,"marketing_permissions":false}
});

app.post('/failure', (req, res) => {
  res.redirect('/');
})
app.listen(process.env.PORT || port, () => {
  console.log(`Example app listening on port ${port}`);
});
