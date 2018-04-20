/*
 *整个模块二的控制逻辑	
 */
$.pageRuler(index);	
var swiperImg = document.getElementById("swiperImg");
var oImgs = swiperImg.getElementsByTagName("img");//获取top中的所有图片对象
var oDiv = swiperImg.getElementsByTagName("div");
var MTparent = document.getElementsByClassName("MTcontent")[0];
var MTcontent = document.getElementById("MTcontent");//获取需要操作的图片 模块三中的图片  canvas
var mygod = document.getElementById("mygod");
var tempMyGod = mygod.src;
var index = 1;//记录图片放大的倍数
var drag = document.getElementById("drag");//色阶处理
var addSpan = document.getElementById("addSpan"); //添加没缺陷信息
var lay = document.getElementById('lay');  //放大效果选中框
var imgColorProcess = document.getElementById("imgColorProcess");
var smallImg = document.getElementById('smallImgWarp'); //绑定lay移动事件
var bigImg = document.getElementById('bigImg');  //再放大区域显示放大后的图片
var imgB = bigImg.children[0];
var closeColorDeal = document.getElementsByClassName('closeColorDeal')[0];
var assessOne = document.getElementById("assess"); //评定框
var assessTwo = document.getElementById("assessTwo");
var painter = new Painter("MTcontent");
var LRnavigation = document.getElementById('LRnavigation');
var painterDeal = document.getElementById("painterDeal");//绘制图形的清除与移动按钮
var menuButton = document.querySelector('.menu-button'); //menu按钮
var showImg = document.getElementById('imgProcessShow');
var requestUrl = 1;//请求图片路径
var ajax;		  
var imgId = 1; //图片的id
//模块中的按钮事件
var aUl = document.getElementById('deal');
var oLi = aUl.getElementsByTagName('li');
//给每一个li添加属性值flag
for(var i=0;i<oLi.length;i++){
	oLi[i].flag = true;
}
//移动绘制的图形
var dealpainterBtn = oLi[14].getElementsByTagName("button");

oDiv[0].style.background = "#eee";
var imgOnload = new Image();
imgOnload.src = mygod.src;
// 判断是否有缓存
if(imgOnload.complete){
	MTcontent.height = (mygod.width/imgOnload.width)*imgOnload.height;
}else{	
	// 加载完成执行
	imgOnload.onload = function(){
		MTcontent.height = (mygod.width/imgOnload.width)*imgOnload.height;
	};
}
//按钮提示弹出框
$(function () {
  $('[data-toggle="popover"]').popover().on( 'mouseenter', function(){    
      var _this = this;    
      $(this).popover( 'show' );    
      $(this).siblings( '.popover' ).on( 'mouseleave' , function () {    
          $(_this).popover( 'hide' );    
      });    
  }).on( 'mouseleave', function(){    
      var _this = this;    
      setTimeout(function () {    
          if (!$( '.popover:hover' ).length) {    
              $(_this).popover( 'hide' )    
          }  
      }, 100);    
  });  
})

//设置默认的selectColor
$('.my-color-picker').colorpicker({
	expandEvent: 'mouseenter',
	collapseEvent: 'mouseleave mousewheel'
});

var swiper = new Swiper('#mainSwiper', {
   slidesPerView: 'auto',
   initialSlide: 1,
   slideToClickedSlide: true,
   initialSlide: 1,
   resistanceRatio: 0,
   on: {
    init: function () {
      var slider = this;
      menuButton.addEventListener('click', function () {
        if (slider.activeIndex === 0) {
          slider.slideNext();
        } else {
          slider.slidePrev();
        }
      }, true);
    },
    slideChange: function () {
      var slider = this;
      if (slider.activeIndex === 0) {
        menuButton.classList.add('cross');
      } else {
        menuButton.classList.remove('cross');
      }
    },
  }
});

LRnavigation.onmouseover = function(){
	$("#Noswiping").addClass("swiper-no-swiping");
}

LRnavigation.onmouseout = function(){
	$("#Noswiping").removeClass("swiper-no-swiping");
}

