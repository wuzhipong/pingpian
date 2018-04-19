# -*- coding: utf-8 -*-
#coding=utf-8
from __future__ import unicode_literals

from django.views.decorators.csrf import csrf_exempt

from ppsystem.models import ImageData
from django.http import HttpResponse
from django.shortcuts import render
import json
from django.http import JsonResponse
from PIL import Image
#!D:\Python27
#create by wuzhipeng on 3/31/2018
#Henan University
from PIL import Image
from PIL import ImageEnhance
from PIL import ImageFilter
from scipy import misc
import cv2
import math
import numpy as np
from matplotlib import pyplot as mat
import caffe
import numpy as np
import os,sys,base64
import time
from datetime import datetime

# Create your views here.
def index(request):
    return render(request,'index.html')
def upload(request):
    return render(request,'upload.html')
def redemo(request):
    return render(request,'redemo.html')
def myajax(request):
    data = request.POST.get('key')
    ret= {"key":data}
    return HttpResponse(json.dumps(ret))
#分割图像
def find_end(start_,black,white,black_max,white_max,width,arg):#寻找end点
    end_ = start_+1
    for m in range(start_+1, width-1):
        if (black[m] if arg else white[m]) > (0.98 * black_max if arg else 0.98 * white_max):  # 0.95这个参数请多调整，对应下面的0.05
            end_ = m
            break
    return end_
def find_theEnd(thestart_,black,white,black_max,white_max,height,arg):
    theEnd_ = thestart_ + 1
    for m in range(thestart_ + 1, height - 1):
        if (black[m] if arg else white[m]) > (
        0.95 * black_max if arg else 0.95 * white_max):  # 0.95这个参数请多调整，对应下面的0.05
            theEnd_ = m
            break
    return theEnd_
#定义函数 改变图片
def resize_Img(src):
	#方法用于对图片改变成大小为28*28的灰度图
	src_height = src.shape[0]
	src_width = src.shape[1]
	BI = 18.0/src_height #注意浮点运算
	src_width = math.ceil(src_width * BI)
	#调整大小为18 * src_width
	#设定dsize
	dsize = (int(src_width),int(18))
	srcDst =  cv2.resize(src,dsize,interpolation=cv2.INTER_AREA)
	k_h = 28 - srcDst.shape[0]
	k_w = 28 - srcDst.shape[1]
	if k_h%2==0:
		top = k_h/2
		bottom = k_h/2
	else:
		top = k_h/2
		bottom = k_h/2 + 1
	if k_w%2==0:
		left =  k_w/2
		right = left
	else:
		left = k_w/2
		right = k_w/2 + 1
	fsrcDst = cv2.copyMakeBorder(srcDst,top,bottom,left,right,cv2.BORDER_CONSTANT,value=255)
	#print fsrcDst.shape
	#fst = cv2.cvtColor(fsrcDst,cv2.COLOR_BGR2GRAY)
	return fsrcDst
###caffe 识别方法#####
def Identify(smallImg):
    #print smallImg
    root = r'C:\\caffe-master' #设定caffe根目录
    sys.path.insert(0,root+'python')
    os.chdir(root)
    #model_weights = root + '\\models\\_iter_30000.caffemodel'
    model_weights = 'C:\\pingpian\\_iter_30000.caffemodel'
    if os.path.isfile(model_weights):
        print 'caffenet found'
    else:
        print 'not found caffe'
    #img = r'F:\pip\zero.jpg' #需要识别的图片路径
    img = smallImg #需要识别的图片路径
    #im = caffe.io.load_image(img)

    labels_filename = 'C:\\pingpian\synset_words1.txt'
    caffe.set_mode_cpu()#设置caffe为cpu模式
    model_def = 'C:\\pingpian\\mydeploy.prototxt'
    net = caffe.Net(str(model_def),str(model_weights),caffe.TEST)

    #对输入的数据进行变换
    # caffe.io.transformer是一个类，实体化的时候构造函数__init__(self, inputs)给一个初值
    # 其中net.blobs本身是一个字典，每一个key对应每一层的名字，#net.blobs['data'].data.shape计算结果为(10, 3, 227, 227)
    transformer = caffe.io.Transformer({'data': net.blobs['data'].data.shape})  # 设定图片shape格式，有deploy文件指定
    transformer.set_transpose('data',(2,0,1))

    im = caffe.io.load_image(img,False)
    newImg = transformer.preprocess('data',im)

    net.blobs['data'].reshape(1,1,28,28)
    net.blobs['data'].data[...] = newImg
    out = net.forward()

    labels = np.loadtxt(labels_filename,str,delimiter='\t')
    prob = net.blobs['prob'].data[0].flatten().argsort()[-1]
    return labels[prob]
