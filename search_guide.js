var req= require('request'),
querystring = require('querystring');

exports.searchMafengwo = function(word) {
  var MAFENGWO_DOMAIN = "http://www.mafengwo.cn";
  var postData = querystring.stringify({word: word, q: "", stp: ""});
  //console.log("postData: " + postData);
  req.post(
    {
    headers: {'Content-Type' : 'application/x-www-form-urlencoded', 'User-Agent': 'Wandoujia-labs'},
    url: "http://www.mafengwo.cn/group/searchresult.php", 
    body: postData
  }, function(e, searchResponse, b){
    console.log(MAFENGWO_DOMAIN+searchResponse.headers.location);
    req.get({
      headers: {'User-Agent': 'Wandoujia-labs'},
      url: MAFENGWO_DOMAIN + searchResponse.headers.location, 
    } , function(err, r, body) {
      console.log(r);
      if (!err && r.statusCode == 200) {
        console.log(body) // Print the google web page.
      }
      else {
        console.log("ERROR!!!! Response code: ");
      }
    });
  });
};