//左侧滑动图区事件
var swiper2 = new Swiper('#swiperSlide', {
    direction: 'vertical',
    speed:800,			//鼠标滑动速度
	autoplayDisableOnInteraction : false,
	loop:false,   		//是否循环
	centeredSlides : true,
	slidesPerView: 6,	//top中允许显示的图片数量
	slideToClickedSlide:true,
	navigation: {
		nextEl: '.swiper-button-next',
		prevEl: '.swiper-button-prev',
	},	
	on: {
		slideChangeTransitionStart: function(){
			$("#textrRecognition").css("display","none");
			$("#loaddingText").css("display","block");
			//清空操作
			recover();
			var inputs = tableNews.getElementsByTagName('input');
			for(var i=1;i<inputs.length;i++){
				inputs[i].value = "";
			}
			imgId = oImgs[this.activeIndex].id
			mygod.src = oImgs[this.activeIndex].src;
			imgB.src = oImgs[this.activeIndex].src;
			tempMyGod = mygod.src;
			window.imgName = pathImgName(tempMyGod)
			MTcontent.height = mygod.height;
			for(var i=0;i<oDiv.length;i++){
				oDiv[i].style.background = "rgba(100,100,100,0.3)";
			}
			oDiv[this.activeIndex].style.background = "#eee";
			//清空放大事件
			oLi[7].flag = true;
			oLi[7].style.background = "rgba(100,100,100,0.75)";
			smallImg.onmouseover = null;
			smallImg.onmousemove = null;
			smallImg.onmouseout = null; 
			$('canvas').removeLayers();
			//如果是最后一张进行加载图片
			if(this.activeIndex == (swiperImg.getElementsByTagName("img").length-1)){
				requestUrl++;
				$.ajax({
					url: '/getImg/',
					type: 'POST',
					dateType:"json",
					data: {"num": requestUrl},
				})
				.done(function(data) {
					//document.getElementsByClassName("loadding")[0].style.display = "block";
					var xqo = eval('(' + data + ')');
					var addImg = "";
					for(var i in xqo){
						addImg += '<div class="swiper-slide"><a href="#"><img id="'+xqo[i].id+'" src="'+xqo[i].src+'"></a></div>';
					}
					swiper2.appendSlide([						
						addImg,
					]);
				})
				.fail(function() {
					console.log("error");
				})
				.always(function() {
					//document.getElementsByClassName("loadding")[0].style.display = "none";
				});
			}
		},
		slideChangeTransitionEnd: function(){
			mygod.src = oImgs[this.activeIndex].src;
			imgB.src = oImgs[this.activeIndex].src;
			var relative = mygod.src.substring(mygod.src.indexOf("/static"));
			var imgsrc = "C:/pingpian/ppsystem" + relative;
			var id = oImgs[this.activeIndex].id;

			//终止正在执行ajax请求
			if(ajax != null){
				ajax.abort();
			}
			ajax = $.ajax({
		        type:"POST",
		        data:{"key":imgsrc,"id":id},
		        url:"/split/",
		        dateType:"json",
		        success:function (data) {
		        	var datajson = JSON.parse(data)
					$("#textrRecognition").val(datajson[0].message);
					if(datajson[0].img != "null"){
						console.log(datajson[0].img)
						showImg.innerHTML = '<img src="'+datajson[0].img+'" />';
					}else{
						showImg.innerHTML = '';
					}	
		            $("#loaddingText").css("display","none");
		            $("#textrRecognition").css("display","block");
		        },
		        error:function (errorMsg) {
		            console.log(errorMsg);
		        }
		    });
		    
		},
	}
});
//或获取图片的名称
function pathImgName(path){
	var filename;
	if(path.indexOf("/")>0)//如果包含有"/"号 从最后一个"/"号+1的位置开始截取字符串
	{
	    filename=path.substring(path.lastIndexOf("/")+1,path.length);
	}
	else
	{
	    filename=path;
	}
	return filename;
}


//图片的拖拽移动
oLi[0].onclick = function(event){
	selectAreaCanvas.style.zIndex = -1;
	recoverColorProcessing(event);
	//清空放大事件
	oLi[7].flag = false;
	enlarge(oLi[7]);
	//清空矩形绘制
	oLi[5].flag = false;
	drawRectangle(oLi[5]);
	//清空椭圆绘制
	oLi[6].flag = false;
	drawEllipse(oLi[6]);
	//清空标尺
	//oLi[8].style.background = "rgba(100,100,100,0.75)";
	//hideRuler();
	changeMove(this.flag);
}
//图片的放大与缩小
oLi[1].onclick = function(event){
	selectAreaCanvas.style.zIndex = -1;
	oLi[5].flag = false;
	drawRectangle(oLi[5]);
	//清空放大事件
	oLi[7].flag = false;
	enlarge(oLi[7]);
	
	oLi[6].flag = false;
	drawEllipse(oLi[6]);
	
	var flag = true;
	painter.isDraw(false);	
	//oLi[8].style.background = "rgba(100,100,100,0.75)";
	//hideRuler();
	
	zoom(this,flag,event);
}	

//图片的还原
oLi[3].onclick = function(event){
	recoverColorProcessing(event);
	recover();
}

//颜色选取
oLi[4].onclick = function(event){
	recoverColorProcessing(event);
	oLi[8].style.background = "rgba(100,100,100,0.75)";
	//hideRuler();
	//清空放大事件
	oLi[7].flag = false;
	enlarge(oLi[7]);
	//清空评定框和综合评定框
	oLi[11].flag = false;
	assess(event,index,oLi[11]);
	oLi[12].flag = false;
	comprehensiveAssess(event,index,oLi[12]);
	
	colorSelect(this);
	$('.maximize-wrapper').mouseleave(function(){
		painter.setLineColor(document.getElementsByClassName('display')[0].style.backgroundColor.colorHex());
	})
}

//矩形绘制
oLi[5].onclick = function(event){
	selectAreaCanvas.style.zIndex = -1;
	recoverColorProcessing(event);
	oLi[6].flag = false;
	changeMove(false);
	//清空放大事件
	oLi[7].flag = false;
	enlarge(oLi[7]);
	
	oLi[8].style.background = "rgba(100,100,100,0.75)";
	//hideRuler();
	//清空评定框和综合评定框
	oLi[11].flag = false;
	assess(event,index,oLi[11]);
	oLi[12].flag = false;
	comprehensiveAssess(event,index,oLi[12]);
	
	drawEllipse(oLi[6]);
	drawRectangle(this);
}

