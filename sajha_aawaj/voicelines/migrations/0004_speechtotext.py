# Generated by Django 2.2.14 on 2022-03-07 07:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('voicelines', '0003_nepalitextcollection'),
    ]

    operations = [
        migrations.CreateModel(
            name='SpeechToText',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('audiofile', models.FileField(blank=True, null=True, upload_to='voicelines/')),
                ('text', models.CharField(blank=True, max_length=1000, null=True)),
            ],
        ),
    ]
