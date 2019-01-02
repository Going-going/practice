function $(el){
	if(el.indexOf('#') > -1){
		return document.getElementById(el.split('#')[1]);
	}else if(el.indexOf('.') > -1){
		return document.getElementsByClassName(el.split('.')[1]);
	}else {
		return document.getElementsByTagName(el);
	}
}
function getMindex(minHeight, arr) {
	for(var i = 0; i < arr.length; i++){
		if(arr[i] == minHeight){
			return i;
		}
	}
}
function ajax(url, pagesize, currpage) {
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open('GET', url + '?pagesize=' + pagesize + '&currpage=' + currpage, true);
	xmlHttp.send();
	xmlHttp.onreadystatechange = function() {
		if(xmlHttp.status == 200 && xmlHttp.readyState == 4){
			console.log(JSON.parse(xmlHttp.response));
			var data = JSON.parse(xmlHttp.response);
			appendDom(data.data);
		}
	}
}
ajax('http://127.0.0.1:9000/booklist', 10, 1);

window.onload = function() {
	calculate();
}
function calculate() {
	var cols = document.body.clientWidth / $('li')[0].offsetWidth;
	var arr = [];
	for(var i = 0; i < $('li').length; i++ ){
		if(i < cols){
			arr.push($('li')[i].offsetHeight);
		}else{
			var minHeight = Math.min.apply(this, arr);
			$('li')[i].style.position = 'absolute';
			$('li')[i].style.top = arr[getMindex(minHeight, arr)] + 'px';
			$('li')[i].style.left = $('li')[getMindex(minHeight, arr)].offsetLeft + 'px';
			arr[getMindex(minHeight, arr)] += $('li')[i].offsetHeight;
		}
	}
}
function appendDom(data) {
	for(var i = 0; i < data.length; i++){
		var oli = document.createElement('li');
		oli.innerHTML = '<img src="'+data[i].bookCover+'" />';
		$('ul')[0].appendChild(oli);
	}
}
reachBottom();
function reachBottom() {
	var clientHeight = document.documentElement.clientHeight;
	var scrollTop = document.documentElement.scrollTop;
	console.log(clientHeight, scrollTop);
}

