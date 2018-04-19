# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models

# Create your models here.
class ImageData(models.Model):
    name = models.CharField(max_length = 50,verbose_name = u"图片名",default='/%Y/%M/%d/%h/%m/s')
    #original_img = models.ImageField(upload_to='original/%Y/%M',default=u"original/default.png")#原图
    #processed_img = models.ImageField(upload_to='processed/%Y/%M',default=u"processed/default.png")#处理图
    #composite_img = models.ImageField(upload_to='composite/%Y/%M',default=u"composite/default.png")#合成图
    se_original_img = models.CharField(max_length=100,null=True)#原图服务器路径
    cu_original_img = models.CharField(max_length=100,null=True)#原图本机路径
    #se_processed_js = models.CharField(max_length=100,null=True)#js处理图片服务器路径
    se_processed_js = models.ImageField(upload_to='pro/%Y/%m',null=True)#js处理图片服务器路径
    cu_processed_js = models.CharField(max_length=100,null=True)#js处理图片本机路径
    #se_js_draw = models.CharField(max_length=100,null=True)#js处理的矩形图片服务器路径
    se_js_draw = models.ImageField(upload_to='jy/%Y/%m',null=True)#js处理的矩形图片服务器路径
    cu_js_draw = models.CharField(max_length=100,null=True)#js处理的举行图片本机路径
    se_composite_img = models.CharField(max_length=100,null=True)#处理完成图片服务器路径
    cu_composite_img = models.CharField(max_length=100,null=True)#处理完成图片本机路径
    blackness = models.CharField(max_length = 32,null=True)#黑度范围
    defects = models.TextField(verbose_name = u"缺陷",null=True)#缺陷
    message = models.TextField(null=True,verbose_name=u"文字信息")#识别文字信息
    line_num = models.TextField(null=True,verbose_name =u"管线号")#管线号
    joint_num = models.TextField(null=True, verbose_name=u"焊口号")#焊口号
    film_num = models.TextField(null=True, verbose_name=u"底片号")#底片号
    class Meta:
        verbose_name = "图片信息"
        verbose_name_plural = verbose_name