//椭圆绘制
oLi[6].onclick = function(event){
	selectAreaCanvas.style.zIndex = -1;
	recoverColorProcessing(event);
	oLi[5].flag = false;
	changeMove(false);
	//清空放大事件
	oLi[7].flag = false;
	enlarge(oLi[7]);
	
	oLi[8].style.background = "rgba(100,100,100,0.75)";
	//hideRuler();
	//清空评定框和综合评定框
	oLi[11].flag = false;
	assess(event,index,oLi[11]);
	oLi[12].flag = false;
	comprehensiveAssess(event,index,oLi[12]);
	
	drawRectangle(oLi[5]);
	drawEllipse(this)
}

//放大效果
oLi[7].onclick = function(event){
	selectAreaCanvas.style.zIndex = -1;
	//清空评定框和综合评定框
	oLi[11].flag = false;
	assess(event,index,oLi[11]);
	oLi[12].flag = false;
	comprehensiveAssess(event,index,oLi[12]);
	
	recoverColorProcessing(event);
	oLi[8].style.background = "rgba(100,100,100,0.75)";
	//hideRuler();
	enlarge(this);
}
//标尺
var oLiBtn = oLi[8].getElementsByTagName('button');
//标尺测量
oLiBtn[0].onclick = function(event){
	selectAreaCanvas.style.zIndex = -1;
	recoverColorProcessing(event);
	//清空放大事件
	oLi[7].flag = false;
	enlarge(oLi[7]);
	//清空评定框和综合评定框
	oLi[11].flag = false;
	assess(event,index,oLi[11]);
	oLi[12].flag = false;
	comprehensiveAssess(event,index,oLi[12]);
	this.style.background = "antiquewhite";

	oLiBtn[1].style.background = "#fff";
	oLi[8].style.background = "#aaa";
	painter.isDraw(false);
	horizontaRuler();
}

//画线测量
oLiBtn[1].flag = true;
oLiBtn[1].onclick = function(event){
	selectAreaCanvas.style.zIndex = -1;
	recoverColorProcessing(event);		
	//清除矩形绘制
	oLi[5].flag = false;
	drawRectangle(oLi[5]);
	//清除椭圆绘制
	oLi[6].flag = false;
	drawEllipse(oLi[6]);
	
	//清空图片移动事件
	changeMove(false);
	
	//清空放大事件
	smallImg.onmouseover = null;
	smallImg.onmousemove = null;
	smallImg.onmouseout = null;
	oLi[7].style.background = "rgba(100,100,100,0.75)";

	//隐藏标尺
	oLi[8].style.background = "rgba(100,100,100,0.75)";
	//hideRuler();
	
	oLi[9].style.background = "rgba(100,100,100,0.75)";
	
	//清空评定框和综合评定框
	oLi[11].flag = false;
	assess(event,index,oLi[11]);
	oLi[12].flag = false;
	comprehensiveAssess(event,index,oLi[12]);

	oLiBtn[0].style.background = "#fff";
	this.style.background = "antiquewhite";

	drawLine(this);
}
//隐藏标尺
oLiBtn[2].onclick = function(){
	hideRuler();
}
//色阶处理
oLi[9].onclick = function(event){
	selectAreaCanvas.style.zIndex = 1001;
	loadImage(mygod.src);
	//清除放大事件
	oLi[1].flag = false;
	zoom(oLi[1],false,event);
	//清空图片移动事件
	changeMove(false);
	
	//清空放大事件
	oLi[7].flag = false;
	enlarge(oLi[7]);
	
	//清除矩形绘制
	oLi[5].flag = false;
	drawRectangle(oLi[5]);
	//清除椭圆绘制
	oLi[6].flag = false;
	drawEllipse(oLi[6]);
	//清空标尺
	oLi[8].style.background = "rgba(100,100,100,0.75)";
	if(this.flag){
		this.flag = false;
		this.style.background = "#aaa";
		//drag.style.display = "block";
	}else{
		this.flag = true;
		this.style.background = "rgba(100,100,100,0.75)";
		//drag.style.display = "none";	
	}
	//隐藏标尺
	//hideRuler();
}
closeColorDeal.onclick = function(){
	oLi[9].flag = true;
	oLi[9].style.background = "rgba(100,100,100,0.75)";
	//drag.style.display = "none";
}

//评定框
oLi[11].onclick = function(event){
	selectAreaCanvas.style.zIndex = -1;
	//清空放大事件
	oLi[7].flag = false;
	enlarge(oLi[7]);

	assess(event,index,this);
}
//综合评定框
oLi[12].onclick = function(event){
	selectAreaCanvas.style.zIndex = -1;
	//清空放大事件
	oLi[7].flag = false;
	enlarge(oLi[7]);

	comprehensiveAssess(event,index,this);
}

oLi[13].onmouseover = function(){
	this.style.background = "rgba(100,100,100,0.75)";
}


