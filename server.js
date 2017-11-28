var app = require('express')();
var http = require('http').Server(app);
var bodyParser = require('body-parser');
var io = require('socket.io')(http);
var fs = require('fs');
var MongoClient = require('mongodb').MongoClient;
var ejs = require('ejs');
var assert = require('assert');
var ObjectID = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/eventsTest';


/*these two bits of code are necessary in order to properly handle
ajax post requests*/
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());

//Setting our node server to render dynamic pages utilizing ejs, may
//change later.
app.set('view engine', 'ejs');



//index.html, will be set to angular app once that's actually created
app.get('/', function(req, res){
  res.sendFile(__dirname + '/views/index.html');
});

//Testing url to check for dynamic chat room functionality
app.get('/testChatRender', function(req, res){
  var title = "Testing some dynamic chat room rendering: ";
  res.render('chat', {
    title: title
  });
})

app.get('/testGet', function(req, res){
  res.sendFile(__dirname + '/tests/testget.html');
})

app.get('/chat/:id', function(req, res){
  var title = req.params.id;
  res.render('chat', {
    title: title
  });

})
app.get('/diffRoom', function(req, res){
  var title = "diff room";
  res.render('chat', {
    title: title
  });
})


/*Making a get request here will return a json array containing each event */
app.get('/dbQuery', function(req, res){
  MongoClient.connect(url, function (err, database) {
    if (err) {
      console.log(err);
      console.log("Problem Here!");
      process.exit(1);
    }
    db = database;
    console.log("database connection ready");
    db.collection("eventsTest").find({}).toArray(function(err, docs) {
      if (err) {
        handleError(res, err.message, "Failed to get Events.");
      } else {
        res.status(200).json(docs);
      }
    });
  });
})

app.get('/postDBtest', function(req, res){
  res.sendFile(__dirname + '/tests/posttest.html');
});

/*Event insertion process*/
/*Make a post request here to insert an event into the database*/
app.post('/dbInsert', function(req, res) {
  MongoClient.connect(url, function (err, database){
    if (err) {
      console.log(err);
      console.log("Problem Here!");
      process.exit(1);
    }
    db = database;
    console.log("database connection ready");

    console.log(req.body);

    var newEvent = req.body;

    console.log

    db.collection("eventsTest").insertOne(newEvent, function(err, doc){
      if (err) {
        handleError(res, err.message, "Failed to add event");
      } else {
        res.status(201).json(doc.ops[0]);
      }
    });
  });
})

/*Put request to here will update the "going" function of our db*/
app.put('/dbAddGuests/:id', function(req, res){

  MongoClient.connect(url, function (err, database){
    if (err) {
      console.log(err);
      console.log("Problem Here!");
      process.exit(1);
    }
    db = database;
    console.log("database connection ready");


    var addGuest = req.body;

    var id = req.params.id;

    db.collection("eventsTest").updateOne({_id: ObjectID(id)},{$inc:{'Going': 1}}, function(err, doc){
      if (err) {
        handleError(res, err.message, "failed to update");
      } else {
        res.status(201).json(doc.ops[0]);
      }
    });
  });
});

/*Put request here should remove one guest(i.e., if a user says there not going anymore.)*/
/* "5a1c7dff8cc4c257130d1334"*/
app.put('/dbRemoveGuests/:id', function(req, res){

  MongoClient.connect(url, function (err, database){
    if (err) {
      console.log(err);
      console.log("Problem Here!");
      process.exit(1);
    }
    db = database;
    console.log("database connection ready");


    var addGuest = req.body;

    var id = req.params.id;

    db.collection("eventsTest").updateOne({_id: ObjectID(id)},{$inc:{'Going': -1}}, function(err, doc){
      if (err) {
        handleError(res, err.message, "failed to update");
      } else {
      console.log("Record updated");
      }
    });
  });
});


/*Chat functionality, for now:
  Will be buffing out with functionality for dynamic chat rooms
*/

io.on('connection', function(socket){
  console.log("User connected");

  socket.on('disconnect', function(){
    console.log("user disconnected");
  });


  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
    io.emit('chat message', msg);
  });
});


http.listen(3000, function(){
  console.log('listening on *:3000');
});
