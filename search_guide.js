var req = require('request'),
    querystring = require('querystring'),
    cheerio = require('cheerio'),
    _ = require('underscore');

var navigateUrl = function(url, callback) {
        req.get({
            headers: {
                'User-Agent': 'Wandoujia-labs'
            },
            url: url
        }, function(err, r, body) {
            if (!err && r.statusCode == 200) {
                callback(body);
            } else {
                console.log("ERROR!!!! Response code: " + err);
            }
        });
    };

var loadDOM = function(html, selectors, callback) {
        var $ = cheerio.load(html), domResult = [];
        _(selectors).each(function(selector){
            domResult.push($(selector));
        });
        console.log("domResult...");
        console.log(domResult);
        callback(domResult);
    };


exports.searchMafengwo = function(word, searchCallback) {
    var MAFENGWO_DOMAIN = "http://www.mafengwo.cn";
    var postData = querystring.stringify({
        word: word,
        q: "",
        stp: ""
    });
    console.log("Searching Mafengwo with postData: " + postData);
    req.post({
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': 'Wandoujia-labs'
        },
        url: "http://www.mafengwo.cn/group/searchresult.php",
        body: postData
    }, function(e, searchResponse, b) {
        // 1. Navigate to "travel-scenic-spot"
        var spotPage = MAFENGWO_DOMAIN + searchResponse.headers.location;
        console.log("Got Mafengwo spot page: " + spotPage);
        navigateUrl(spotPage, function(responseHTML) {
            // 2. Get the detail URL
            loadDOM(responseHTML, ["div.box.box_book > div.cont > a.btn", "li.post_item"], function(domData) {
                var guideDetailUrl = domData[0].attr("href"), posts = [];
                console.log(guideDetailUrl);
                //domData[1].each(function(i, elem) {
                    //posts.push(elem.html());
                //});
                //console.log(domData[1].html());
                posts = domData[1].html();
                console.log(posts);
                
                // 3. Visit the detail URL and return data
                navigateUrl(MAFENGWO_DOMAIN + guideDetailUrl, function(detailHTML) {
                    var imgList = [];
                    if (detailHTML.match(/^var\simg_dat=(.*);$/mi).length)
                        imgList = detailHTML.match(/^var\simg_dat=(.*);$/mi)[1];
                    var resultData = {
                        PdfLink: "",
                        ImgList: JSON.parse(imgList),
                        Posts: posts
                    };
                    console.log("Finished searching Mafengwo, result: ");
                    console.log(resultData);
                    searchCallback(resultData);
                });
            });
        });
    });
};

exports.searchLvren = function(word, searchCallback) {
    var LVREN_DOMAIN = "http://so.lvren.cn";
    var postData = querystring.stringify({
        k: word,
        t: "scenic"
    });
    console.log("Searching Lv ren with postData: " + postData);
    req.post({
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': 'Wandoujia-labs'
        },
        url: "http://so.lvren.cn/search/",
        body: postData
    }, function(e, searchResponse, b) {
        // 1. Navigate to "travel-scenic-spot"
        var firstJump = LVREN_DOMAIN + searchResponse.headers.location;
        console.log("Got Lvren first page: " + firstJump);
        navigateUrl(firstJump, function(firstResHTML) {
            loadDOM(firstResHTML, ["div.tc-nav-list-d > ul > li:eq(1) > a"], function(anchor) {
                var secondJump = anchor[0].attr("href");
                console.log("Got Lvren second page: " + secondJump);
                navigateUrl("http://d.lvren.cn" + secondJump, function(secondResHTML) {
                    loadDOM(secondResHTML, ["a.download"], function(downloadLink) {
                        console.log(downloadLink[0]);
                        var resultData = {
                            PdfLink: downloadLink[0].attr("href"),
                            PdfIcon: "",
                            ImgList: []
                        };
                        console.log("Finished searching Lvren, result: ");
                        console.log(resultData);
                        searchCallback(resultData);
                    });
                });
            });
        });
    });
};
//exports.searchBaidu = function (word, searchCallback) {
    //var BAIDU_URL = "http://lvyou.baidu.com";
    //var searchQuery = querystring.stringify({
        //word: word,
        //form: 1,
    //});
    //console.log("Searching baidu with search query:" + searchQuery);
    //navigateUrl("http://lvyou.baidu.com/search??" + searchQuery, function(responseHTML) {
        //loadDOM(responseHTML, "", function(articles){
            //console.log(articles);
            //var resultData = {
                //PdfLink: "",
                //ImgList: ""
            //};
            //console.log("Finished searching Mafengwo, result: ");
            //console.log(resultData);
            //searchCallback(resultData);
        //});
    //});
//}
//exports.searchCtrip = function(word, searchCallback){
//var CTRIP_DOMAIN = "http://travel.ctrip.com/CMS/SearchResult.aspx?";
//var queryStr = querystring.stringify({KeyWords: word});
//console.log("Searching Ctrip with query string: " + queryStr);
//navigateUrl(CTRIP_DOMAIN + queryStr, function (responseHTML) {
//console.log(responseHTML);
//jsdom.env(responseHTML, [ 'http://code.jquery.com/jquery-1.7.2.min.js' ], function(errors, window) {
//console.log(window.$("div.pkg-download-box").html());
//var pdfLink = window.$("div.pkg-download-box > a.pkg-download").attr("href");
//console.log("Ctrip PDF link: " + pdfLink);
//var resultData = {
//PdfLink: pdfLink,
//ImgList: []
//};
//searchCallback(resultData);
//});
//});
//};
