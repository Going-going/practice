/*****************************导航栏点击效果*****************************/
$("#nav .nav li").click(function(){
	//alert($(this).offset().left - $("#nav .nav").offset().left);
	$('.border0').css({width: $(this).find("a").width(),border: "2px solid black"});
	$("#nav .border0").stop().animate({left: $(this).find("a").offset().left - $("#nav .nav").offset().left + 30})
	$(this).find(".nav_store").css({"display":"block"});
	$("#nav .nav li").siblings().mouseenter(function(){
		$('.border0').css({display: "block", width: $(this).find("a").width()});
		$("#nav .border0").stop().animate({left: $(this).find("a").offset().left - $("#nav .nav").offset().left + 30})
		$(this).find(".nav_store").fadeIn(600);
	})
	
	$("#nav .nav li").mouseleave(function(){
		$(this).find(".nav_store").fadeOut(600);
		$('.border0').css({display: "none"});
	})
})
$("#nav").mouseleave(function(){
	$("#nav .nav li").off("mouseenter");
})

/****************************轮播图**********************************/

$("#banner ul").width($("#banner ul li").eq(0).find("img").width() * ($("#banner ul li").size() + 2));
var iNow = 0;
timer = setInterval(timerInner,3000)

$("#banner ul").hover(function(){
	clearInterval(timer);
}, function(){
	timer = setInterval(timerInner,3000)
})

$("#banner .dian a").hover(function(){
	iNow = $(this).index();
	tab();
})
function timerInner(){
	iNow++;
	tab();
}
function tab(){
	$(".dian a").attr("class", "");
	$(".dian a").eq(iNow).attr("class", "active");
	if(iNow == $("#banner ul li").size() - 1){
		$(".dian a").eq(0).attr("class", "active");
	}
	if(iNow == $("#banner ul li").size()){
		iNow = 1;
		$("#banner ul").css("left", "0");
		$(".dian a").eq(iNow).attr("class", "active");
	}
	$("#banner ul").animate({left: -$("#banner ul li").eq(0).find("img").width() * iNow});
}

/****************************底部标志鼠标移入放大效果************************************/
$("#brand").hover(function() {
	$(this).css({width: "100px",height: "40px",	top: "-10px",left: "50%"})
}, function() {
	$(this).css({width: "64px",height: "23px",top: "0",left: "50%"})
})