@csrf_exempt
def split(request):
#方法负责切割图片
    imgid = request.POST.get("id")#图片id
    imgsrc = request.POST.get("key")##图片路径
    imgData = ImageData.objects.get(id=imgid)
    message = imgData.message
    composite = imgData.se_composite_img
    if composite==None:
        composite = "null"
    if message==None:
        mystring = ''
        im = Image.open(str(imgsrc))
        box = (200,0,4000,300)
        region = im.crop(box)
        imgEh = ImageEnhance.Contrast(region)#对比度增强
        img = imgEh.enhance(5.0)
        img.save(imgsrc+".png")#可以保存图片
        img = cv2.imread(imgsrc+".png")#使用opencv的方法读取
        GrayImage = cv2.cvtColor(img,cv2.COLOR_BGR2GRAY)#bgr to gray
        GrayImage = cv2.medianBlur(GrayImage,5)#中值滤波
        ret,th1 = cv2.threshold(GrayImage,127,255,cv2.THRESH_BINARY)
        #  第一个参数是block size 第二个是param
        th2 = cv2.adaptiveThreshold(GrayImage,255,cv2.ADAPTIVE_THRESH_MEAN_C,\
                                    cv2.THRESH_BINARY,51,17)
        th3 = cv2.adaptiveThreshold(GrayImage,254,cv2.ADAPTIVE_THRESH_GAUSSIAN_C,\
                                    cv2.THRESH_BINARY_INV,3,5)#加权
        th3 = cv2.adaptiveThreshold(GrayImage,255,cv2.ADAPTIVE_THRESH_GAUSSIAN_C,\
                                    cv2.THRESH_BINARY,51,13)

        titles = ['Gray Image','Global Thresholding v = 127',
              'adaptive mean thresholding','adaptive gaussian thresholding']
        images = [GrayImage,th1,th2,th3]
        #misc.imsave('F:\pip\zest\zzzz.png',th3)#保存图片
        #cv2.imwrite("imgsrc.png",th3)
        img_thre = th1
        #分割字符
        white = [] #记录每一列的白色像素和
        black = [] #记录每一列的黑色像素和
        height = img_thre.shape[0]
        width = img_thre.shape[1]
        white_max = 0
        black_max = 0
        #   计算每一列的黑白像素总和
        for i in range(width):
            s = 0 #本列白色总数
            t = 0 #本列黑色总数
            for j in range(height):
                if img_thre[j][i] == 255:
                    s += 1
                if img_thre[j][i] == 0:
                    t += 1
            white_max = max(white_max,s)
            black_max = max(black_max,t)
            white.append(s)
            black.append(t)
        arg =False #false 表示白底黑字，true表示黑底白字
        if black_max > white_max:
            arg = True
        n = 1
        start = 1
        end = 2
        myImg = []#存放图片
        while n < width - 2:
            n += 1
            if (white[n] if arg else black[n])>(0.02*white_max if arg else 0.02 * black_max):
                #这些参数用于调整辨别 白底黑字 黑底白字
                #0.02 对应find里面的参数
                start = n
                end = find_end(start,black,white,black_max,white_max,width,arg)
                n = end
                if end - start > 5:
                    cj = img_thre[1:height,start:end]
                    myImg.append(cj)
        ImgList = []###存放切割成小图的照片
        for theImg in myImg:
            _n = 1
            _start = 1
            _end = 2
            s_white = []#记录每一列的白色像素总和
            s_black = []#记录每一列的黑色像素总和
            s_height = theImg.shape[0]#测长宽
            s_width = theImg.shape[1]
            if s_width > 100:
                continue
            s_white_max = 0
            s_black_max = 0
            #计算每一列的黑白像素总和
            for i in range(s_height):
                s = 0
                t = 0
                for j in range(s_width):
                    if theImg[i][j]==255:
                        s+=1
                    if theImg[i][j]==0:
                        t+=1
                s_white_max = max(s_white_max,s)
                s_black_max = max(s_black_max,t)
                s_white.append(s)
                s_black.append(t)
            arg = True #强行修改
            while _n<s_height-2:
                _n += 1
                if s_white[_n]>0.05*s_white_max:
                    _start = _n
                    _end = find_theEnd(_start,s_black,s_white,s_black_max,s_white_max,s_height,arg)
                    if _end - _start >5:
                        cjlist = theImg[_start:_end,1:s_width]
                if  _end - _start >5 and _end -_start<80:
                    ImgList.append(cjlist)
                    break
        m = 0
        for i in ImgList:
            cv2.bitwise_not(i,i)#白底黑字转为黑底白字
            if i.shape[0]>=18 and i.shape[0] <120 and i.shape[1]>=18 and i.shape[1]<120:
                i = resize_Img(i)
                cv2.imwrite("C:\\pingpian\\sptest\\"+str(m)+"test.jpg",i)
                theSrc = "C:\\pingpian\\sptest\\"+str(m)+"test.jpg"
                print theSrc
                text = Identify(str(theSrc))
                mystring = str(mystring) + str(text)
                #cv2.imshow('sss',i)
                m = m + 1
        ret = {"message": mystring,"img":composite}
        imgData.message = mystring
        imgData.save()
        return HttpResponse(ret)
    elif message!=None:
        mystring = message
        ret = {"message": mystring, "img": composite}
        return HttpResponse(ret)
    else:
        mystring="failed"
        composite="null"
        ret = {"message": mystring, "img": composite}
        return HttpResponse(ret)
