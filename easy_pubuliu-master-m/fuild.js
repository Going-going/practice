var currpage = 1, pagesize = 10, totalpage = 0;
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
			totalpage = data.totalpage;
			appendDom(data.data);
		}
	}
}
function calculate() {
	var cols = document.body.clientWidth / $('li')[0].offsetWidth;
	var arr = [];
	for(var i = 0; i < $('li').length; i++ ){
		if(i < cols-1){
			arr.push($('li')[i].offsetHeight);
		}else{
			var minHeight = Math.min.apply(this, arr);
			$('li')[i].style.position = 'absolute';
			$('li')[i].style.top = arr[getMindex(minHeight, arr)] + 'px';
			$('li')[i].style.left = $('li')[getMindex(minHeight, arr)].offsetLeft + 'px';
			arr[getMindex(minHeight, arr)] += $('li')[i].offsetHeight;
		}
		$('ul')[0].style.height = Math.max.apply(this, arr) + 'px';
	}
	
}
function appendDom(data) {
	for(var i = 0; i < data.length; i++){
		var oli = document.createElement('li');
		var img = document.createElement('img');
		var imgObj = new Image();
		imgObj.src = data[i].bookCover;
		imgObj.onload = function() {
			calculate();
		}
		oli.appendChild(imgObj)
		$('ul')[0].appendChild(oli);
	}
}

function reachBottom() {
	var clientHeight = document.documentElement.clientHeight;
	var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
	var ulHeight = $('ul')[0].offsetHeight;
	if(ulHeight-scrollTop <= clientHeight){
		if(currpage < totalpage){
			currpage++;
			ajax('http://127.0.0.1:9000/booklist', pagesize, currpage);
		}
	}
} 

window.onload = function() {
	ajax('http://127.0.0.1:9000/booklist', pagesize, currpage);
}
window.onscroll = function() {
	reachBottom();
	calculate();
}


