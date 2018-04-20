'use strict';
var Chobi = function(elem){
	if(elem instanceof(Image)){					  //如果获取到的元素为图片
		this.image = elem;
		this.imageData = this.extractImageData(); //将图片绘制到canvas中 并获取图片的像素数据 
		console.log('Type matched. instanceof(Image). Saved as [Chobi object]');
		try{
			this.onload();
		}catch(e){
			console.log('ready callback not found');
		}
	} 
	else if(typeof(elem)=='string'){              //如果获取到一串字符创
		var context = this;
		console.log('Not instanceof(Image). Trying as URL');
		var img = new Image();
		img.crossOrigin = "Anonymous";
		img.src = elem;
		img.onload = function(){
			context.image = img;
			context.imageData = context.extractImageData(); //将图片绘制到canvas中 并获取图片的像素数据 
			console.log('Type matched. URL. Saved as [Chobi object]');
			try{
				context.onload();
			}catch(e){
				console.log('ready callback not found');
			}
			return;
		}
	}
	else{       //如果都不是  尝试将上传的文件换为img（不知道怎么形容） 容错机制
		console.log('Not instanceof(Image). Trying as URL');
		console.log('Not URL. Trying as input[file]');
		var context = this;
		try {
			var file = elem.files[0];	//如果是文件  获取文件对象
			var fr = new FileReader();  //使用fileReader对文件对象进行操作  
			fr.onload= function(){
				var img = new Image();
				img.onload = function(){
					context.image = img;
					context.imageData = context.extractImageData();
					console.log('Type matched. input[file]. Saved as [Chobi object]');
					try{
						context.onload();
					}catch(e){
						console.log('ready callback not found');
					}
					return;
				}
				img.src = fr.result;
			};
			fr.readAsDataURL(file);//用于图片显示不需要传入后台，reader.result的结果是base64编码数据，直接放入img的src中即可 
		} catch(e) {
			console.log("Not input[file]. Trying as <canvas>");
		}
		try{
			var img = new Image();
			var imgData = elem.toDataURL(); //将图片转为dataURL(base64)
			img.src = imgData;
			console.log(imgData);
			img.onload = function(){
				context.image = img;
				context.imageData = context.extractImageData();
				console.log('Type matched. <canvas>. Saved as [Chobi object]');
				try{
					context.onload();
				}catch(e){
					console.log('ready callback not found');
				}
				return;
			}
		}catch(e){
			console.log('Not <canvas>. Trying as <img>');
		}
		try{
			var img = new Image();
			img.src = elem.src;
			img.onload = function(){
				context.image = img;
				context.imageData = context.extractImageData();
				console.log('Type matched. <img>. Saved as [Chobi object]');
				try{
					context.onload();
				}catch(e){
					console.log('ready callback not found');
				}
				return;
			}
		}catch(e){
			console.log('Not <img>. No other type is supported');
		}

	}
}


//将修改过的imgData通过putImageData()重新放入到canvas中
/*
 *drawArea: canvas对象
 */
Chobi.prototype.loadImageToCanvas = function(drawArea){
	if(drawArea==null&&this.canvas!=null){
		drawArea = this.canvas;
	}
	try{
		var imageData = this.imageData;
		var ctx = drawArea.getContext("2d");
		drawArea.width = imageData.width;
		drawArea.height = imageData.height;
		ctx.putImageData(imageData,0,0);  //getImageData()复制画布上指定矩形的像素数据，然后通过 putImageData() 将图像数据放回画布 
		
		//var mycanvas = document.getElementById("thecanvas");  
		var image = drawArea.toDataURL("image/png");  
		//w.document.write("<img src='"+image+"' alt='from canvas'/>");
		var img = document.getElementById("mygod");
		img.src = image;
	}
	catch(e){
		return false;
	}
	return this;
}

//图片加载事件
Chobi.prototype.ready = function(onLoadFunc){
	this.onload = onLoadFunc;
}
Chobi.prototype.onload = null;
//将img绘制到canvas中 并复制画布上指定矩形的像素数据 
Chobi.prototype.extractImageData = function(){
	var img = this.image;
	var drawArea = document.createElement('canvas');
	var ctx = drawArea.getContext("2d");
	drawArea.width = img.width;
	drawArea.height = img.height;
	ctx.drawImage(img,0,0,img.width,img.height);
	this.imageData = ctx.getImageData(0,0,img.width,img.height);
	return this.imageData;
}

