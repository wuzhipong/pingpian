# -*- coding: utf-8 -*-
# Generated by Django 1.11.10 on 2018-04-11 15:09
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ppsystem', '0006_auto_20180411_2147'),
    ]

    operations = [
        migrations.AlterField(
            model_name='imagedata',
            name='se_js_draw',
            field=models.ImageField(null=True, upload_to='jy/%Y/%m'),
        ),
    ]
