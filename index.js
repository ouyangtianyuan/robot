var http = require("http")
var url = require("url")
var fs = require("fs")
var reqs = require("request")

http.createServer(function (req, res) {
    var pathname = url.parse(req.url).pathname;
    var params = url.parse(req.url, true).query;
    var flag = isStatic(pathname)
    if (flag) {
        try {
            var data = fs.readFileSync("./page/" + pathname)
            res.writeHead(200)
            res.write(data)
            res.end()
        } catch (e) {
            res.writeHead(404)
            res.write("<html><body><h1>404 NotFound</h1></body></html>")
            res.end()
        }
    } else {
        if (pathname == "/chat") {
            var data = {
                "reqType": 0,
                "perception": {
                    "inputText": {
                        "text": params.value
                    }
                },
                "userInfo": {
                    "apiKey": "3fd5c1ef1c844a2d9595a1c443f492ae",
                    "userId": "359681"
                }
            }
        }
        var content = JSON.stringify(data)
        reqs({
            url: "http://openapi.tuling123.com/openapi/api/v2",
            method: 'post',
            headers: {
                "content-type": "application/json"
            },
            body: content
        }, function (error, response, body) {
            if(!error && response.statusCode == 200){
                var obj = JSON.parse(body)
                if(obj && obj.results && obj.results.length > 0 && obj.results[0].values){
                    var head = {"Access-Control-Allow-Origin":"*","Access-Control-Allow-Methods":"get","Access-Control-Allow-Headers":"x-requested-with,content-type"}
                    res.writeHead(200,head)
                    res.write(JSON.stringify(obj.results[0].values))
                    res.end()
                }
            }else{
                res.write("{\"value\":\"不知道你在说什么呢\"}")
                res.end()
            }
        })
    }
}).listen(12306)

function isStatic(pathname) {
    var staticArr = [".html", ".png", ".jpg", ".gif", ".gif", ".css"]
    for (var i = 0; i < staticArr.length; i++) {
        if (pathname.indexOf(staticArr[i]) == pathname.length - staticArr[i].length) {
            return true
        }
    }
    return false
}