# -*- coding: utf-8 -*-
#{
#  "annotations": [
#     {
#      "text_extraction": {
#         "text_segment": {
#            "end_offset": 1, "start_offset": 1
#          }
#       },
#       "display_name": "DSFSDF"
#     },
#     {
#       "text_extraction": {
#          "text_segment": {
#             "end_offset": 1, "start_offset": 1
#           }
#        },
#        "display_name": "SDF"
#     },
#
#  ],
#  "text_snippet":
#    {"content": "DSfds"}
#}
import json
  
# Opening JSON file
f = open('data.json',)
  
# returns JSON object as 
# a dictionary
data = json.load(f)
datasample=data['rasa_nlu_data']['common_examples']
##################

ArrayOfOb=[]

for x in datasample :
#    x=datasample[1] 
    obj={}
    obj['annotations'] =[]
    obj['text_snippet'] ={}
    
    arrOfEnt=[]
    for k in x['entities'] :  #annotations
        
        obj_e={}
        obj_e["text_extraction"]={}
        
        obj_e["text_extraction"]["text_segment"]={}
        obj_seg={}
        obj_seg['start_offset']=k['start']
        obj_seg['end_offset']=k['end']
        
        obj_e["text_extraction"]["text_segment"]=obj_seg
    
    
        obj_e["display_name"]=k['entity']
        
        arrOfEnt.append(obj_e)
        obj['annotations']=arrOfEnt
        
    
        print(k['end'])
        print(k['start'])
        print(k['entity'])#
    obj['text_snippet']["content"]=x['text']
    ArrayOfOb.append(obj)    
    print(x['text'])
        


import json


with open('dataset.json', 'w') as json_file:
  json.dump(ArrayOfOb, json_file)
    
    
import json
f = open('dataset.json',)
  
# returns JSON object as 
# a dictionary
JSON_file = json.load(f)
with open('output.jsonl', 'w') as outfile:
    for entry in JSON_file:
        json.dump(entry, outfile)
        outfile.write('\n')
 
   



