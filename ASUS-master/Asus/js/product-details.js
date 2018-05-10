$(function(){
	//alert($("#center").find("li").eq(2).width());
	var _left = 0;
	$("#right").click(function(){
		_left = _left - 50;
		$("#center").css("left", _left + "px");
		if(_left <= -($("#center").width() - $(".small-img").width())){
			$("#center").css("left", -($("#center").width() - $(".small-img").width() + 17));
			_left = -137 ;
		}else{
			$("#center").css("left", _left + "px");
		}
	})
	$("#left").click(function(){
		_left = _left + 50;
		if(_left >= 0){
			$("#center").css("left", "0");
			_left = 0;
		}else{
			$("#center").css("left", _left + "px");
		}
	})
	/****************************点击小图切换图片***************************/
	var _index = null;
	$("#center").find("li").click(function(){
		_index = $(this).index();
		//alert($(this).index());
		$(this).siblings("li").css("border", "none");
		$(this).css("border", "2px solid orange");
		var oImg = $('<img src="'+$(this).find("img").attr("src")+'" />')
		//$(".store-des-Limg").html("");
		$(".store-des-Limg").html(oImg);
	})
	
	/**************************放大镜**************************************/
	$(".store-des-Limg").hover(function(){
		var oB = $('<b></b>');
		//alert($(this).offset().top);
		oB.css({width: "100px", height: "100px", background: "red",position: "absolute", display: "block", "z-index": "6", opacity: "0.3", fliter: "alpha(opacity = 30)"});
		oB.appendTo($(".store-des-Limg"));
	},function(){
		$(".store-des-Limg").find("b").detach();
	})
	$(".store-des-Limg").mousemove(function(ev){
		//alert($(this).offset().top)
		var _left = ev.pageX -$(this).offset().left - 50;
		var _top = ev.pageY - $(this).offset().top - 50;
		//alert($(".store-des-Limg").find("b").css("top"));
		/********************让小镜片不超出边框*******************************/
			_left = _left < 0 ? 0 : _left;
			_left = _left > 300 ? 300 : _left;
			_top = _top < 0 ? 0 : _top;
			_top = _top > 300 ? 300 : _top;
			$(".store-des-Limg b").css({ top: _top,left: _left});
			$(".big-img").show();
			$(".big-img img").eq(_index).siblings().hide();
			$(".big-img img").eq(_index).show();
			$(".big-img img").eq(_index).css({left:- _left * 0.66, top: -_top * 0.66})
	})
	$(".store-des-Limg").mouseout(function(){
		$(".big-img").hide();
	})
	/**************************点击种类出现效果*******************************/
	var isYes = true;
	$("#store-des .select button").click(function(){
		if(isYes){
			$(this).attr("class", "btn");
			$(this).siblings().removeAttr("class", "btn");
			isYes = false;
		}else{
			$(this).removeAttr("class");
			isYes = true;
		}
	})
	//设置全局变量 后页面加载完成后会用到
	var id = null;
	var first = null;
	var same = false;
	
	/**********************点击出现购物车的内容***********************************/
	$("#store-des .car").click(function(){
		/************判断是否存在勾选的商品种类**************/
		if($("#store-des .select .btn").attr("class") == "btn"){
			$("#store-des .addCar").fadeIn(500).show();
			$("#store-des .addCount1").html($("#store-des .addCount").html());
			var sum = parseInt($("#store-des .salPrice").html()) * parseInt($("#store-des .addCount").html());
			$("#store-des .price").html(sum);
			/************************点击加入购物车之后导航栏的购物车会增加数量*******************************/
			id = $("#store-des .select .btn").attr("id");
			first = $.cookie("goods") == null ? true : false;
			same = false;
			var total = null;
			//判断点击的时候cookie是否存在  不存在则创建节点在div中
			if(first){
				$.cookie("goods", '[{"id":'+id+',"num":'+parseInt($(".select .addCount").html())+'}]', {expires: 7});
				$('<dl id='+id+'><dt>'+$(".store-des-Limg").html()+'</dt><dd><p>'+$('.store-des h3').html()+'</p><p>销售价：￥<span class="sigPrice">'+$("#store-des  b span").html()+'</span></p><p class="acount">数量：'+parseInt($("#store-des .addCount").html())+'</p></dd><button>移除</button></dl>').appendTo($(".shopcar"));
				$("<div class='last'></div>").css({width: "235px",height: "30px",background: 'yellow'}).appendTo($(".shopcar"));
				//alert($.cookie("goods"));
				var str = $.cookie("goods");
				var arr  = JSON.parse(str);
				//alert(arr.id);
				$("<div class='jiesuan'>结算</div>").css({width: "88px", height: "30px", background: 'orange', "line-height": "30px", float:'right', "font-size": "14px", color: "white", "text-align": "center"}).appendTo($(".last"));
				$("<div>合计：<span class='heji'></span></div>").css({width: "100px", height: "30px", background: 'green', "line-height": "30px", float:'left',"margin-left": "20px", "font-size": "12px"}).appendTo($(".last"));
				for(let i in arr){
					//alert(arr[i].id);
					var a = parseInt($(".shopcar").find("#"+arr[i].id).find(".sigPrice").html());
					total += a * arr[i].num;
				}
				$(".shopcar .heji").html(total);
			}else{
				//存在时 取出cookie 判断cookie是否是点击的同一个
				var str = $.cookie("goods");
				var arr = JSON.parse(str);
				id = $("#store-des .select .btn").attr("id");
				for(var i in arr){
					if(arr[i].id == id){
						arr[i].num = arr[i].num + parseInt($(".select .addCount").html());
						var cookieStr = JSON.stringify(arr);
						$.cookie("goods", cookieStr);
						$("#"+id).find(".acount").html("数量："+arr[i].num);
						for(let i in arr){
							var a = parseInt($(".shopcar").find("#"+arr[i].id).find(".sigPrice").html());
							total += a * arr[i].num;
						}
						$(".shopcar .heji").html(total);
						same = true;
					}
				}
				//没有同一个id 就重新创建节点 和 添加cookie的值
				if(!same){
					//alert($.cookie("goods"));
					var obj = {
						id: id,
						num: parseInt($(".select .addCount").html())
					}
					arr.push(obj);
					var cookieStr = JSON.stringify(arr);
					//alert(cookieStr);
					$.cookie("goods", cookieStr); 
					$('<dl id='+obj.id+'><dt>'+$(".store-des-Limg").html()+'</dt><dd><p>'+$('.store-des h3').html()+'</p><p>销售价：<span class="sigPrice">'+$("#store-des  b span").html()+'</span></p><p class="acount">数量：'+obj.num+'</p></dd><button>移除</button></dl>').appendTo($(".shopcar"));
					//alert($.cookie("goods"));
					
					$(".last").remove();
					var str = $.cookie("goods");
					var arr  = JSON.parse(str);
					$("<div class='last'></div>").css({width: "235px",height: "30px",background: 'yellow'}).appendTo($(".shopcar"));
					$("<div class='jiesuan'>结算</div>").css({width: "88px", height: "30px", background: 'orange', "line-height": "30px", float:'right', "font-size": "14px", color: "white", "text-align": "center"}).appendTo($(".last"));
					$("<div>合计：<span class='heji'></span></div>").css({width: "100px", height: "30px", background: 'green', "line-height": "30px", float:'left',"margin-left": "20px", "font-size": "12px"}).appendTo($(".last"));
					for(let i in arr){
						var a = parseInt($(".shopcar").find("#"+arr[i].id).find(".sigPrice").html());
						total += a * arr[i].num;
					}
					$(".shopcar .heji").html(total);
				}
			}			
			//购物车中显示商品种类
			$(".bg-shopcar .sum").html($(".shopcar dl").size());
			//当点击移除时 删除节点并删除cookie值
			$(".shopcar button").on("click", clickMove);
			
			//没有选中商品时 弹出警告
		}else if($("#store-des .select button").attr("class")){
			alert("请输入商品种类");
		}
	})
	//点击除导航栏外的其他地方  购物车数量消失
	$("#store-des .close").click(function(){
		$("#store-des .addCar").fadeOut(500).hide();
		$(this).css({border: "none", "background": "none"})
		$(this).attr("class", "close");
	})
	//页面加载时 加载cookie
	if($.cookie("goods")){
		//alert($.cookie("goods"));
		getCookie();
		$(".bg-shopcar .sum").html($(".shopcar dl").size());
		$(".shopcar button").on("click", clickMove);
	}
	//获取cookie
	function getCookie(){
		var str = $.cookie("goods");
		var arr  = JSON.parse(str);
		var len = arr.lenght;
		var total = null;
		if(len != 0){
			for(var i in arr){
				$('<dl id='+arr[i].id+'><dt>'+$(".store-des-Limg").html()+'</dt><dd><p>'+$('.store-des h3').html()+'</p><p>销售价：￥<span class="sigPrice">'+$("#store-des  b span").html()+'<span></span></p><p class="acount">数量：'+arr[i].num+'</p></dd><button>移除</button></dl>').appendTo($(".shopcar"));
			}
			$("<div class='last'></div>").css({width: "235px",height: "30px",background: 'yellow'}).appendTo($(".shopcar"));
			$("<div>结算</div>").css({width: "88px", height: "30px", background: 'orange', "line-height": "30px", float:'right', "font-size": "14px", color: "white", "text-align": "center"}).appendTo($(".last"));
			$("<div>合计：<span class='heji'></span></div>").css({width: "100px", height: "30px", background: 'green', "line-height": "30px", float:'left',"margin-left": "20px", "font-size": "12px"}).appendTo($(".last"));
			for(let i in arr){
				var a = parseInt($(".shopcar").find("#"+arr[i].id).find(".sigPrice").html());
				total += a * arr[i].num;
			}
			$(".shopcar .heji").html(total);
		}else{
			$(".shopcar").html("");
		}
	}
	//点击时删除cookie和div
	function clickMove(){
		var str = $.cookie("goods");
		var arr = JSON.parse(str);
		var id = $(this).parent().attr('id');
		var total = 0;
		for(let i in arr){
			if(arr[i].id == id){
				arr.splice(i, 1);
				//alert(newArr[0].id);
			}
			var cookieStr = JSON.stringify(arr);
			$.cookie("goods", cookieStr, {expires: 7}); 
		}
		for(let i in arr){
			var a = parseInt($(".shopcar").find("#"+arr[i].id).find(".sigPrice").html());
			total += a * arr[i].num;
		}
		$(".shopcar .heji").html(total);
		$(this).parent().remove();
		$(".bg-shopcar .sum").html($(".shopcar dl").size());
		
		if($(".shopcar dl").size() == 1){
			$(this).parent().remove();
			$(".shopcar .heji").html(total);
		}
		if($(".shopcar dl").size() == 0){
			$(".last").remove();
			$.cookie("goods", null); 
			$(".shopcar").html("");
		}
	}
	
	
	
	/**********************件数加减***********************************/
	$("#store-des .select .count").find("b").hover(function(){
		$(this).css("background", "#857d7d");
	}, function(){
		$(this).css("background", "none");
	})
	var i = $("#store-des .select .count").find("span").html();
	$("#store-des .select .count").find(".add").click(function(){
		i++;
		$("#store-des .select .count").find("span").html(i)
	})
	$("#store-des .select .count").find(".sub").click(function(){
		
		if(i == 1){
			$("#store-des .select .count").find("span").html(1)
		}else{
			i--;
			$("#store-des .select .count").find("span").html(i)
		}
		
	})
})
window.onscroll = function(){
	var oRight = document.getElementById("floating");
	var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
	var len = parseInt((document.documentElement.clientHeight - oRight.offsetHeight) / 2 + scrollTop);
	startMove(oRight, {top: len-100})
}