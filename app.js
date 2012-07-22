
/**
 * Module dependencies.
 */

var express = require('express')
, routes = require('./routes')
, http = require('http')
, searchGuide = require('./search_guide');

var app = express();

process.env.PORT = 80;
app.configure(function(){
    app.set('port', process.env.PORT);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
    app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/sp', routes.sp);
app.get('/io', routes.io);

app.post('/search/', function(req, res){
    var word = req.body.word, taskCounter = 0, responseData = {};
    console.log("Searching with keyword: " + word);
    res.header("Content-Type", "application/json");
    searchGuide.searchMafengwo(word, function (result) {
        responseData["Mafengwo"] = result; 
        taskCounter++;
    }); 
    searchGuide.searchLvren(word, function (result) {
        responseData["Lvren"] = result; 
        taskCounter++;
    }); 

    var handle = setInterval(function(){
        if(taskCounter == 2) {
            res.send(responseData);
            clearInterval(handle);
        }
    }, 100);
});

http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
});