def belend(imgID):
    #方法用于将原图和一张处理图合成为一张图
    #参数是id
    #requset key = imgid  value = imgid值
    #imgid = request.POST.get('imgid')
    beimg = ImageData.objects.get(id = imgID)
    ori = beimg.cu_processed_js
    pro = beimg.cu_js_draw
    #img1 = cv2.imread('F:\pythontest\yuan.jpg')
    #img2 = cv2.imread('F:\pythontest\hb.png')
    img1 = cv2.imread(ori)
    img2 = cv2.imread(pro)

    src_height = img1.shape[0]
    src_width = img1.shape[1]
    dsize = (int(src_width),int(src_height))
    img2 =  cv2.resize(img2,dsize,interpolation=cv2.INTER_AREA)
    name = beimg.name
    # I want to put logo on top-left corner, So I create a ROI
    rows, cols, channels = img2.shape
    roi = img1[0:rows, 0:cols]
    # Now create a mask of logo and create its inverse mask also
    img2gray = cv2.cvtColor(img2, cv2.COLOR_BGR2GRAY)
    ret, mask = cv2.threshold(img2gray, 10, 255, cv2.THRESH_BINARY)
    mask_inv = cv2.bitwise_not(mask)
    # Now black-out the area of logo in ROI
    img1_bg = cv2.bitwise_and(roi, roi, mask=mask_inv)
    # Take only region of logo from logo image.
    img2_fg = cv2.bitwise_and(img2, img2, mask=mask)
    # Put logo in ROI and modify the main image
    dst = cv2.add(img1_bg, img2_fg)
    img1[0:rows, 0:cols] = dst
    cv2.imwrite(r'C:\\pingpian\\ppsystem\\static\\media\\composite\\composite_'+name, img1)
    beimg.se_composite_img = '/static/media/composite/composite_'+name
    beimg.cu_composite_img = r'C:\\pingpian\\ppsystem\\static\\media\\composite\\composite_'+name
    beimg.save()
    cv2.waitKey(0)
    cv2.destroyAllWindows()
    return HttpResponse("ok")
def savapro(request):
    #传入处理图片的id,和处理后的路径
    #用于更新数据库   pro是处理图片
    #前台需要传入一个json字符串 内容是 key=imgid,value = imgid
    imgid = request.POST.get('imgid')
    imgsrc = request.POST.get('imgsrc')
    upimg = ImageData.objects.get(id = imgid)
    upimg.processed_img = imgsrc
    upimg.save()
    return HttpResponse("ok")
@csrf_exempt
def basetoimg(request):
    #原图base64编码转为图片，并且保存 将位置存入数据库
    user_obj=json.loads(request.body.decode())
    basestr = user_obj["base64str"]
    name = user_obj["name"]
    imgjson = {"name":user_obj["name"],"basestr":user_obj["base64str"]}
    print(json.dumps(imgjson))
    return HttpResponse(json.dumps(imgjson), content_type="application/json")
@csrf_exempt
def saveall(request):
    id = request.POST.get('id')#图片id
    message = request.POST.get('message')#识别的文字信息
    print(id)
    blackness = request.POST.get('blackness')#黑度范围
    defects = request.POST.get('defects')#缺陷 是一个json字符串
    print defects
    upimg = ImageData.objects.get(id=id)
    upimg.message = message
    upimg.blackness = blackness
    upimg.defects = defects
    upimg.save()
    return HttpResponse(defects)
@csrf_exempt
def getImg(request):
    num = request.POST.get("num")#第几次请求  第一次 则1   第二次 2
    end =int(num) * 5
    start =int(end) - 5
    # 初始化
    response = []
    imgData =ImageData.objects.order_by('id')[start:end]
    for var in imgData:
        response1 = {'id':str(var.id),'src':str(var.se_original_img)}
        response.append(response1)
    return HttpResponse(json.dumps(response))#返回图片路径  id:src
@csrf_exempt
def saveImg(request):
    if request.method == "POST":
        imgPro = request.FILES.get("proImg")
        imgDraw = request.FILES.get("drawImg")
        #type = request.POST.get("type")#图片类型  pro代表黑度等处理方式 draw代表是 矩形框等照片
        id = request.POST.get("id")##图片id
        #修改后的图片
        upimgPro = ImageData.objects.get(id=id)
        upimgPro.se_processed_js=imgPro
        print(time.strftime('%Y\\\\%m\\\\',time.localtime(time.time())))
        #需要根据项目实际路径进行修改
        upimgPro.cu_processed_js=r"C:\\pingpian\\ppsystem\\static\\media\\pro\\"+str(time.strftime('%Y\\\\%m',time.localtime(time.time())))+"\\\\"+str(upimgPro.se_processed_js)
        upimgPro.save()
        #绘制的图形
        upimgDraw = ImageData.objects.get(id=id)
        upimgDraw.se_js_draw = imgDraw
        #需要根据项目实际路径进行修改
        upimgDraw.cu_js_draw = r"C:\\pingpian\\ppsystem\\static\\media\\jy\\"+str(time.strftime('%Y\\\\%m',time.localtime(time.time())))+"\\\\"+str(upimgDraw.se_js_draw)
        upimgDraw.save()
        belend(id)
    return HttpResponse("ok")












