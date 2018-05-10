$(function(){
	/***********************华硕商城轮播图*???????????????????******************************/
	$.ajax({
		url: "../js/carousel.json",
		type: "GET",
		success: function(data){
			$("<ul></ul>").appendTo($("#banner").find(".center"));
			var html = "";
			for(var i in data){
				html += '<li><a href="#"><img src="'+data[i].url+'" /></a></li>';
				$("#banner").find(".center").find("ul").html(html);
			}
			/************轮播图********************/
			var oUl = $(".center").find('ul');
			var oLi = oUl.find('li');
			var len = oLi.size() * oLi.width();
			var oLi_num = $(".num").find("li");
			oUl.width($(".center").width()*oLi.size());
			var iNow = 0;
			var timer = null;
		/***********鼠标移入123456移除*****************/
			oLi_num.hover(function(){
				iNow = $(this).index();
				tab();
			}, function(){
				$(this).attr("class", "");
			})
			
			timer = setInterval(timerInner, 3000);
			
			$(".center").hover(function(){
				clearInterval(timer);
			},function(){
				timer = setInterval(timerInner, 3000);
			})
			
			
			function timerInner(){
				iNow++;
				tab();
			}	
			
			function tab(){
				oLi_num.attr("class","");
				oLi_num.eq(iNow).attr("class","active");
				
				if(iNow == oLi_num.size()){
					oLi_num.eq(0).attr("class","active");
				}
				oUl.animate({left: -$(".center").width() * iNow}, function(){
					if(iNow == oLi.size() - 1){
						iNow = 0;
						oUl.css("left", "0");
					}
				});
			}
			
		}
		
	});
/*********************购物车效果***********************/
	$("#nav").find("div").hover(function(){
		$("#nav").find(".bg-shopcar").css({"background": "url(../img/nav_shopping.png) no-repeat 45px center orange"});
		$("#nav").find(".shopcar").fadeIn(400).show();
	}, function(){
		$("#logo").add("#wrap-box").click(function(){
			$("#nav").find(".bg-shopcar").css("background", "url(../img/nav_shopping.png) no-repeat 45px center");
			$("#nav").find(".shopcar").fadeOut(400).hide();
		})
	})
/*******************右侧固定菜单缓冲运动*******************/
	window.onscroll();
		$(".online").mouseenter(function(){
		$(".show").css("display", "block");
	})
		$(".online").mouseleave(function(){
		$(".show").css("display", "none")
	})
/************左侧列表******************/
	$.ajax({
		url:"../js/storeNav.json",
		type:"GET",
		success:function(res){
			var html = "";
			for(var i = 0;i < res.length; i++){
				html += '<li><a href="#">'+res[i].title+'</a><div class="move"></div></li>';
				$("#banner").find(".left").find("ul").html(html);
			}
			var oDiv = $("#banner").find(".left").find("ul").find("div");
			$.ajax({
				url: "../js/storeNav.json",
				type: "GET",
				success: function(data){
					//最外层json循环
					for(let i = 0;i < data.length;i++){
						//childtitle循环
						if(data[i].childtitle){
							for(let j = 0;j < data[i].childtitle.length;j++){
								var oA = $('<a href="#" class="childtitle">'+data[i].childtitle[j].title+'</a>');
								oA.appendTo(oDiv.eq(i));
							}
						}
						
					}
					$.ajax({
						url: "../js/storeNav.json",
						type: "GET",
						success: function(data){
							for(let i = 0;i < data.length;i++){
								if(data[i].childtitle){
									for(var j = 0;j < data[i].childtitle.length;j++){
										if(data[i].childtitle[j].link){
											for(var k = 0; k < data[i].childtitle[j].link.length;k++){
												var creA = $('<a href="#" class="childlink"></a>');
												creA.html(data[i].childtitle[j].link[k]);
												creA.appendTo(oDiv.eq(i).find(".childtitle").eq(j));
											}
										}else{
											continue;
										}
										
									}
								}
								
							}
							
						}
					})
				}
			})
			/********************轮播图左侧商品列表*************************/
			$("#banner").find(".left").find("li").mouseenter(function(){
				$(this).find("a").css({width: "140px", border: "2px solid orange", "border-right": "none", background: "white url(../img/store_left_jian.png) no-repeat 140px center"});
				/*****************最后一个li不需要样式************************/
				if($(this).index() == 7){
					$(this).find(".move").css({display: "none", border: "none"});
					$(this).find("a").css({width: "138px", border: "none", background: "url(../img/store_left_jian.png) no-repeat 140px center #f9f9f9"});
				}else{
					$(this).find("div").css("display", "block");
				}
				
				
				$(this).find("div").find('a').css({width: "636px", "border": "none", background: "none", color: "black","border-bottom": "1px dashed #E4E4E4"});
				$(this).find("div").find('.childlink').css({display: "inline-block", color: "blue",width: "auto",padding: "10px", "text-align": ""});	
			});
			/*$(this).find("div").css("display", "block");*/
			$("#banner").find(".left").find("li").mouseleave(function(){
				$(this).find("a").css({width: "138px", border: "none", background: "url(../img/store_left_jian.png) no-repeat 140px center #f9f9f9"});
				$(this).find("div").css("display", "none");
			});
			
		}
	})

/********************商品列表获取后台数据******************************/
	$.ajax({
		url: "../js/storeList.json",
		type: "GET",
		success: function(data){
			for(var i = 0;i < data.length;i++){
				var num = i+1;
				var html = "";
				/************加载商品图片******************/
				for(let j = 0; j < data[i].left.length; j++){
					html+='<li><a href="#"><img src="'+data[i].left[j].url+'"/></a></li>';
					$("#"+ num +"F").find(".store-list-left").html(html);
				}
				/************加载商品介绍******************/
				html = "";
				for(let j = 0;j < data[i].center.length;j++){
					html += '<dl><dt><a href="#"><img src="'+data[i].center[j].url+'"/></a></dt><dd><a href="#">'+data[i].center[i].des+'</a></dd><dd>销售价：<b>'+data[i].center[j].price+'</b></dd></dl>';
					$("#"+ num +"F").find(".store-list-center").html(html);
				}
				/************加载商品价钱******************/
				html = "<h3>热门产品</h3>";
				for(let j = 0;j < data[i].right.length;j++){
					html += '<dl><dt><a href="#"><img src="'+data[i].right[j].url+'"/></a></dt><dd><a href="#">'+data[i].right[i].des+'</a></dd><dd><b>'+data[i].right[j].price+'</b></dd></dl>';
					$("#"+ num +"F").find(".store-list-right").html(html);
				}
			}
			$("#store").find("dl").hover(function(){
				$(this).css({"box-shadow": "3px 3px 5px #e4e4e4",}).animate({top: "-5px"});
			},function(){
				$(this).css({"box-shadow": "none",}).animate({top: "0px"});
			})
			$("#store").find("a").hover(function(){
				$(this).css("color", "#6495ED");
			},function(){
				$(this).css("color", "#666");
			})
			
			
		}
	})

})
window.onscroll = function(){
	var oRight = document.getElementById("floating");
	var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
	var len = parseInt((document.documentElement.clientHeight - oRight.offsetHeight) / 2 + scrollTop);
	startMove(oRight, {top: len-100})
}
$().extend({
	animate: function(json, fn){
		for(var i = 0; i < this.element.length; i++){
			startMove(this.element, json, fn);
		}
	}
})