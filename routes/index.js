
/*
 * GET home page.
 */

exports.index = function(req, res){
    res.render('index', { title: '一键旅行助手' });
};

exports.sp = function(req, res){
    res.render('sp', { title: 'HTML5 Server push demo' });
};

exports.io = function(req, res){
    //req.socket.setTimeout(Infinity);

    res.header("Content-Type", "text/event-stream");
    res.header("Cache-Control", "No-Cache");

    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });
    res.write('data: hellow');
    res.write('\n');


    setInterval(function(){
        console.log("PUSH DATA!");
        res.write('data: hellow');
        res.write('\n');
    },3000);
}
