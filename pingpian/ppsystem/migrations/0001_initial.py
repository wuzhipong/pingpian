# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2018-04-05 02:00
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Image',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('orginal_img', models.ImageField(default='original/default.png', upload_to='original/%Y/%m')),
                ('processed_img', models.ImageField(default='processed/default.png', upload_to='processed/%Y/%m')),
                ('composite_img', models.ImageField(default='composite/default.png', upload_to='composite/%Y/%m')),
                ('blackness', models.CharField(max_length=32, null=True)),
                ('defects', models.CharField(default='', max_length=100, verbose_name='\u7f3a\u9677')),
                ('message', models.TextField(null=True, verbose_name='\u6587\u5b57\u4fe1\u606f')),
                ('line_num', models.TextField(null=True, verbose_name='\u7ba1\u7ebf\u53f7')),
                ('joint_num', models.TextField(null=True, verbose_name='\u710a\u53e3\u53f7')),
                ('film_num', models.TextField(null=True, verbose_name='\u5e95\u7247\u53f7')),
            ],
            options={
                'verbose_name': '\u56fe\u7247\u4fe1\u606f',
                'verbose_name_plural': '\u56fe\u7247\u4fe1\u606f',
            },
        ),
    ]
