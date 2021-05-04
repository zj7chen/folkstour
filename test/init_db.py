#!/usr/bin/env python3

from pathlib import Path
import base64
# https://pypi.org/project/requests/
import requests
# https://pypi.org/project/mysql-connector-python/
import mysql.connector

test_d = Path(__file__).parent
host = 'http://localhost:3000'

print('clearing database')
tables = [
    'Reservation',
    'TripLocation',
    'TripTransport',
    'Trip',
    'Image',
    'User',
]
connection = mysql.connector.connect(user='root', database='tripdb')
for table in tables:
    cursor = connection.cursor()
    cursor.execute(f'delete from {table}')
    cursor.close()
connection.commit()
connection.close()

print('inserting test data')
s = requests.Session()
s.post(f'{host}/api/signup', json={
    'email': 'john@example.com',
    'password': '123456',
    'name': 'John Smith',
    'gender': 'MALE',
})
s.post(f'{host}/api/update-profile', json={
    'avatar': base64.b64encode((test_d / 'john.png').read_bytes()).decode('ascii'),
    'selfIntro': '''\
The first sentence of your self-introduction should include your name and job
title or experience. If you’re unemployed and seeking a job, you might mention
your educational degree, certification level or current place in your job
search. For example:

- “My name is Jordan Lin, and I’m a recent computer science graduate from
Stanford University.”
- “I’m Avery Lucas, and I’m seeking an entry-level warehousing job that will use
my organization, attention to detail and time management skills.”
- “My name is Rylan Curtis, and I’m chief engineer for Jacobs and Associates.”
'''
})
s.post(f'{host}/api/create-trip', json={
    'locations': [
        {'country': 'Canada', 'province': 'Ontario', 'city': 'Toronto'},
        {'country': 'Canada', 'province': 'Ontario', 'city': 'Waterloo'},
    ],
    'dates': {
        'start': '2021-06-07',
        'end': '2021-06-10',
    },
    'transports': ['DRIVING', 'TREKKING'],
    'title': 'Head to the North',
    'description': '''\
Customize this part of the introduction to highlight the details most relevant
to the person you’re speaking to. If you’re in a job interview, discuss your
professional skills and accomplishments. If you’re giving a presentation, offer
information that supports your authority in the area you’re speaking on. When
you’re introducing yourself to a potential client, mention your products and
services.
''',
    'teamSize': 'ONE_THREE',
    'expense': 300,
    'gender': 'ANY',
})
s.post(f'{host}/api/signup', json={
    'email': 'chifanle@example.com',
    'password': '123456',
    'name': '传奇世界你和我',
    'gender': 'FEMALE',
})
s.post(f'{host}/api/update-profile', json={
    'avatar': base64.b64encode((test_d / 'wonder.png').read_bytes()).decode('ascii'),
    'selfIntro': '''
工作学习：91年射手座，180,135，本科，外企部门经理，工作繁忙，收入波动，奖金稀少，经常加班，常常应酬。即使目前一切劳碌，也没有停止寻找爱情，始终在为能够创造更美好的生活努力生活着。

由于之前一直在苏州工作，所以家务能力一般(为什么说是一般呢，因为谦虚是美德)。愿意分担家务，分享快乐，懂得平和待人，有抽烟喝酒打游戏等不良嗜好。没有嫖娼赌博等兴趣爱好。有一个很痛恨自己的缺点，就是喜欢整洁干净简单。为什么痛恨，因为发现很多人都比较不爱干净，我希望我脏一点，这样才可以同流合污，比较接地气，对于气质方面，我喜欢装。装出一副，我很简单很富有，整个人很有质感很有调性，其实我可复杂了，装逼的感觉真好

　　出生苏州，农村户口，拆迁户家庭，传说中的拆二代，家中独子。从小懒惰不爱学习，有很多娇生惯养的恶习。我的外号是妈宝男，也很享受别人称呼我为妈宝男。

　　经济方面：房车都不是自己努力买的。我买了很多房子，我没有掏一分钱，我还挺骄傲的

　　对另一半的要求：希望你爱喝酒比较宅，脾气暴躁，感情经历复杂，对生活无品味，爱吃大蒜

　　内心也渴望一份轰轰烈烈的情感，期待理想中的你能够早日出现。正如豆芽所说：老子脾气暴躁，但是老子爱你
'''
})
s.post(f'{host}/api/create-trip', json={
    'locations': [
        {'country': 'Canada', 'province': 'Ontario', 'city': 'Burlington'},
        {'country': 'Canada', 'province': 'Ontario', 'city': 'London'},
        {'country': 'Canada', 'province': 'Ontario', 'city': 'Cambridge'},
    ],
    'dates': {
        'start': '2021-06-09',
        'end': '2021-06-12',
    },
    'transports': ['CYCLING'],
    'title': '乾隆写秦始皇的诗怎么样，烂不烂？',
    'description': '''\
中国朝代顺序：伟大的上古九洲、虞朝、夏朝、商朝、周朝、春秋、东周、战国、秦、陕西汉、三国、西晋、东晋、前秦、隋、唐、五代十国、北宋、南宋、元、清。
''',
    'teamSize': 'FOUR_SIX',
    'expense': 1000,
    'gender': 'ANY',
})
