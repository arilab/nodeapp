var express = require('express');
var app = express();
var fs = require('fs');

const persistUser = require('./persistUser');

app.use(express.json({type: '*/*'}));

app.get('/', function (request, response) {
   response.send('Hello World!');
});

app.get('/users', function (request, response) {
   let existingUsers = persistUser.listAll();
   response.end(JSON.stringify(existingUsers));
});

app.get('/user/:id', function (request, response) {
   try {
      let user = persistUser.retrieve(request.params.id);
      response.end(JSON.stringify(user));
   } catch(err) {
      response.end(err);
   }
})

app.post('/user', function (request, response) {
   try {
      console.log(request.body);
      persistUser.add(request.body.user);
      response.end('User successfully added');
   } catch(err) {
      response.end(err);
   }
})

app.delete('/user/:id', function (request, response) {
   try {
      persistUser.delete(request.params.id);
      response.end('User id: '+request.params.id+'successfully deleted');
   } catch(err) {
      response.end(err);
   }
})

app.listen(3000, function () {
   console.log('Server listening on port 3000!');
});