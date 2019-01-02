/*
 * @Author: zhaoyangyue 
 * @Date: 2018-05-22 15:10:34 
 * @Last Modified by: zhaoyangyue
 * @Last Modified time: 2018-08-06 12:59:54
 */
const http = require('http')
const url = require('url')
const fs = require('fs')
var querystring = require('querystring')
const port = 9000;
var i = 0;
var backUrl = '';
var backHtml = function(backUrl) {
	console.log(backUrl)
	return '<!DOCTYPE html><html lang="en">'+
	'<head><meta charset="UTF-8">'+
	'<meta name="viewport" content="width=device-width, initial-scale=1.0">'+
	' <meta http-equiv="X-UA-Compatible" content="ie=edge">'+
	'<meta http-equiv="refresh" content="0;url='+backUrl+'">'+
		'<title>Document</title>'+
	'</head>'+
	'<body>正在提交，请稍后...</body>'+
	'</html>'
}

function read(filename, cb) {
	fs.readFile(filename, function (err, data) {
		if (err) {
			console.log(err)
		} else {
			i++;
			// console.log(i)
			cb(JSON.parse(data))
		}
	})
}

http.createServer((request, response) => { //输出文件为json格式
	response.setHeader("Access-Control-Allow-Origin", "*");
	response.setHeader("Access-Control-Allow-Headers", "Cache-Control,Content-Type,Hash-Referer,X-Requested-With");
	response.setHeader("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
	response.setHeader("X-Powered-By",' 3.2.1');
	response.setHeader('Content-type', 'application/json;charset=utf8');
	// 当执行put和delete等复杂请求的时候，浏览器会先发送一个options请求 给后端服务器。服务器如果同意，再发送put请求
	// 这里结束掉options的请求 然后再执行后面的方法
	if(request.method == 'OPTIONS') return response.end();
	// url模块的两个参数 pathname为/后的内容  query ？ 后的参数
	let { pathname, query } = url.parse(request.url, true);//解构赋值
	// 轮播图
	if (pathname === '/slide' || pathname === '/') {
		read('slide.json', (data) => {
			response.end(JSON.stringify(data))
		})
	}
	//热门图书
	if (pathname === '/hotbook') {
		read('book.json', (data) => {
			var arr = data.slice(-6).reverse();
			response.end(JSON.stringify(arr))
		})
	}
	// 图书列表操作
	if(pathname === '/booklist'){
		var oldData = [];
		read('book.json', function (data) {
			oldData = data;
			switch(request.method) {
				case 'GET':
					var returnData = {};
					if(query.id){
						console.log('获取单本书')
						var item = data.filter(function(data, index) {
							return data.id == query.id;
						})
						response.end(JSON.stringify(item));
					}else{
						console.log(data.length)
						total_count = data.length;
						/* 分页设置 
							pagesize:每页条数
							currpage:当前页数 
							totalpage:总页数 
							offset: 偏移 需要从第几条数据开始加载
							hasmore: 是否还有下一页,
							total_count 总条数
						*/
						let pagesize = 5;  //默认每页条数
						let offset = 0;   // 默认从第0条开始加载
						console.log(query)
						if(query.pagesize) pagesize = query.pagesize;
						if(query.offset) offset = query.offset;
						var newData =  data.slice(offset);
						if(query.activeIndex == 1){
							response.end(JSON.stringify({
								data: [],
								currpage: 1,
								hasmore: false,
								total_count
							}))
						}
						if(query.currpage){
							var currpage = query.currpage;
							if(newData.length % pagesize != 0){
								var totalpage = parseInt(newData.length / pagesize) + 1;
							}else{
								var totalpage = parseInt(newData.length / pagesize);
							}
							returnData.hasmore = query.currpage == totalpage ? false : true; 
							returnData.totalpage = totalpage;
							returnData.currpage = currpage;
							returnData.data = newData.splice((currpage - 1) * pagesize, pagesize);
							console.log('获取第'+currpage+'页数据')
							returnData.total_count = total_count;
							response.end(JSON.stringify(returnData))
						}else{
							console.log('获取所有书');
							returnData.data = newData;
							response.end(JSON.stringify(returnData))
						}
					}
					break;
				case 'POST':
					var body = '';
					request.on('data', (chunk) => {
						// buffer 转换？
						body += chunk;
					})

					request.on('end', () => {
						body = querystring.parse(body);
						body.id = oldData[oldData.length - 1].id + 1;
						oldData.push(body)
						fs.writeFile('book.json', JSON.stringify(oldData), function(err) {
							if (err) {
								return console.error(err);
							}
							console.log("数据写入成功！");
							response.writeHead(200,{'Content-Type':'text/html'});
							backUrl = 'http://localhost:8080/#/add'
							response.end(backHtml(backUrl))
						})
					});
					break;
				case 'DELETE':
          for(var i in data){
            if(oldData[i].id == query.id){
              oldData.splice(i, 1)
            }
          }
          fs.writeFile('book.json', JSON.stringify(data), function (err) {
            if(err) return console.log(err)
            console.log('删除文件成功')
          })
					response.end(JSON.stringify(data))
					break;
				case 'PUT':
				case 'PATCH':
					var body = '';
					request.on('data', (chunk) => {
						// buffer 转换？
						body += chunk;
					}) 
					request.on('end', ()=>{
						body = JSON.parse(body);
						oldData.forEach(function (item, index) { 
							if(item.id == body.id){
								oldData.splice(index, 1, body)
							}
						})
						response.end(JSON.stringify(oldData))
						fs.writeFile('book.json', JSON.stringify(oldData), function (err) { 
							if(err) return console.log(err)
							console.log('文件修改完成');
						 })
					})
					break;
				default:
					break;
			}
		 })

	}
}).listen(port)

console.log('server is running in http://127.0.0.1:' + port);
