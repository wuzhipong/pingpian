"""pingpian URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.11/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url
from django.contrib import admin
from ppsystem import views
urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^index/', views.index),
    url(r'^upload/', views.upload),
    url(r'^saveImg/',views.saveImg,name="saveImg"),
    url(r'^getImg/',views.getImg,name="getImg"),
    #url(r'^',views.index),
    url(r'^redemo/',views.redemo),
    url(r'^myajax/',views.myajax,name="maya"),
    url(r'^split/',views.split,name="split"),
    url(r'^belend/',views.belend,name="belend"),
    url(r'^basetoimg/',views.basetoimg,name="basetoimg"),
    url(r'^saveall/',views.saveall,name="saveall")
]
