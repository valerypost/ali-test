/**
 * Created by vbalovnev on 3/23/2017.
 */
var http = require('http'),
    fs = require('fs');
var aliSearch = require('./search');

http.createServer(function (req, res) {
// normalize url by removing querystring, optional
// trailing slash, and making it lowercase
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

    var path = req.url.replace(/\/?(?:\?.*)?$/, '').toLowerCase();
    switch (path) {
        case '':
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.write("dddddddddddddddd");
            res.end('Homepage');
            break;
        case '/about':
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end('About');
            break;
        case '/test':
            res.writeHead(200, {'content-type':'text/html'});
            var res=aliSearch.generateSearchResult("smd",res);
            // res.end('test');
            break;
        case '/search':
            serveStaticFile(res, '/public/search.html', 'text/html');
            break;

        case '/about1':
            serveStaticFile(res, '/public/about.html', 'text/html');
            break;
        default:
            res.writeHead(404, {'Content-Type': 'text/plain'});
            res.end('Not Found');
            break;
    }
}).listen(3000);
console.log('Server started on localhost:3000; press Ctrl-C to terminate....');