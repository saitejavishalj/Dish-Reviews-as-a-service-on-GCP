# -*- coding: utf-8 -*-
import json
import collections
import sys
import itertools
from operator import itemgetter
import re



def get_res_info(F) :
    info =[]
    for f in F :
        obj= {}
        obj['business_id']=f['business_id']
        obj['business_city']=f['business_city']
        obj['business_full_address']=f['business_full_address']
        obj['business_categories']=f['business_categories']
        x=f['business_name'] 
        obj['business_name']=re.sub("'", "", x)
            
        info.append(obj)    
    return info
  
        
def grouped_restaurant(f1,key) :
    scorer=[]
    food_list= []
    for line in f1:
        j_line=line
    #          obs.append(j_line)
        if j_line['score'] > 0 :
            food_list+=j_line['served_dishes']
            for s in j_line['served_dishes'] : 
                scorer.append({s:j_line['score']})               
        counter = collections.Counter()
        for d in scorer: 
            counter.update(d)
#        print(counter)
        return {key :counter}


#grouped_res = sorted(reviews, key=itemgetter('business_id'))

def return_json(file) :
    
    response = {}

    reviews=[]
    with open(file, 'r+', encoding='utf-8') as f:
        for line in f:
            j_line=json.loads(line)
            reviews.append(j_line)

    counters=[]
    resturants= []
    F=[]
    for key, value in itertools.groupby(reviews, key=itemgetter('business_id')):
#        print(key)
        f1=[]
        for i in value :
#            print(i)
            f1.append(i)
    #        F.append(i)
#        print(len(f1))
        F.append(f1[0])
        returned_count_each_res= grouped_restaurant(f1,key)
        counters.append(returned_count_each_res)
#        res_arr[key]= returned_count_each_res
#        print(returned_count_each_res)

#        resturants.append(res_arr)
    #counters-- list of individual counts
    
    info_arr =get_res_info(F)
    ind_c=[]
    for c in counters :
        key=list(c.keys())[0]
        res_obj = {}
        d2= [ {i:j} for i,j in list(c.values())[0].items()]
#        res_obj[key] =d2
        res_obj['id'] =key
#        res_obj['name']=''
#        res_obj['business_city']=''
#        res_obj['business_full_address']=''
#        res_obj['business_name']=''
#        res_obj['business_categories']=''
        res_obj['dishes']=d2

        resturants.append(res_obj)
        
    #333
    
        ind_c.append(list(c.values())[0])
        
    
    #combined result   
    t=sum(ind_c, collections.Counter()).most_common(5)
    d = [ {i:j} for i,j in t ]
    response['top_dishes'] =d
    response['top_by_res']=resturants
    response['address']=info_arr
  #  print("total res"+str(len(resturants))
    return response

if __name__ == "__main__": 
   file=sys.argv[1:][0]
   ans=return_json(file)
   print(ans)
   
   
   
