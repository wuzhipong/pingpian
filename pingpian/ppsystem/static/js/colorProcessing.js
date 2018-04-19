var imgObj = null; //全局对象
var demo = document.getElementById('demo');

loadImage("./img/1124YL/T307/test/1.jpg");
function loadImage(elem){
	imgObj = new Chobi(elem);
	imgObj.ready(function(){
		this.canvas = document.getElementById("tempCanvas");
		this.loadImageToCanvas();
	});
} 
var disX = 0;
var disY = 0;
var drag = document.getElementById("drag");
var integerDeal = document.getElementById("integerDeal");
var obtn = integerDeal.getElementsByTagName("button");
var flagDeal = false;

console.log(obtn.length);
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
	loadImage("./img/1124YL/T307/test/1.jpg");
}
obtn[10].onclick = function(){
	mygod.style.zIndex = 998;
	flagDeal = true;
}

mygod.onmousedown = function(event){
	selectArea(event,flagDeal);
}

function selectArea(event,flag){
	var e = event||window.event;
	var imgRect = mygod.getBoundingClientRect();
	var imgLeft = imgRect.left;
	var imgTop = imgRect.top;
	
	var imgX = e.clientX - imgLeft;
	var imgY = e.clientY - imgTop;
	if(flag){
		console.log(mygod.naturalWidth);
		imgSelectDeal(mygod,imgX,imgY);
	}else{
		return;
	}
}

function imgSelectDeal(that,x,y){
	var realX = x*(that.naturalWidth/900);
	var realY = y*(that.naturalWidth/900);
	
	console.log(realX,realY);
	imgObj.sepia(realX,realY);
	imgObj.loadImageToCanvas();
}














