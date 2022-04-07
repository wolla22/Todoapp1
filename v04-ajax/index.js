// run "npm install . "

const MongoClient = require('mongodb').MongoClient;

const ID= '???';
const PASSWORD = '???';
const DATABASE = 'todoapp';
const NET = '???';

const URL = `mongodb+srv://${ID}:${PASSWORD}@${NET}/${DATABASE}?retryWrites=true&w=majority`

var db;
MongoClient.connect(URL, { useUnifiedTopology: true }, function (error, client) {
    if (error) return console.log(error)
    db = client.db('todoapp');
});

const express = require('express');
const app = express();
const bodyParser= require('body-parser')
app.use(bodyParser.urlencoded({extended: true})) 
app.use(express.urlencoded({extended: true})) 
app.set('view engine', 'ejs');

app.listen(5500, function() {
    console.log('listening on 5500')
});

app.get('/', function(req, resp) { 
    resp.sendFile(__dirname +'/write.html')
});

app.post('/add', function(req, resp) {
    console.log(req.body);

    db.collection('counter').findOne({name : 'Total Post'}, function(error, res) {
        var totalPost = res.totalPost
    
        db.collection('post').insertOne({ _id : totalPost + 1, title : req.body.title, date : req.body.date }, function (error, res) {
            if(error){return console.log(error)}
            db.collection('counter').updateOne({name : 'Total Post'},{ $inc: {totalPost:1} },function(error, res){
                if(error){return console.log(error)}
                resp.send('Stored to Mongodb OK');
            })
        })
    })
});

app.get('/list', function(req, resp){
    db.collection('post').find().toArray(function(error, res){
        console.log(res)
        resp.render('list.ejs', { posts: res })
    })
});

app.delete('/delete', function(req, resp){
    req.body._id = parseInt(req.body._id); // the body._id is stored in string, so change it into an int value
    console.log(req.body._id);
    db.collection('post').deleteOne(req.body, function(error, res) {
        console.log('Delete complete')
    })
    resp.send('Delete complete')
}); 