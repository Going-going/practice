$(function(){
	//注册界面验证
	//alert($("input[type='tel']").val());
	$("input[type='tel']").blur(function(){
		var tel = $("input[type='tel']").val();
		if(!(tel.length == 11)){
			$("input[type='tel']").next().html("手机号长度为11位");
		}
		if(isTel(tel)){
			$("input[type='tel']").next().html("√");
		};
		function isTel(str){
			var reg = /^[1][0-9]{10}/;
			return reg.test(str);
		}
	})
	$("input[name='password']").blur(function(){
		var regNum = /^[0-9]{6,18}$/;
		var regNumLetter = /[0-9A-Za-z]{6,18}$/;
		var reg = /^[0-9A-Za-z][0-9A-Za-z$%@#!&*^?]{5,17}$/;
		var pwd = $("input[name='password']").val();
		if(pwd.length > 18 || pwd.length < 6){
			$("input[name='password']").next().html("密码长度位6-18位");
		}else{
			if(regNum.test(pwd)){
				$("input[name='password']").next().html("弱");
			}else if(regNumLetter.test(pwd)){
				$("input[name='password']").next().html("中");
			}else if(reg.test(pwd)){
				$("input[name='password']").next().html("强");
			}
		}

	})
	$("input[name='again']").blur(function(){
		var againPwd = $("input[name='again']").val();
		var pwd = $("input[name='password']").val();
		if(againPwd == pwd){
			$("input[name='again']").next().html("√");
		}else{
			$("input[name='again']").next().html("两次密码输入不一致");
		}
	})
	
	
	/*************************验证码******************************************/
	$("button[class='confirm']").html(getCodes());
	$("button[class='confirm']").click(function(){
		$("button[class='confirm']").html(getCodes());
	})
	
	function getCodes(){
		var code = [];
		for(let i = 48;i < 57;i++){
			code.push(i);
		}
		for(let i = 60;i < 90;i++){
			code.push(i);
		}
		for(let i = 97;i < 122;i++){
			code.push(i);
		}
		function getCode(){
			var arr = [];
			for(let i = 0;i < 4;i++){
				var index = Math.floor(Math.random() * 61);
				var char = String.fromCharCode(code[index]);
				arr.push(char);
			}
			return arr.join("");
		}
		var codes = getCode();
		return codes;
	}
	$("input[name=confirm]").blur(function(){
		if($("input[name=confirm]").val() == $("button[class='confirm']").html()){
			$("button[class='confirm']").next().html("√");
		}else{
			$("button[class='confirm']").next().html("验证码不正确");
		}
	})
})