//获取想x，y点像素点的rgba值
//getImageData(x,y,width,height);这个方法返回一个属性data数组,也就是CanvasPixelArray
//1个像素分别有四个值rgba(红,绿,蓝，阿尔法值); 1个像素就有这4个值，意味着CanvasPixelArray里面每个像素值就占了个位置简称4X(下同)。
//CanvasPixelArray的排序要简单，从左上角到右下角。长度也简单4X。比如说width*height*4.比如：3*3像素CanvasPixelArray有多少个值。3*3*4=36值。
//像素值是从1开始。但是数组的索引值是从0开始的，所以3*3像素CanvasPixelArray长度是36位。。
//但是第3*3像素它的颜色值 是[....,32,33,34,35]。索引值 需要减去4开始。道理就是像素开始的坐标是1*1.但是数组是0。
Chobi.prototype.getColorAt = function(x,y){
	var index=(y*4)*this.imageData.width+(x*4);
	var colorData = {
		red: this.imageData.data[index],
		green: this.imageData.data[index+1],
		blue: this.imageData.data[index+2],
		alpha: this.imageData.data[index+3]
	}
	return colorData;
}
//给x，y点像素点的rgba重新赋值
Chobi.prototype.setColorAt = function(x,y,obj){
	var index=(y*4)*this.imageData.width+(x*4);
	try{
		this.imageData.data[index] = obj.red;
		this.imageData.data[index+1] = obj.green;
		this.imageData.data[index+2] = obj.blue;
		this.imageData.data[index+3] = obj.alpha;
		return true;
	}
	catch(e){
		return e;
	}
}
//平均值法 黑白效果实现算法1  灰度化

