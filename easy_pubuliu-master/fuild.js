/**
 * @author: zhaoyangyue
 * @version: 简书  作者：oldSix_Zhu 	链接：http://www.jianshu.com/p/0a9b27e7da36  
 * @description: 自己写的demo 图片随便从网上找的 如有雷同纯属巧合
 */
function $(id){
	return typeof id === 'string' ? document.getElementById(id) : id;
}

window.onload = function(){
	// 数据
	var pageSize = 10;
	var data = ['images/timg_03.png', 'images/timg_05.png', 'images/timg_07.png', 'images/timg_09.png', 'images/timg_14.png', 'images/timg_15.png', 'images/timg_16.png', 'images/timg-(1)_03.png', 'images/timg-(1)_05.png', 'images/timg-(1)_08.png', 'images/timg-(1)_11.png'];
	
	// 动态赋值
	appendDom(data);
	
	// 第一次加载时 判断是否填充满整个屏幕
	var s = document.body.offsetHeight;
	var screenHeight =   window.screen.height;
	if(s < screenHeight){
		appendDom(data);
	}
	setFall('wrap-box', 'box');
	window.onscroll = function(){
		console.log(checkLoad());
		if(checkLoad()){
			var data = ['images/timg_03.png', 'images/timg_05.png', 'images/timg_07.png', 'images/timg_09.png', 'images/timg_14.png'];
			$('loading').style.display = 'block';
			appendDom(data);
			setFall('wrap-box', 'box');
//			$('loading').style.display = 'none';
			setTimeout(function(){
			},1000)
			
		}
	}
	
}
function appendDom(data){
	for(var i = 0;i < data.length; i++){
		var oBox = document.createElement('div');
		oBox.className = 'box';
		var oPic = document.createElement('div');
		oPic.className = 'pic';
		var oImg = document.createElement('img');
		oImg.src = data[i];
		oPic.appendChild(oImg);
		oBox.appendChild(oPic);
		$('wrap-box').appendChild(oBox);
	}
}
// param: 父元素  子元素（外层）
function setFall(parent, box){
	var allbox = $(parent).getElementsByClassName(box);
	var boxWidth = allbox[0].offsetWidth;
	
	var screenWidth = document.body.offsetWidth;
	var screenHeight = document.documentElement.clientHeight;
	
	var cols = Math.floor(screenWidth / boxWidth);
	$(parent).style.width = boxWidth * cols + 'px';
	
	$(parent).style.margin = '0 auto';  // 父元素居中
	
	// 每一列的高度值会放在下面的数组里
	var heightArr = [];
	// 判断最小高度 并赋值  加延时原因是数据还没有加载完成会执行函数
	setTimeout(function(){
		for(var i = 0; i < allbox.length; i++){
			var boxHeight = allbox[i].offsetHeight;
			if(i < cols){
				heightArr.push(boxHeight);
			}else{
				// 获取最小高度
				var minHeight = Math.min.apply(this, heightArr);
				// 获取最小高度的索引
				var minIndex = getMInboxIndex(minHeight, heightArr);
				// 下一个盒子从最小高度开始填充
				allbox[i].style.position = 'absolute';
				allbox[i].style.top = minHeight + 'px';
				allbox[i].style.left =  allbox[minIndex].offsetLeft + 'px';
				// 更新数组最小高度   最小高度的位置+新增加图片的高度
				heightArr[minIndex] += boxHeight;
			}
		};
		console.log(Math.max.apply(this, heightArr));
		$(parent).style.height = Math.max.apply(this, heightArr) + 'px';
		
	},330);
}
function getMInboxIndex(minVal, arr){
	for(var i in arr){
		if(minVal == arr[i]){
			return i;
		}
	}
}
function checkLoad(){
	var allbox = $('wrap-box').getElementsByClassName('box');
	var lastbox = allbox[allbox.length - 1];
	
	var ifHeight = lastbox.offsetHeight * 0.5 + lastbox.offsetTop;
	console.log('最后一个盒子距离顶部的距离'+ifHeight);
	var screenHeight = document.documentElement.clientHeight;
	console.log('浏览器高度'+screenHeight);
	var scrollTop = document.documentElement.scrollTop;
	console.log('滚动高度'+scrollTop);
	console.log('和'+ parseInt(screenHeight + scrollTop));
	return ifHeight <= screenHeight + scrollTop;
}
