# -*- coding: utf-8 -*-
"""
Created on Tue Apr 20 20:51:47 2021

@author: Sai Teja Vishal J
"""
import pymongo
from pymongo import MongoClient
#!pip install pymongo
import pandas as pd
# df = pd.read_csv (r'yelp_reviews.csv')
p1= pd.read_csv (r'yelp_reviews.csv')

p1=p1.iloc[0:500,:]
d1 = []

for index, row in p1.iterrows():
    d = row.to_dict()
    d['_id']=d['review_id']
    d1.append(d)

print(d1)


client = pymongo.MongoClient("mongodb+srv://admin:root@cluster0.jhmx0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")
db = client['reviews']
collection=db['yelp-reviews']
collection.insert_many(d1)