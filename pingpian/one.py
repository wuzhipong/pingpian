#coding=utf-8
import os
import cv2
import time
import MySQLdb
import progressbar
from PIL import Image
#print '正在处理数据请稍等...'
def mysql_conn():
	db = MySQLdb.connect("127.0.0.1","root","123456","evaluationsystem",charset='utf8')
	return db
def file_name(file_dir):   
    L=[]#图片完整路径
    for root, dirs, files in os.walk(file_dir):  
        for file in files:  
            if os.path.splitext(file)[1] == '.tif':  
                L.append(file)
    return L
def file_dir(file_dir):   
    L=[]#图片完整路径
    for root, dirs, files in os.walk(file_dir):  
        for file in files:  
            if os.path.splitext(file)[1] == '.tif':  
                L.append(os.path.join(root, file))
    return L
def get_all_file(filename):
    files = glob.glob(filename)
    return files
 
def to_other_file(img_name_list,img_dir_list, type):
    count = 0
    p = progressbar.ProgressBar()
    N = len(img_dir_list)
    p.start(N)
    for img in img_dir_list:
        #print img
        strlen = len(str(img_name_list[count]))
        n = strlen-4
        imgsrc = str(img_name_list[count])[0:n]
        #r_img = Image.open(img)
        r_img = cv2.imread(img)
        #r_img.save(r'D:\\pingpian\\static\\'+imgsrc+'.png')#使用PIL会出现异常，原因未知
        cv2.imwrite(r'D:\\pingpian\\ppsystem\\static\\image\\original\\'+imgsrc+'.png',r_img)
        datastr = imgsrc+'.png'
        db = mysql_conn()
        cursor = db.cursor()
        #将数据插入数据库
        sql = "INSERT INTO ppsystem_imagedata(name,se_original_img,\
               cu_original_img)\
               VALUES('%s','%s','%s')" %\
               (str(imgsrc+'.png'),str(r'/static/image/original/'+imgsrc+'.png')\
               ,str(r'D:\\pingpian\\ppsystem\\static\\image\\original\\'+imgsrc+'.png'))
        try:
            cursor.execute(sql)
            db.commit()
        except:
            db.rollback()
        db.close()
        count += 1
        p.update(count)
    p.finish()
def fileTomysql(dir):
	print 'Just a moment, please.....'
	img_dir_list = file_dir(dir)
	img_name_list= file_name(dir)
	to_other_file(img_name_list,img_dir_list,'png')
filedir = raw_input("please input images dir:   ")
fileTomysql(filedir)
print '\n'+'Completed!'

