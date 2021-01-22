const http = require("http");
const fs = require("fs");
const url = require("url");

http.createServer((req, res) => {
    console.log(req.url);
    console.log(url.parse(req.url, true));

    let postData = [];

    /*
    pathname 请求路径
    query   url参数       get请求参数
     */
    let {pathname, query} = url.parse(req.url, true);
    // 请求接口     /service
    if ("/service" === pathname) {
        // post请求需要用流 事件监听
        req.on("data", data => {
            postData.push(data);
        });

        req.on("end", () => {
            let buffer = Buffer.concat(postData);
            console.log(buffer.toString());
            res.write(JSON.stringify(query));
            res.end();
        });
    } else {
        // 返回页面
        fs.readFile(`www${decodeURI(pathname)}`, (err, data) => {
            if (err) {
                res.writeHeader("404");
            } else {
                res.write(data);
            }
            res.end();
        });
    }
}).listen("8080");