dealpainterBtn[0].onclick = function(){
	painter.isDraw(true);
	painter.drawMove(true);
}
//清除绘制的图形
dealpainterBtn[1].onclick = function(){
	painter.isDraw(true);
	painter.eraser(true);
}
//图片的拖拽移动
function changeMove(flag){
	if(flag){
		oLi[0].flag = false;
		painter.move(true);
		oLi[0].style.background = "#aaaaaa";
	}else{
		oLi[0].flag = true;
		painter.move(false );
		oLi[0].style.background = "rgba(100,100,100,0.75)"
	}
}
//图片的放大与缩小
function zoom(zoom,flag,event){
	if(zoom.flag){
		flag = true;
	}else{
		flag = false;
	}
	if(zoom.flag){
		//禁用页面的滚动条
		if(document.addEventListener){
			document.addEventListener('DOMMouseScroll',function(event){
				scrollFunc(flag,event);
			},false);
		}//W3C
		window.onmousewheel=document.onmousewheel=function(event){
			scrollFunc(flag,event);
		};//IE/Opera/Chrome/Safari
		zoom.flag = false;
		oLi[1].style.background = "#aaaaaa";
	}else{
		//禁用页面的滚动条
		if(document.addEventListener){
			document.addEventListener('DOMMouseScroll',function(event){
				scrollFunc(flag,event);
			},false);
		}//W3C
		window.onmousewheel=document.onmousewheel=function(event){
			//console.log(1);
			scrollFunc(flag,event);
		};//IE/Opera/Chrome/Safari
		zoom.flag = true;
		oLi[1].style.background = "rgba(100,100,100,0.75)";
	}
}

function scrollFunc(flag,event){
	event = event || window.event;  
	if(flag){ 
		if(event.wheelDelta){//IE/Opera/Chrome
			Transform(event.wheelDelta,event);
		}else if(event.detail){//Firefox
			Transform(-event.detail,event);
		}
		
		if(event.preventDefault){
			//Firefox
			event.preventDefault();
			event.stopPropagation();
		}else{
			//IE
			event.cancelBubble = true;
			event.returnValue = false;
		}
		
	}else{
		return;
	}
}
function Transform(tmp,event){
	if(tmp>0){
		//oLi[2].style.display = "none";
		oLi[1].getElementsByTagName('img')[0].src = "/static/image/icon/enlarge.ico";
		index = index+0.02;
		if(!oLi[11].flag){
			oLi[11].flag = true;
			assess(event,index,oLi[11]);
		}
		if(!oLi[12].flag){
			oLi[12].flag = true;
			comprehensiveAssess(event,index,oLi[12]);
		}
		if(index>2){
			index = 2;
		}
		MTcontent.style.WebkitTransform="scale("+(index)+","+(index)+")";
		mygod.style.WebkitTransform="scale("+(index)+","+(index)+")";
	}else{
		oLi[1].getElementsByTagName('img')[0].src = "/static/image/icon/narrow.ico";
		index = index-0.02;
		if(index<0.5){
			index = 0.5;
		}
		if(!oLi[11].flag){
			oLi[11].flag = true;
			assess(event,index,oLi[11]);
		}
		if(!oLi[12].flag){
			oLi[12].flag = true;
			comprehensiveAssess(event,index,oLi[12]);
		}
		MTcontent.style.WebkitTransform="scale("+(index)+","+(index)+")";
		mygod.style.WebkitTransform="scale("+(index)+","+(index)+")";
	}
	painter.scale(index);
	if($("#ScaleBox").length && $("#ScaleBox").css("display") === "block"){
		$.pageRulerScale(index);
	}
}

function recoverColorProcessing(event){
	oLi[9].style.background = "rgba(100,100,100,0.75)";
	oLi[9].flag = true;
	mygod.style.zIndex = "";
	//drag.style.display = "none";
	selectArea(event,false);
}

//图片的还原	
function recover(event){
	//恢复图片
	//$('#MTcontent').smartZoom('destroy');
	$('#MTcontent').attr('class','old');
	$('#MTcontent').removeAttr('style');
	$('#mygod').removeAttr('style');
	index = 1;
	//把index值传入，使绘制的图片位置恢复
	painter.scale(index);
	//清除图片的放大与缩小事件
	oLi[1].flag = false;
	zoom(oLi[1],false,event);
	//颜色选择
	oLi[4].flag = false;
	colorSelect(oLi[4]);
	//矩形绘制
	oLi[5].flag = false;
	drawRectangle(oLi[5]);
	//椭圆绘制
	oLi[6].flag = false;
	drawEllipse(oLi[6]);
	
	//清空图片移动事件
	changeMove(false);
	
	//清空放大事件
	smallImg.onmouseover = null;
	smallImg.onmousemove = null;
	smallImg.onmouseout = null;
	oLi[7].style.background = "rgba(100,100,100,0.75)";

	//清空色阶处理
	oLi[9].flag = true;
	oLi[9].style.background = "rgba(100,100,100,0.75)";
	//drag.style.display = "none";

	//隐藏标尺
	//oLi[8].style.background = "rgba(100,100,100,0.75)";
	//hideRuler();
	
	oLi[9].style.background = "rgba(100,100,100,0.75)";
	
	//清空评定框和综合评定框
	oLi[11].flag = false;
	assess(event,index,oLi[11]);
	oLi[12].flag = false;
	comprehensiveAssess(event,index,oLi[12]);
}

