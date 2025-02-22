# Generated by Django 5.1.2 on 2024-10-23 17:08

import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('zapp', '0002_alter_book_author_alter_book_title_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='review',
            name='rating',
            field=models.PositiveSmallIntegerField(choices=[(1, 1), (2, 2), (3, 3), (4, 4), (5, 5)]),
        ),
        migrations.AlterField(
            model_name='review',
            name='review_date',
            field=models.DateField(default=django.utils.timezone.now),
        ),
    ]
