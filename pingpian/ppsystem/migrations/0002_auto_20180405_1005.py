# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2018-04-05 02:05
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ppsystem', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='image',
            name='defects',
            field=models.CharField(max_length=100, null=True, verbose_name='\u7f3a\u9677'),
        ),
    ]