//颜色选取
function colorSelect(that){
	if(that.flag){
		that.flag = false;
		that.style.background = "#aaaaaa";
		var selectColor = document.getElementsByClassName('zeroconf')[0];
		selectColor.style.display = "block";
		oLi[12].onmouseover = function(){
			this.style.background = "rgba(100,100,100,0.75)";
		}
	}else{
		that.flag = true;
		that.style.background = "rgba(100,100,100,0.75)";
		var selectColor = document.getElementsByClassName('zeroconf')[0];
		selectColor.style.display = "none";
	}
	
}
//获取style属性
function getStyle(obj,attr){
	if(obj.currentStyle){
		return obj.currentStyle[attr];
	}else{
		return getComputedStyle(obj,false)[attr];
	}
}
//设置绘制的图形
function setDraw(draw){
	painter.isDraw(true);
	painter.setShape(draw);
	painter.setLineWidth(2);
	painter.setLineColor(document.getElementsByClassName('display')[0].style.backgroundColor); 
}


function drawRectangle(that){
	dealpainterBtn[0].disabled = "";
	if(that.flag){
		that.flag = false;
		that.style.background = "#aaaaaa";
		painterDeal.style.display = "block";
		setDraw("rectangle");
		//清除移动和清除操作
		painter.drawMove(false);
		painter.eraser(false);
	}else{
		that.style.background = "rgba(100,100,100,0.75)";
		painterDeal.style.display = "none";
		that.flag = true;
		painter.isDraw(false);
	}
}

function drawEllipse(that){
	dealpainterBtn[0].disabled = "";
	if(that.flag){
		that.flag = false;
		that.style.background = "#aaaaaa";
		painterDeal.style.display = "block";
		setDraw("ellipse");
		//清除移动和清除操作
		painter.drawMove(false);
		painter.eraser(false);
	}else{
		painter.isDraw(false);
		that.style.background = "rgba(100,100,100,0.75)";
		painterDeal.style.display = "none";
		that.flag = true;
	}
}
//图片的放大
function enlarge(that){
	if(that.flag){
		recover();
		that.flag = false;
		that.style.background = "#aaaaaa";
		var scale = 3;   //放大系数
		var w = parseFloat(MTcontent.width);
		var h = parseFloat(MTcontent.height);
		canvasRect = MTcontent.getBoundingClientRect();  //获取canvas元素相对于视窗的位置集合。
		canvasLeft = canvasRect.left;
		canvasTop = canvasRect.top; 

		lay.style.width = parseFloat((bigImg.offsetWidth/scale)) + 'px';
		lay.style.height = parseFloat((280/scale)) + 'px';

		imgB.style.width =  w*scale + 'px';
		imgB.style.height = h*scale + 'px';
		
		smallImg.style.height = h + "px";
		smallImg.onmouseover = function(){
			//imgColorProcess.style.display = "none";
			lay.style.display = "block";
		}
		smallImg.onmouseout = function(){
			//imgColorProcess.style.display = "none";
			lay.style.display = "none";
		}
		
		smallImg.onmousemove = function(event){
			e = event||window.event;
			var x = e.clientX - parseFloat(lay.style.width)/2 - canvasLeft;
			var y = e.clientY - parseFloat(lay.style.height)/2 - canvasTop;
			//console.log(e.clientX + "  " + e.clientY);
			if(x <= 0){            //左侧边界判断
				x = 0;
			}
			if(y <= 0){            //顶部边界判断
				y = 0;
			}
			if(x >= (smallImg.offsetWidth - lay.offsetWidth)){  //右侧边界判断
				x = smallImg.offsetWidth - lay.offsetWidth;
			}
			if(y >= (smallImg.offsetHeight - lay.offsetHeight)){
				y = smallImg.offsetHeight - lay.offsetHeight;
			}
			
			lay.style.left = x + 20 + "px";
			lay.style.top = y + 20 + "px";
			imgB.style.left = -x*scale + "px";    //图片默认位置为0 0左上角位置 需要反向才能两者相对显示
			imgB.style.top = -y*scale + "px";
		}
	}else{
		that.flag = true;
		that.style.background = "rgba(100,100,100,0.75)";
		smallImg.onmouseover = null;
		smallImg.onmousemove = null;
		smallImg.onmouseout = null;
	}
}
//横向标尺
function horizontaRuler(){
	if($("#ScaleBox").length==0){
		$.pageRuler(index);	
	}else{
		$.pageRulerShow(index);
	}
}

//纵向标尺
function verticalRuler(){
	if($("#ScaleBox").length==0){
		$.pageRuler();	
	}else{
		$.pageRulerShow(index);
	}
}
//画线测量
function drawLine(that){
	dealpainterBtn[0].disabled = "disabled";
	if(that.flag){
		//that.flag = false;
		oLi[8].style.background = "#aaa";
		painterDeal.style.display = "block";
		setDraw("line");
		//清除移动和清除操作
		painter.drawMove(false);
		painter.eraser(false);
	}else{
		oLi[8].style.background = "rgba(100,100,100,0.75)";
		painterDeal.style.display = "none";
		that.flag = true;
		painter.isDraw(false);
	}
}

