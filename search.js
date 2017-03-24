var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs')
var q = require('q');
var searchTerm = 'smd';
var url = 'https://www.aliexpress.com/wholesale?ltype=wholesale&d=y&origin=y&isViewCP=y&catId=0&initiative_id=SB_20170316090523&blanktest=0&tc=af&SearchText=' + searchTerm;
var pagination='www.aliexpress.com/wholesale?initiative';
var shiping = 'https://freight.aliexpress.com/ajaxFreightCalculateService.htm?callback=jQuery18303278056892461083_1490202654424&f=d&count=1&currencyCode=USD&sendGoodsCountry=&country=CA&province=&city=&abVersion=1&_=1490202775139&productid=';
var pages=[];
// pages.push(url);
 var itemCounter=0;
var re = /([\w\d_-]*)\.?[^\\\/]*$/i;
var requests=[];
var pages=[];
console.log("start");

function generateSearchResult(searchPhase) {

    var htmlOut="";
    request(url+searchPhase, function(err, resp, body){
        $ = cheerio.load(body);
        var links = $('a'); //jquery get all hyperlinks
        console.log(links.length);
        // console.log(":::"+JSON.stringify($(links)));
        $(links).each(function(i, link){
            var linkstxt=$(link).text();
            var href=$(link).attr('href');

            if(href.includes(pagination)) {

                href=href.replace("//","https://");
                console.log("linkstxt" + ':\n  ' + href);


                pages.push(href);
            }
        });
        // return;


        pages.forEach(function (pageUrl) {
            requests.push(processDetail(pageUrl,htmlOut));
        });
        // console.log("counter:" + itemCounter);

        q.all(requests).then(function(results) {
            results.forEach(function (result) {
                console.log("result :"+JSON.stringify(result) );
                console.log("result.value :"+result.value );
                if (result.state === "fulfilled") {
                    var value = result.value;
//                console.log("value:"+value);
                } else {
                    var reason = result.reason;
                }
            })
            //     .then(function(){
            console.log("wait for epacket");
            q.all(pages).then(function(results) {

                console.log("start");
                results.forEach(function (result) {
                    console.log("pages result :"+JSON.stringify(result) );
                    console.log("pages result.value :"+result.value );

                });

                console.log("end");

            });
            //
            // });

            console.log("all the requests were created");
            console.log("counter:" + itemCounter);
        });


    });

    return htmlOut;


    function processDetail(pageUrl,htmlOut) {
        var d = q.defer();

        request(pageUrl, function (err, resp, body) {
            if (body) {
                $ = cheerio.load(body);
                links = $('a'); //jquery get all hyperlinks
                $(links).each(function (i, link) {
                    var linkstxt = $(link).text();
                    var href = $(link).attr('href');
                    href=href.replace("//","https://");
                    if (href.includes("www.aliexpress.com/item")&&!href.includes('#feedback')&&!href.includes('#thf')) {
                        itemCounter++;
                        //console.log(linkstxt + ':\n  ' + href);
                        //console.log("+");
                        var productId=href.match(re)[1];
                        //console.log("productId:" +productId);
                        pages.push(checkProduct(href,linkstxt, productId));
                    }
                });
                d.resolve("ok");
            } else {
                d.resolve("nobody");
            }

        });
        return d.promise;
        // console.log("linkstxt" + pageUrl);
    }
    function checkProduct(urlPage,name, productId) {
        var p = q.defer();
        if(name) {
            request.get(shiping + productId)
                .on('data', function (data) {
                    if (data.indexOf("ePacket") > 0) {
                        // console.log('epacket: ' + productId);
                        var startParam=urlPage.indexOf('?')
                        urlPage=urlPage.substring(0,startParam);
                        var htmlA = '<a  href="' + urlPage + '">' + name + '</a>';
                        console.log(htmlA);
                        htmlOut=htmlOut+htmlA+'</br>';
                        p.resolve("epacket");
                    } else {
                        p.resolve("ship??");
                    }
                });
        }else{
            p.resolve("noname");
        }
        return p.promise;
    }
}



function extractItems(urlPage) {
   request(urlPage, function (err, resp, body) {
        $ = cheerio.load(body);
        links = $("input[attribute=value]"); //jquery get all hyperlinks
        $(links).each(function (i, link) {
            var linkstxt = $(link).text();
            var href = $(link).attr('href');
            if (href.includes("www.aliexpress.com/item")) {
                itemCounter++

                //console.log(linkstxt + ':\n  ' + $(link).attr('href'));
            }
        });
    });
}
