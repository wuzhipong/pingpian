(function($){
	var w, h;
		wR = $("#ruler").width(), hR = $("#ruler").height();
		w = wR+2000;
		h = hR+2000;
	var count = 2;
	$.pageRuler = function(params){
		params = params || {};
		var flag = $("#ScaleBox").length === 0 ? true : false;
		if(flag){
			 $('<div class="ScaleBox" id="ScaleBox" onselectstart="return false;">'+
					'<div id="ScaleRulerH" class="ScaleRuler_h"></div>'+
					'<div id="ScaleRulerV" class="ScaleRuler_v"></div>'+
					'<div id="RefDotH" class="RefDot_h"></div>'+
					'<div id="RefDotV" class="RefDot_v"></div>'+
				'</div>').appendTo($("#ruler"));
		}else{
			$("#ScaleBox").show();
		}
		//整个标尺盒子对象，垂直标尺与水平标尺对象，虚线对象
		var x= $("#ScaleBox"), rh = $("#ScaleRulerH"), rv = $("#ScaleRulerV"), doth = $("#RefDotH"), dotv = $("#RefDotV"),
			dragFlag = false, oDrag = null;
		//标尺放大
		if(params>=1){
			rh.css({'webkitTransform':'scale('+(params)+','+(params)+')','transform':'scale('+(params)+','+(params)+')'});
			rv.css({'webkitTransform':'scale('+(params)+','+(params)+')','transform':'scale('+(params)+','+(params)+')'});
		}else{
			rh.css({'webkitTransform':'scale('+(params)+','+1+')','transform':'scale('+(params)+','+1+')'});
			rv.css({'webkitTransform':'scale('+1+','+(params)+')','transform':'scale('+1+','+(params)+')'});
			var temp = 1 - params;
			console.log(temp);
			rh.css({'left':(-wR*temp)});
			rv.css({'top':(-hR*temp)});
			if(temp<0.8){
				//		
			}
		}
		var f = {
			box: function(){
				//整个box的宽高
				x.height(hR).width(wR);
			},
			ui: function(){
				rh.html("");
				rv.html("");
				//创建标尺数值
				for(var i=0; i<w; i+=1){
					if(i % 60 === 0){
						$('<span class="n">'+(i/30)+'</span>').css("left", i).appendTo(rh);
					}
				}
				//垂直标尺数值
				for(var i=0; i<h; i+=1){
					if(i % 60 === 0){
						$('<span class="n">'+(i/30)+'</span>').css("top", i).appendTo(rv);
					}
				}	
			},
			ie6: function(){
				if(!window.XMLHttpRequest){
					$(window).scroll(function(){
						var t = $(document).scrollTop();
						 x.css("top", t);			
					});	
					if(flag){
						$(window).trigger("scroll");
					}
				}
			},
			newv: function(t){//创建新的垂直参考线，有效宽度3像素
				var id = "RefLineV"+($(".RefLine_v").length+1);
				$('<div class="RefLine_v"></div>')
					.appendTo(x)
					.attr({
						  "id": id,
						  "title": t
					});
				return $("#"+id);
			},
			newh: function(t){//创建新的水平参考线，有效宽度3像素
				var id = "RefLineH"+($(".RefLine_h").length+1);
				$('<div class="RefLine_h"></div>')
					.appendTo(x)
					.attr({
						  "id": id,
						  "title": t
					});
				return $("#"+id);
			},
			//拖拽式垂直虚线的位置
			dashv: function(){
				$(document).bind("mousemove",function(e){
					//alert(dragFlag);
					if(dragFlag){
						//alert(e.screenX);
						//如果可以拖拽
						//垂直虚线的左坐标
						dotv.css("left",e.pageX-document.getElementById('ruler').getBoundingClientRect().left);
					}
				});
			},
			//拖拽式水平虚线的位置
			dashh: function(){
				$(document).bind("mousemove",function(e){
					if(dragFlag){
						//如果可以拖拽
						//垂直虚线的左坐标
						doth.css("top",e.pageY-$(window).scrollTop()-document.getElementById('ruler').getBoundingClientRect().top);
					}
				});
			},
	
			//初始化执行
			init: function(){
				f.box();
				f.ui();
				f.ie6();	
				//f.crtdata();
			}
		};
		f.init();
		
		/*浏览器拉伸时，标尺自适应*/
		/*$(window).resize(function(){
			f.box();
			f.ui();					  
		});*/
		//参考线的水平拖移
		$(document).on("mousedown", ".RefLine_v", function(){
			oDrag = $(this);	
			dragFlag = true;
			f.dashv();
		});
		//参考线的垂直拖移
		$(document).on("mousedown", ".RefLine_h", function(){
			oDrag = $(this);	
			dragFlag = true;
			f.dashh();
		});
		
		$(document).mouseup(function(e){
			$(this).unbind("mousemove");
			dragFlag = false;
			if(oDrag){
				if(oDrag.hasClass("RefLine_v")){
					var v_l = e.pageX-document.getElementById('ruler').getBoundingClientRect().left;
					if(v_l < rv.width()){
						v_l = -600;					  
					}
					oDrag.css("left", v_l-1).attr("title", v_l+"px");
				}else{
					var v_t = e.pageY-$(window).scrollTop()-document.getElementById("ruler").getBoundingClientRect().top;
					if(v_t < rh.height()){
						v_t = 600;	
					}
					oDrag.css("top", v_t-1).attr("title", v_t+"px");
				}	
			}
			oDrag = null;
			dotv.css("left", -10);
			doth.css("top", -10);
		})
		//拖动标尺创建新的参考线
		rv.bind("mousedown", function(){
			oDrag = f.newv();	
			dragFlag = true;
			f.dashv();						  
		});
		rh.bind("mousedown", function(){
			oDrag = f.newh();	
			dragFlag = true;
			f.dashh();						  
		});
	};
	//快捷键参数
	$.lineToggle = function(){
		$(".RefLine_v").toggle();	
		$(".RefLine_h").toggle();
	};
	$.pageRulerHide = function(params){
		//标尺放大
		$("#ScaleRulerH").css({'webkitTransform':'scale('+(params)+','+(params)+')','transform':'scale('+(params)+','+(params)+')'});
		$("#ScaleRulerV").css({'webkitTransform':'scale('+(params)+','+(params)+')','transform':'scale('+(params)+','+(params)+')'});
		$("#ScaleBox").hide();
	};
	$.pageRulerShow = function(params){
		//标尺放大
		$("#ScaleRulerH").css({'webkitTransform':'scale('+(params)+','+(params)+')','transform':'scale('+(params)+','+(params)+')'});
		$("#ScaleRulerV").css({'webkitTransform':'scale('+(params)+','+(params)+')','transform':'scale('+(params)+','+(params)+')'});
		$("#ScaleBox").show();
	}
	$.pageRulerToggle = function(params){
		if($("#ScaleBox").length && $("#ScaleBox").css("display") === "block"){
			$("#ScaleRulerH").toggle();
			$("#ScaleRulerV").toggle();
		}else{
			$.pageRuler(params);
		}
	};
	$.pageRulerScale = function(params){
		$.pageRuler(params);
	}   
})(jQuery);