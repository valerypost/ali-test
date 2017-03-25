var app = function () {
    var http = require('http');
    var fs = require('fs');
    var express = require('express');
    var bodyParser = require('body-parser')
    var aliSearch = require('./search');

    var app = express();

    app.set('views', __dirname + '/views');

    app.engine('html', require('ejs').renderFile);

    app.use( bodyParser.json() );       // to support JSON-encoded bodies
    app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
        extended: true
    }));

    app.get('/', function (req, res) {
        res.render('index.html');
    });

    app.get('/search', function (req, res) {
        serveStaticFile(res, '/public/search.html', 'text/html');
    });
    app.post('/test', function (req, res) {
        var searchPar = req.body.search;
        res.writeHead(200, {'content-type': 'text/html'});
        var res = aliSearch.generateSearchResult(searchPar, res);
    });

    return app;

    function serveStaticFile(res, path, contentType, responseCode) {
        if (!responseCode) responseCode = 200;
        fs.readFile(__dirname + path, function (err, data) {
            if (err) {
                res.writeHead(500, {'Content-Type': 'text/plain'});
                res.end('500 - Internal Error');
            } else {
                res.writeHead(responseCode,
                    {'Content-Type': contentType});
                res.end(data);
            }
        });
    }
}();

module.exports = app;
