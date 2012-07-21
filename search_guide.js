var req = require('request'),
querystring = require('querystring'),
jsdom = require('jsdom'),
fs = require('fs');

var navigateUrl = function(url, callback){
    req.get({
        headers: {'User-Agent': 'Wandoujia-labs'},
        url: url 
    } , function(err, r, body) {
        if (!err && r.statusCode == 200) {
            console.log(body);
            callback(body);
        }
        else {
            console.log("ERROR!!!! Response code: "+err);
        }
    });
};

var getGuideDetailsUrl = function (spotHTML, callback) {
    jsdom.env(spotHTML, [ 'http://code.jquery.com/jquery-1.7.2.min.js' ], function(errors, window) {
        callback(window.$("div.box.box_book > div.cont > a.btn").attr("href"));
    });
};

exports.searchMafengwo = function(word, searchCallback) {
    var MAFENGWO_DOMAIN = "http://www.mafengwo.cn";
    var postData = querystring.stringify({word: word, q: "", stp: ""});
    console.log("Searching Mafengwo with postData: " + postData);
    req.post(
        {
        headers: {'Content-Type' : 'application/x-www-form-urlencoded', 'User-Agent': 'Wandoujia-labs'},
        url: "http://www.mafengwo.cn/group/searchresult.php", 
        body: postData
    }, function(e, searchResponse, b){
        // 1. Navigate to "travel-scenic-spot"
        var spotPage = MAFENGWO_DOMAIN + searchResponse.headers.location;
        console.log("Got Mafengwo spot page: " + spotPage);
        navigateUrl(spotPage, function(responseHTML){
            // 2. Get the detail URL
            getGuideDetailsUrl(responseHTML, function (guideDetailUrl) {
                console.log(guideDetailUrl);
                // 3. Visit the detail URL and return data
                navigateUrl(MAFENGWO_DOMAIN + guideDetailUrl, function (detailHTML) {
                    var imgList = detailHTML.match(/^var\simg_dat=(.*);$/mi)[1];
                    var resultData = {
                        PdfLink: "",
                        ImgList: JSON.parse(imgList)
                    };
                    searchCallback(resultData);
                });
            });
        }); 
    });
};

exports.searchLvren = function(word, searchCallback) {
    var LVREN_DOMAIN = "http://so.lvren.cn";
    var postData = querystring.stringify({k: word, t: "scenic"});
    console.log("Searching Lv ren with postData: " + postData);
    req.post(
        {
        headers: {'Content-Type' : 'application/x-www-form-urlencoded', 'User-Agent': 'Wandoujia-labs'},
        url: "http://so.lvren.cn/search/", 
        body: postData
    }, function(e, searchResponse, b){
        // 1. Navigate to "travel-scenic-spot"
        var firstJump = LVREN_DOMAIN + searchResponse.headers.location;
        console.log("Got Lvren first page: " + firstJump);
        req.get({
            url: "http://so.lvren.cn/scenic/%E4%B8%BD%E6%B1%9F/"
        } , function(err, res, body) {
            console.log(res.headers);
            console.log(body);
            console.log("Got Lvren second page: " + res.headers.location);
            //console.log(r.headers.location);
        });
            
    });
};
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
