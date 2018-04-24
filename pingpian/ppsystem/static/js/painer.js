(function(){
	function Painter(canvasId){
		var canvasEle = document.getElementById(canvasId);
		//调用Canvas对象的getContext()方法，得到一个CanvasRenderingContext2D对象；
		this.context = canvasEle.getContext("2d");	
		this.drawLine(canvasId);
	}
	
	//绘制矩形
	Painter.prototype.drawLine = function(canvasId){
		var needWidth = 0;
		var needHeight = 0;
		var flagMove;
		var that = this;
		var layer = 0;		//图层设置
		var layerIndex=layer;  
        var layerName="layer";  
        var linelayerName = "lineName";
		var x=0;			//点击的位置坐标（相对于canvas）
		var y=0;
		
		var canvas = document.getElementById(canvasId);;
		var canvasRect;  //获取某个canvas元素相对于视窗的位置集合。
		var canvasLeft = 0;
		var canvasTop = 0; 
		var lineLayer = 0;//画线测量时所需的id
		
		var disX = 0;
		var disY = 0 ;
		
		var MTparent = document.getElementsByClassName("MTcontent")[0];
		var mygod = document.getElementById("mygod");
		var selectArea = document.getElementsByClassName('selectArea')[0];
		canvas.onmousedown = function(event){
			var shape;
			if(!that.shape){
				shape = "ellipse";
			}else{
				shape = that.shape;
			}
			if(!that.index){
				that.index = 1;
			}else{
				that.index = that.index
			}
			canvasRect = canvas.getBoundingClientRect();  //获取canvas元素相对于视窗的位置集合。
			canvasLeft = canvasRect.left;
			canvasTop = canvasRect.top; 
			
			MTparentRect = MTparent.getBoundingClientRect();
			parentCanvasLeft = MTparentRect.left;
			parentCanvasTop = MTparentRect.top;
			if(that.isMove){
				var criticalPoint = document.getElementById('ruler');

				//父级容器的宽高作为拖拽的琳临界点
				var criticalX = criticalPoint.offsetWidth;
				var criticalY = criticalPoint.offsetHeight;
				var e = event||window.event;
				disX = e.clientX - (canvasLeft - parentCanvasLeft);
				disY = e.clientY - (canvasTop - parentCanvasTop);
				var x = criticalX - canvas.width;
				var y = criticalY - canvas.height;

				document.onmousemove = function(event){
					var e = event||window.event;
					var left = e.clientX - disX + (parseFloat(canvas.width)*(that.index-1))/2;
					var top = e.clientY - disY+ (parseFloat(canvas.height)*(that.index-1))/2;

				
					if(left<-(canvas.width*that.index)/2){
						left = -(canvas.width*that.index)/2;
					}
					if(top<-(canvas.height*that.index)/2){
						top = -(canvas.height*that.index)/2;
					}
					if(left> (canvas.width*that.index)/2){
						left = (canvas.width*that.index)/2;
					}
					if(top > (canvas.height*that.index)/2){
						top = (canvas.height*that.index)/2;
					}

					selectArea.style.left = mygod.style.left = canvas.style.left = left + 'px';
					selectArea.style.top = mygod.style.top = canvas.style.top = top +'px';
										
					if(canvas.setCapture){
						canvas.setCapture();
						mygod.setCapture();
					}
				}
				
				document.onmouseup = function(){
					document.onmousemove = null;
					document.onmouseup = null;
					
					if(canvas.releaseCapture){
						canvas.releaseCapture();
						mygod.releaseCapture();
					}
				}				
			}else{
				layerIndex++;  
				layer++;  
				layerName+=layerIndex;  
				linelayerName+=layerIndex;
				var color=that.context.strokeStyle;		//捕获画笔颜色
				var penWidth=that.context.lineWidth;	//捕获画笔宽度 
				
				x=(event.clientX-canvasLeft)/that.index;  
				y=(event.clientY-canvasTop)/that.index;  

				canvas.onmousemove = function(event){
					if(!that.draw){
						return;
					}else if(that.isdrawMove){
						that.isEraser = false;
						return;
					}else if(that.isEraser){
						that.isdrawMove = false;
						return;
					}else if(shape=="line"){ //画线测量
						width = (event.clientX-canvasLeft)/that.index;
						height = (event.clientY-canvasTop)/that.index;
						
						needWidth = width - x;
						needHeight = height - y;
						
						$("#"+canvasId).removeLayer(layerName);
						$("#"+canvasId).drawLine({
							layer: true,
							name: layerName,
							strokeStyle: color,
							strokeWidth: penWidth,
							x1: x, y1: y,
							mousedown: function(layer) {
								if(that.isEraser){
									$("#"+canvasId).removeLayer(layer.name);
									$("#"+canvasId).removeLayer(layer.name.replace(/layer/,'lineName'));
								}
							},
							x2: width, y2: height,
							index: lineLayer
						});
						var relLength = ((Math.sqrt((Math.pow(needWidth,2)+Math.pow(needHeight,2))))/30).toFixed(3) + "mm";

						$("#"+canvasId).removeLayer(linelayerName);
						$("#"+canvasId).drawText({
							layer: true,
							name: linelayerName,
							fillStyle: '#eee',
							strokeStyle: '#eee',
							mouseover: function(layer){
								if(that.isdrawMove){
									MTcontent.style.cursor = "move";
								}else if(that.isEraser){
									MTcontent.style.cursor = "url(../image/icon/rush.cur)"
								}
							},
							mousedown: function(layer) {
								if(that.isEraser){
									$("#"+canvasId).removeLayer(layer.name);
									$("#"+canvasId).removeLayer(layer.name.replace(/lineName/,'layer'));
								}
							},
							strokeWidth: 0.1,
							x: x, y: y-5,
							fontSize: 10,
							fontFamily: 'Verdana',
							text: relLength
						});
						$("#"+canvasId).drawLayers();
					}else{
						width = (event.clientX-canvasLeft)/that.index-x;
						height = (event.clientY-canvasTop)/that.index-y;
						$("#"+canvasId).removeLayer(layerName);
						$("#"+canvasId).addLayer({
							type: shape,
							draggable: true,
							bringToFront: true,
							dragstart: function(layer){
								if(!that.isEraser){
									that.isdrawMove = true;
								}
							},
							dragstop: function(layer){
								if(!that.isEraser){
									console.log(1);
									that.isdrawMove = false;
								}
							},
							mouseover: function(layer){
								if(that.isdrawMove){
									MTcontent.style.cursor = "move";
								}else if(that.isEraser){
									MTcontent.style.cursor = "pointer"

								}
							},
							click: function(layer) {
								if(that.isEraser){
									$("#"+canvasId).removeLayer(layer.name);
								}
							},
							name:layerName,
							strokeStyle: color,
							strokeWidth: penWidth,
							fromCenter: false,
							x: x, y: y,
							width: width,
							height: height
						});
						$("#"+canvasId).drawLayers();
					}		
				}
			}
		}
		
		canvas.onmouseup = function(){
			if(that.shape == "line"){
				$("#"+canvasId).saveCanvas();
				canvas.onmousemove = null;
			}else{
				canvas.onmousemove = null;
				$("#"+canvasId).saveCanvas();
			}
			
		}
		
		function drag(layerName){
			$("#"+canvasId).removeLayer(layerName);
		}
	}
	//画笔宽度
	Painter.prototype.setLineWidth = function(width){
		if(width==""){
			this.context.lineWidth = 5;
		}else{
			this.context.lineWidth = width;
		}
	}
	//画笔颜色
	Painter.prototype.setLineColor = function(color){
		if(color==""){
			this.context.strokeStyle = "#f19600";
		}else{
			this.context.strokeStyle = color;
		}
		
	}
	//绘制的形状
	Painter.prototype.setShape = function(shape){
		this.isEraser = false;
		this.isMove = false;
		if(shape==""){
			this.shape = "ellipse"
		}else{
			this.shape = shape;
		} 
	}
	
	//清除操作
	Painter.prototype.eraser = function(flag){
		this.isEraser = flag;
	}
	
	//移动操作
	Painter.prototype.move = function(flag){
		this.isMove = flag;
	}
	
	//绘画的图形移动
	Painter.prototype.drawMove = function(flag){
		this.isdrawMove = flag;
	}
	
	//是否绘制
	Painter.prototype.isDraw = function(flag){
		this.draw = flag;
	}
	
	//图片放大系数
	Painter.prototype.scale = function(index){
		this.index = index;
	}
	
	window.Painter = Painter;
})()