//熔铸效果
//算法及原理：
//r = r*128/(g+b +1);
//g = g*128/(r+b +1);
//b = b*128/(g+r +1);
Chobi.prototype.blackAndWhite = function(){
	var imageData = this.imageData;
	for(var i=0;i<imageData.width;i++){
		for(var j=0;j<imageData.height;j++){
			var index=(j*4)*imageData.width+(i*4);
			var red=imageData.data[index];
			var green=imageData.data[index+1];
			var blue=imageData.data[index+2];
			var avg = (red+green+blue)/3;
			imageData.data[index] = avg;
			imageData.data[index+1] = avg;
			imageData.data[index+2] = avg;
			/*imageData.data[index] = red*128/(green+blue+1);
			imageData.data[index+1] = green*128/(red+blue+1);
			imageData.data[index+2] = blue*128/(green+red+1);*/
		}
	}
	return this;
}
//黑白效果实现算法2   灰度化
//加权平均值法：即新的颜色值R＝G＝B＝(R ＊ Wr＋G＊Wg＋B＊Wb)，一般由于人眼对不同颜色的敏感度不一样，所以三种颜色值的权重不一样，
//一般来说绿色最高，红色其次，蓝色最低，最合理的取值分别为Wr ＝ 30％，Wg ＝ 59％，Wb ＝ 11％
Chobi.prototype.blackAndWhite2 = function(){
	var imageData = this.imageData;
	for(var i=0;i<imageData.width;i++){
		for(var j=0;j<imageData.height;j++){
			var index=(j*4)*imageData.width+(i*4);
			var red=imageData.data[index];
			var green=imageData.data[index+1];
			var blue=imageData.data[index+2];
			var avg = ((red*0.3)+(green*0.59)+(blue*0.11));
			imageData.data[index] = avg;
			imageData.data[index+1] = avg;
			imageData.data[index+2] = avg;
		}
	}
	return this;
}
//怀旧效果  算法原理不懂
Chobi.prototype.sepia = function(x,y){
	var imageData = this.imageData;
	var mapX = 0;
	var mapY = 0;
	var endX = imageData.width;
	var endY = imageData.height;
	if(typeof(x) == "undefined" && typeof(y) == "undefined"){
		return;
	}else{
		mapX = parseInt(x - 100);
		mapY = parseInt(y - 100);
		endX = parseInt(x + 100);
		endY = parseInt(y + 100);
	}
	for(var i=mapX;i<endX;i++){
		for(var j=mapY;j<endY;j++){
			var index=(j*4)*imageData.width+(i*4);
			var red=imageData.data[index];
			var green=imageData.data[index+1];
			var blue=imageData.data[index+2];
			imageData.data[index] = (red*0.393)+(green*0.769)+(blue*0.189);
			imageData.data[index+1] = (red*0.349)+(green*0.686)+(blue*0.168);
			imageData.data[index+2] = (red*0.272)+(green*0.534)+(blue*0.131);
		}
	}
	return this;
}
//反色即底片效果
//算法原理：将当前像素点的RGB值分别与255之差后的值作为当前点的RGB值，即
//R = 255 – R；G = 255 – G；B = 255 – B；
Chobi.prototype.negative = function(){
	var imageData = this.imageData;
	for(var i=0;i<imageData.width;i++){
		for(var j=0;j<imageData.height;j++){
			var index=(j*4)*imageData.width+(i*4);
			var red=imageData.data[index];
			var green=imageData.data[index+1];
			var blue=imageData.data[index+2];
			var alpha = imageData.data[index+3];
			red = 255-red;
			green = 255-green;
			blue = 255-blue;
			imageData.data[index] = red;
			imageData.data[index+1] = green;
			imageData.data[index+2] = blue;
		}
	}
	return this;
}
//获取随机数  为后面添加噪点做准备
Chobi.prototype.random = function(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
//添加噪点
Chobi.prototype.noise = function(){
	var imageData = this.imageData;
	for(var i=0;i<imageData.width;i++){
		for(var j=0;j<imageData.height;j++){
			var index=(j*4)*imageData.width+(i*4);
			var rindex=(i*4)*imageData.width+(j*4);
			var randRed = this.random(100,200);
			var randGreen = this.random(100,200);
			var randBlue = this.random(100,200);
			var red=(imageData.data[index]+randRed)/2;
			var green=(imageData.data[index+1]+randGreen)/2;
			var blue=(imageData.data[index+2]+randBlue)/2;
			imageData.data[index] = red;
			imageData.data[index+1] = green;
			imageData.data[index+2] = blue;
		}
	}
	return this;
}
//设置对比度 
Chobi.prototype.contrast = function(amount,mapX,mapY,endX,endY){
	var value = (255.0 + amount) / 255.0;
	value *= value;
	var imageData = this.imageData;

	if(typeof(mapX) == "undefined" && typeof(mapY) == "undefined" && typeof(endX) =="undefined" && typeof(endY) == "undefined"){
		endX = imageData.width;
	    endY = imageData.height;
	}else{
		console.log(amount + " " + mapX + "  " + mapY + "  " + endX + "  " + endY);
	};
	mapX = Math.round(mapX);
	mapY = Math.round(mapY);
	endX = Math.round(endX);
	endY = Math.round(endY);

	for(var i=mapX;i<endX;i++){
		for(var j=mapY;j<endY;j++){
			var index=(j*4)*imageData.width+(i*4);
			var r=imageData.data[index];
			var g=imageData.data[index+1];
			var b=imageData.data[index+2];
			var red = r / 255.0;
			var green = g / 255.0;
			var blue = b / 255.0;
			red = (((red - 0.5) * value) + 0.5) * 255.0;
			green = (((green - 0.5) * value) + 0.5) * 255.0;
			blue = (((blue - 0.5) * value) + 0.5) * 255.0;
			if(red>255) red=255;
			if(red<0) red=0;
			if(green>255) green=255;
			if(green<0) green=0;
			if(blue>255) blue=255;
			if(blue<0) blue=0;
			imageData.data[index] = red;
			imageData.data[index+1] = green;
			imageData.data[index+2] = blue;
		}
	}
	return this;
}

Chobi.prototype.crossProcess = function(){
	var imageData = this.imageData;
	this.vintage();
	this.brightness(10);
	this.contrast(50);
	return this;
}

Chobi.prototype.map = function(x,min,max,a,b){
	return ((b-a)*(x-min)/(max-min))+a;  
}

//调整亮度
Chobi.prototype.brightness = function(amount,mapX,mapY,endX,endY) {
	var imageData = this.imageData;
	amount = this.map(amount,-100,100,-255,255);
	var mapX = 0;
	var mapY = 0;
	if(typeof(mapX) == "undefined" && typeof(mapY) == "undefined" && typeof(endX) =="undefined" && typeof(endY) == "undefined"){
		endX = imageData.width;
	    endY = imageData.height;
	}else{
		console(1);
	};
	mapX = Math.round(mapX);
	mapY = Math.round(mapY);
	endX = Math.round(endX);
	endY = Math.round(endY);
	
	for(var i=mapX;i<endX;i++){
		for(var j=mapY;j<endY;j++){
			var index=(j*4)*imageData.width+(i*4);
			var red=imageData.data[index];
			var green=imageData.data[index+1];
			var blue=imageData.data[index+2];
			red = red+amount;
			green = green+amount;
			blue = blue+amount;
			if(red>255) red=255;
			if(red<0) red=0;
			if(green>255) green=255;
			if(green<0) green=0;
			if(blue>255) blue=255;
			if(blue<0) blue=0;
			imageData.data[index] = red;
			imageData.data[index+1] = green;
			imageData.data[index+2] = blue;
		}
	}
	return this;
}		

Chobi.prototype.vintage = function() {
	var imageData = this.imageData;
	for(var i=0;i<imageData.width;i++){
		for(var j=0;j<imageData.height;j++){
			var index=(j*4)*imageData.width+(i*4);
			var red=imageData.data[index];
			var red=imageData.data[index];
			var green=imageData.data[index+1];
			var blue=imageData.data[index+2];
			red = green;
			green = red;
			blue = 150;
			imageData.data[index] = red;
			imageData.data[index+1] = green;
			imageData.data[index+2] = blue;
		}
	}
	this.contrast(50);
	return this;
}

//图片色调变暗
Chobi.prototype.vignette = function(scaleLevel){
	if(scaleLevel==""||scaleLevel==null){
	scaleLevel = 0.1;
	}
	var imgCntX = this.imageData.width/2;
	var imgCntY = this.imageData.height/2;
	var maxDis = Math.sqrt((imgCntY*imgCntY) + (imgCntX*imgCntX));
	var dis = Math.sqrt(((this.imageData.width/2-i)*(this.imageData.width/2-i))-((this.imageData.height/2-j)*(this.imageData.height/2-j)));

	for(var i=0;i<this.imageData.width;i++){
		for(var j=0;j<this.imageData.height;j++){
			var mix = this.getColorAt(i,j);
			var dis = Math.sqrt(Math.floor(Math.pow(i-imgCntY,2))+Math.floor(Math.pow(j-imgCntX,2)));
			mix.red = mix.red*(1-(1-scaleLevel)*(dis/maxDis));
			mix.green = mix.green*(1-(1-scaleLevel)*(dis/maxDis));
			mix.blue = mix.blue*(1-(1-scaleLevel)*(dis/maxDis));
			this.setColorAt(i,j,mix);
		}
	}
	return this;
}
//彩色噪点
Chobi.prototype.crayon = function() {
	this.noise().contrast(500);
	return this;
}

//不知道一种效果
Chobi.prototype.cartoon = function() {
	this.contrast(400);
	return this;
}
Chobi.prototype.canvas = null;

//这两段 具体干什么用我也没看太懂
Chobi.prototype.getImage = function(){
	var tmpCanvas = document.createElement('canvas');
	var tmpctx = tmpCanvas.getContext('2d');
	tmpCanvas.width = this.imageData.width;
	tmpCanvas.height = this.imageData.height;
	tmpctx.putImageData(this.imageData,0,0);
	var img = document.createElement("img");
	img.src = tmpCanvas.toDataURL("image/png");
	return img;
}
Chobi.prototype.crop = function(x,y,width,height){
	if(x==""||y==""||width==""||height==""){
		console.log("Invalid crop parameters");
		return this;
	}
	if(x<0||y<0||x>this.imageData.width||y>this.imageData.height||(x+width)>this.imageData.width||(y+height)>this.imageData.height){
		console.log("Invalid crop parameters");
		return this;
	}
	var canvas = document.createElement("canvas");
	this.loadImageToCanvas(canvas);
	var context = canvas.getContext("2d");
	var data = context.getImageData(x, y, width, height);
	this.imageData = data;
	return this;
}

//图片下载设置
/*
 *filename:下载文件的文件名
 *filetype:下载文件的类型
 */
Chobi.prototype.download = function(filename,filetype){
	if(filename==""){
		filename="demo";
	}
	if(filetype==""){
		filetype = "png";
	}
	var imageData = this.imageData;
	var drawArea = document.createElement('canvas');
	var ctx = drawArea.getContext("2d");
	drawArea.width = imageData.width;
	drawArea.height = imageData.height;
	ctx.putImageData(imageData,0,0);
	var image = drawArea.toDataURL("image/"+filetype).replace("image/"+filetype, "image/octet-stream");
	var link = document.createElement('a');
	if (typeof link.download === 'string') {
		 document.body.appendChild(link); // Firefox requires the link to be in the body
		 link.download = filename+"."+filetype;
		 link.href = image;
		 link.click();
		 document.body.removeChild(link); // remove the link when done
	} else {
		 location.replace(uri);
	}
	return true;
}
