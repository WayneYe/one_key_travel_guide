var req = require('request'),
querystring = require('querystring'),
jsdom = require('jsdom'),
fs = require('fs'),
querystring = require('querystring');

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
    jsdom.env(spotHTML, 
              [
                  'http://code.jquery.com/jquery-1.7.2.min.js'
              ],
              function(errors, window) {
                  callback(window.$("div.box.box_book > div.cont > a.btn").attr("href"));
              });
};

exports.searchMafengwo = function(word, searchCallBack) {
    var MAFENGWO_DOMAIN = "http://www.mafengwo.cn";
    var postData = querystring.stringify({word: word, q: "", stp: ""});
    //console.log("postData: " + postData);
    req.post(
        {
        headers: {'Content-Type' : 'application/x-www-form-urlencoded', 'User-Agent': 'Wandoujia-labs'},
        url: "http://www.mafengwo.cn/group/searchresult.php", 
        body: postData
    }, function(e, searchResponse, b){
        // 1. Navigate to "travel-scenic-spot"
        var spotPage = MAFENGWO_DOMAIN + searchResponse.headers.location
        console.log("Got Mafengwo spot page: " + spotPage);
        navigateUrl(spotPage, function(responseHTML){
            // 2. Get the detail URL
            getGuideDetailsUrl(responseHTML, function (guideDetailUrl) {
                console.log(guideDetailUrl);
                // 3. Visit the detail URL and return data
                navigateUrl(MAFENGWO_DOMAIN + guideDetailUrl, function (detailHTML) {
                    var imgList = detailHTML.match(/^var\simg_dat=(.*);$/mi)[1];
                    var resultData = {
                        ImgList: JSON.parse(imgList)
                    };
                    searchCallBack(resultData);
                });
            });
        }); 
    });
};
