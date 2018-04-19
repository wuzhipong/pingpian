/*
 *页面加载时先执行的操作
 */
window.onload = function(){
	document.getElementById("LRnavigation").style.width = document.body.offsetWidth*0.93 + "px";
	var swiperContent = document.getElementById("swiperImg");
	var swiperImg = swiperContent.getElementsByTagName('img');
	window.imgName = ""; //图片的名称
	//页面刚开始加载时请求数据库中的Img
	$.ajax({
		url: '/getImg/',
		type: 'POST',
		dataType: 'JSON',
		data: {"num": 1},
	})
	.done(function(data) {	
		var imgOne = data[0].src;
		for(var i=0;i<swiperImg.length;i++){
			swiperImg[i].src = data[i].src;
			swiperImg[i].id = data[i].id;
		}
		var urlImg = "C:/pingpian/ppsystem" + imgOne;
		var imgId = data[0].id;
		window.imgName = imgOne.substring(imgOne.lastIndexOf("/")+1,imgOne.length);
		$.ajax({
			type:"POST",
		    data:{"key": urlImg,"id":imgId},
		    url:"/split/",
		    dateType:"json",
		})
		.done(function(data) {
			$("#textrRecognition").val(data);
		    document.getElementById("mainSwiper").style.visibility = "visible";
		    document.getElementById("loadding").style.display = "none";
		})
		.fail(function() {
			alert("数据读取失败,显示默认图片");	
		})
		.always(function() {
			document.getElementById("mainSwiper").style.visibility = "visible";
		    document.getElementById("loadding").style.display = "none";
		});
		
	})
	.fail(function() {
		console.log("error");
	})
	.always(function() {
		console.log("complete");
	});	

	$(window).resize(function() {
	  //alert("请不要随意改变浏览器大小，这可能会带来问题");
	});
}