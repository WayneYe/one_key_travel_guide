
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: '一键旅行助手' });
};