//隐藏标尺并删除所有画出的线条
function hideRuler(){
	$.pageRulerHide(index);
	for(var i=$('.RefLine_h').length-1;i>=0;i--){
		$('.RefLine_h')[i].remove();
	}
	for(var i=$('.RefLine_v').length-1;i>=0;i--){
		$('.RefLine_v')[i].remove();
	}
}

//评定框
function assess(event,index,that){
	var e = event||window.event;
	if(that.flag){
		that.flag = false;
		that.style.background = "#aaa";
		assessOne.style.width = assessOne.style.height = 30*index +"px";
		assessOne.style.display = "block";
	
		assessOne.onmousedown = function(event){
			var e = event||window.event;
			assessLeft = assessOne.offsetLeft;
			assessTop = assessOne.offsetTop; 
			
			disX = e.clientX - assessLeft;
			disY = e.clientY - assessTop;
			document.onmousemove = function(event){
				var e = event||window.event;					
				assessOne.style.left = e.clientX - disX  + 'px';
				assessOne.style.top = e.clientY - disY +'px';
				if(assessOne.setCapture){
					assessOne.setCapture();
				}
			}
			
			document.onmouseup = function(){
				document.onmousemove = null;
				document.onmouseup = null;
				
				if(assessOne.releaseCapture){
					assessOne.releaseCapture();
				}
			}		
		}
	}else{
		that.style.background = "rgba(100,100,100,0.75)";
		that.flag = true;
		assessOne.style.display = "none";
	}
}

//综合评定框
function comprehensiveAssess(event,index,that){
	var e = event||window.event;
	if(that.flag){
		that.flag = false;
		that.style.background = "#aaa";
		assessTwo.style.height = 30*index +"px";
		assessTwo.style.width = 60*index + "px";
		
		assessTwo.style.display = "block";
	
		assessTwo.onmousedown = function(event){
			var e = event||window.event;
			assessLeft = assessTwo.offsetLeft;
			assessTop = assessTwo.offsetTop; 
			
			disX = e.clientX - assessLeft;
			disY = e.clientY - assessTop;
			document.onmousemove = function(event){
				var e = event||window.event;					
				assessTwo.style.left = e.clientX - disX  + 'px';
				assessTwo.style.top = e.clientY - disY +'px';
				if(assessTwo.setCapture){
					assessTwo.setCapture();
				}
			}
			
			document.onmouseup = function(){
				document.onmousemove = null;
				document.onmouseup = null;
				
				if(assessTwo.releaseCapture){
					assessTwo.releaseCapture();
				}
			}		
		}
	}else{
		that.flag = true;
		that.style.background = "rgba(100,100,100,0.75)";
		assessTwo.style.display = "none";
	}
}

