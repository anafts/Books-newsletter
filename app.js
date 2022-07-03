//Requiring express, body parser, request, https and mailchimp:
const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const https = require("https");
const client = require("@mailchimp/mailchimp_marketing");
const dotenv = require("dotenv");

dotenv.config()

// Initializing the constant "app": 
const app = express();


app.use(express.static(__dirname + '/public')); 
app.use(bodyParser.urlencoded({extended: true }));


app.get("/" , function (req , res) {
res.sendFile(__dirname + "/signup.html");
});


//Setting up MailChimp
client.setConfig({
     apiKey: process.env.API_KEY,
     server: "us10"
    });

    // Getting datas from the body-parser:
    app.post("/", function(req, res){
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const email = req.body.email;
        const listId = process.env.LIST_ID;
        console.log(firstName, lastName, email);

        //Creating an object with the users data
        const subscribingUser = {
          firstName: firstName,
          lastName: lastName,
          email: email
        }
        //Uploading the data to the server
        const run = async () => {
        try {
      const response = await client.lists.addListMember(listId, {
        email_address: subscribingUser.email,
        status: "subscribed",
        merge_fields: {
          FNAME: subscribingUser.firstName,
          LNAME: subscribingUser.lastName
        }
      });

      console.log(response);
      //If all goes well logging the contact's id:
      res.sendFile(__dirname + "/sucess.html");
      console.log(`Successfully added contact as an audience member.`)
      //executed when there is an error:
    } catch (err) {
      console.log(err.status);
      console.log("====== ERROR ======");
      console.log(JSON.parse(err.response.error.text).detail);
      res.sendFile(__dirname + "/failure.html");
    }
  };
  run();
});
 
// Back to the home from failure page:
app.post("/failure", function(req, res) {
  res.redirect("/");
});

// Back to the home from success page:
app.post("/sucess", function(req, res) {
  res.redirect("/");
});
      
// Serveron Heroku or 3000 port:
app.listen(process.env.PORT || 3000, function() {
     console.log("Server is running on port 3000");
});