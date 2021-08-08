// jshint esversion:6
const express = require('express');
const https = require('https');

const app = express();
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/signup.html');
});

app.post('/', function(req, res){
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };

  const jsonData = JSON.stringify(data);
  const url = 'https://us5.api.mailchimp.com/3.0/lists/bec5c419ea';
  const options = {
    method: 'POST',
    auth: 'lax17:2eafee45783c69bed0f81db217d6c2d9-us5'
  };
  const request = https.request(url, options, function(response){
    if (response.statusCode === 200){
      res.sendFile(__dirname + '/success.html');
    }else{
      res.sendFile(__dirname + '/failure.html');
    }
    response.on('data', function(data){
      console.log(JSON.parse(data));
    });
  });

  // sending jsonData to mailchimp
  request.write(jsonData);
  request.end();
});

app.post('/failure', function(req, res){
  res.redirect('/');
});

app.listen(process.env.POST || 3000, function(){    
  console.log('Server is running on port 3000');
});


//APIkey
//unique_id = bec5c419ea
//2eafee45783c69bed0f81db217d6c2d9-us5