//rgb转十六进制
String.prototype.colorHex = function(){
	var that = this;
	//十六进制颜色值的正则表达式
	var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
	// 如果是rgb颜色表示
	if (/^(rgb|RGB)/.test(that)) {
		var aColor = that.replace(/(?:\(|\)|rgb|RGB)*/g, "").split(",");
		var strHex = "#";
		for (var i=0; i<aColor.length; i++) {
			var hex = Number(aColor[i]).toString(16);
			if (hex === "0") {
				hex += hex;    
			}
			strHex += hex;
		}
		if (strHex.length !== 7) {
			strHex = that;    
		}
		return strHex;
	} else if (reg.test(that)) {
		var aNum = that.replace(/#/,"").split("");
		if (aNum.length === 6) {
			return that;    
		} else if(aNum.length === 3) {
			var numHex = "#";
			for (var i=0; i<aNum.length; i+=1) {
				numHex += (aNum[i] + aNum[i]);
			}
			return numHex;
		}
	}
	return that;
};

//以下为色阶处理方法
var imgObj = null; //全局对象

function loadImage(elem){
	imgObj = new Chobi(elem);
	imgObj.ready(function(){
		this.canvas = document.getElementById("tempCanvas");
		this.loadImageToCanvas();
	});
} 

//色阶处理
var disX = 0;
var disY = 0;
var selectProcessArea = document.getElementById("selectProcessArea");
var drag = document.getElementById("drag");
var integerDeal = document.getElementById("integerDeal"); //整体处理
var obtn = integerDeal.getElementsByTagName("button");
var flagDeal = false;
var selectflag = null;

var partDeal = document.getElementById("partDeal"); //局部处理
var partBtn = partDeal.getElementsByTagName("button");
//鼠标按下时
drag.onmousedown = function(ev){
  var ev = ev || window.event;
  disX = ev.clientX - drag.offsetLeft;
  disY = ev.clientY - drag.offsetTop;

  //鼠标移动时
  //alert(disX + "  " + disY);
  document.onmousemove = function(ev){
	var ev = ev || window.event;
	drag.style.left = ev.clientX - disX + "px";
	drag.style.top = ev.clientY - disY + "px";
  };

  //鼠标抬起时
  document.onmouseup = function(){
	document.onmousemove = null;
	document.onmouseup = null;
  }
  return false;
}
//整体处理
obtn[0].onclick = function(){
	imgObj.blackAndWhite();
	imgObj.loadImageToCanvas();
}
obtn[1].onclick = function(){
	imgObj.blackAndWhite2();
	imgObj.loadImageToCanvas();
}
obtn[2].onclick = function(){
	imgObj.sepia();
	imgObj.loadImageToCanvas();
}
obtn[3].onclick = function(){
	imgObj.negative();
	imgObj.loadImageToCanvas();
}
obtn[4].onclick = function(){
	imgObj.vintage();
	imgObj.loadImageToCanvas();
}
obtn[5].onclick = function(){
	imgObj.brightness(1);
	imgObj.loadImageToCanvas();
}
obtn[6].onclick = function(){
	imgObj.brightness(-1);
	imgObj.loadImageToCanvas();
}
obtn[7].onclick = function(){
	imgObj.contrast(1);
	imgObj.loadImageToCanvas();
}
obtn[8].onclick = function(){
	imgObj.contrast(-1);
	imgObj.loadImageToCanvas();
}
obtn[9].onclick = function(){
	loadImage(tempMyGod);
}

//框选区域的范围
var endX;  
var endY;
var startX;
var startY;
//框选色阶局部范围
var selectAreaCanvas = document.getElementsByClassName('selectArea')[0];
selectAreaCanvas.onmousedown = function(event){
	var e = event||window.event;
	var imgRect = mygod.getBoundingClientRect();
	var imgLeft = imgRect.left;
	var imgTop = imgRect.top;
	var layerName = "layer";
	selectAreaCanvas.height = mygod.height;
	startX = (e.clientX - imgLeft)/index;
	startY = (e.clientY - imgTop)/index;
	//selectArea(event,flagDeal,selectflag);
	selectAreaCanvas.onmousemove = function(event){
		endX = (event.clientX - imgLeft)/index;
		endY = (event.clientY - imgTop)/index;
		var width = endX - startX;
		var height = endY - startY;
		$(".selectArea").removeLayer(layerName);
		$(".selectArea").addLayer({
			type: "rectangle",
			name:layerName,
			strokeStyle: "#fff",
			strokeWidth: "2",
			fromCenter: false,
			x: startX, y: startY,
			width: width,
			height: height
		});
		$(".selectArea").drawLayers();
	}
	selectAreaCanvas.onmouseup = function(event){
		$(".selectArea").removeLayer(layerName);
		selectAreaCanvas.onmousemove = null;
		selectAreaCanvas.onmouseup = null;
		colorProcessMethod();
	}
}

//局部处理
function colorProcessMethod(){
	mygod.style.zIndex = 998;
	var realStartX = startX*(mygod.naturalWidth/850)
	var realStartY = startY*(mygod.naturalWidth/850);	
	var realEndX = endX*(mygod.naturalWidth/850);
	var realEndY = endY*(mygod.naturalWidth/850);

	if(imgObj.contrast(20,realStartX,realStartY,realEndX,realEndY)){
		console.log("对比度");
		imgObj.loadImageToCanvas();
	}else{
		console.log("对比度")
	}

}

partBtn[1].onclick = function(){
	mygod.style.zIndex = 998;
	var realStartX = startX*(mygod.naturalWidth/850);
	var realStartY = startY*(mygod.naturalWidth/850);	
	var realEndX = endX*(mygod.naturalWidth/850);
	var realEndY = endY*(mygod.naturalWidth/850);

	console.log(realStartX + " " + realStartY + "  " + realEndX + "  " + realEndY);
	if(imgObj.contrast(-5,realStartX,realStartY,realEndX,realEndY)){
		console.log("对比度");
		imgObj.loadImageToCanvas();
	}else{
		console.log("对比度")
	}
}

partBtn[2].onclick = function(){
	mygod.style.zIndex = 998;
	var realStartX = startX*(mygod.naturalWidth/850);
	var realStartY = startY*(mygod.naturalWidth/850);	
	var realEndX = endX*(mygod.naturalWidth/850);
	var realEndY = endY*(mygod.naturalWidth/850);

	console.log(realStartX + " " + realStartY + "  " + realEndX + "  " + realEndY);
	if(imgObj.brightness(5,realStartX,realStartY,realEndX,realEndY)){
		console.log("亮度");
		imgObj.loadImageToCanvas();
	}else{
		console.log("亮度")
	}
}

partBtn[3].onclick = function(){
	mygod.style.zIndex = 998;
	var realStartX = startX*(mygod.naturalWidth/850);
	var realStartY = startY*(mygod.naturalWidth/850);	
	var realEndX = endX*(mygod.naturalWidth/850);
	var realEndY = endY*(mygod.naturalWidth/850);

	console.log(realStartX + " " + realStartY + "  " + realEndX + "  " + realEndY);
	if(imgObj.brightness(-5,realStartX,realStartY,realEndX,realEndY)){
		console.log("亮度");
		imgObj.loadImageToCanvas();
	}else{
		console.log("亮度")
	}
}

selectProcessArea.onclick = function(){
	selectAreaCanvas.style.zIndex = 1001;
}

function selectArea(event,flag,selectflag){
	var e = event||window.event;
	var imgRect = mygod.getBoundingClientRect();
	var imgLeft = imgRect.left;
	var imgTop = imgRect.top;
	
	var imgX = (e.clientX - imgLeft)/index;
	var imgY = (e.clientY - imgTop)/index;
	if(flag){
		imgSelectDeal(mygod,imgX,imgY,selectflag);
	}else{
		return;
	}
}

function imgSelectDeal(that,x,y,selectflag){
	var realX = x*(that.naturalWidth/850);
	var realY = y*(that.naturalWidth/850);	
	if(selectflag == 1){
		imgObj.contrast(5,realX,realY);
	}else if(selectflag == 2){
		imgObj.contrast(-5,realX,realY);
	}else if(selectflag == 3){
		imgObj.brightness(1,realX,realY);
	}else if(selectflag == 4){
		imgObj.brightness(-1,realX,realY);
	}
	imgObj.loadImageToCanvas();
}

//添加缺陷信息
var tempTable = null;
addSpan.onclick = function(){
	$('#tableNews').append('<tr><th><span>缺陷编号：</span></th><th><input type="text" class="form-control input-sm" name=""></th><th><span>缺陷性质：</span></th><th><input type="text" class="form-control input-sm" name=""></th><th><span>缺陷位置：</span></th><th><input type="text" class="form-control input-sm"  name=""></th><th><span>缺陷定量</span></th><th><input type="text" class="form-control input-sm"  name=""></th></tr>');
}

//把canvas中的内容生成图片
function convertCanvasToImage(canvas) {
    var imageCannvas = new Image();
    imageCannvas = canvas.toDataURL("image/png");
    return imageCannvas;
}

/*oLi[14].onclick = function(){
	document.getElementById("myimgDemo").src = convertCanvasToImage(MTcontent).src;
}*/
function getBase64Image(img) {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, img.width, img.height);
    var ext = img.src.substring(img.src.lastIndexOf(".")+1).toLowerCase();
    var dataURL = canvas.toDataURL("image/"+ext);
    return dataURL;  
}

function dataURItoBlob(base64Data) {
	var byteString;
	if (base64Data.split(',')[0].indexOf('base64') >= 0){
		byteString = atob(base64Data.split(',')[1]);
	}
	else{
		byteString = unescape(base64Data.split(',')[1]);
	}
	var mimeString = base64Data.split(',')[0].split(':')[1].split(';')[0];
	var ia = new Uint8Array(byteString.length);
	for (var i = 0; i < byteString.length; i++) {
		ia[i] = byteString.charCodeAt(i);
	}
	return new Blob([ia], {type:mimeString});
}

//提交信息
var submit = document.getElementById("submit");
submit.onclick = function(){
	var blobjy = dataURItoBlob(convertCanvasToImage(MTcontent));
	var blobpro = dataURItoBlob(getBase64Image(mygod));
	var canvas = document.createElement('canvas');
	var dataURL = canvas.toDataURL('image/jpeg', 0.5);
	var fd = new FormData(document.forms[0]);

	var tableNews = document.getElementById("tableNews");
	var tableTr = tableNews.getElementsByTagName("tr");
	var textrRecognition = document.getElementById("textrRecognition").value;
	var blackness = document.getElementById("blackness").value;
	var dataJson = {"id":imgId,"message":textrRecognition,"blackness":blackness};
	var tempArr = "";

	for(var i=1;i<tableTr.length;i++){
		var inputNews = tableTr[i].getElementsByTagName('input');
		if(i == (tableTr.length-1)){
			var temp = '{"id":"'+inputNews[0].value+'","property":"'+inputNews[1].value+'","positon":"'+inputNews[2].value+'","ration":"'+inputNews[3].value+'"}';
			tempArr+=temp;
		}else{
			var temp = '{"id":"'+inputNews[0].value+'","property":"'+inputNews[1].value+'","positon":"'+inputNews[2].value+'","ration":"'+inputNews[3].value+'"},';
			tempArr+=temp;
		}
	}  
	dataJson["defects"] = tempArr;
	dataShuju = JSON.stringify(dataJson);
	var count = Math.ceil(Math.random()*100);

	fd.append("proImg", blobpro, 'pro'+window.imgName);
	fd.append("drawImg", blobjy, 'draw'+window.imgName);
	fd.append("id", imgId);

	$.ajax({
		url: '/saveImg/',
		type: 'POST',
		data: fd,
		processData: false,  // 不处理数据
		contentType: false   // 不设置内容类型
	})
	.done(function(data) {
		$.ajax({
			url: '/saveall/',
			type: 'POST',
			dataType: 'text',
			data: JSON.parse(dataShuju)
		})
		.done(function(data) {
			var inputs = tableNews.getElementsByTagName('input');
			for(var i=1;i<inputs.length;i++){
				inputs[i].value = "";
			}
			loadImage(tempMyGod);
			alert("数据提交成功");
		})
		.fail(function() {
			alert("数据提交失败");
		})
		.always(function() {
			console.log("complete");
		});	
	})
	.fail(function() {
		alert("数据提交失败");
	})
	.always(function() {
		console.log("complete");
	});
}

