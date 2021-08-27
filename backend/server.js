const express = require('express');
const yelp = require("yelp-fusion");
const {MongoClient} = require('mongodb');
const app = express();

 const projectId = 'sixth-syntax-309905';
 const location = 'us-central1';
 const modelId = 'TEN1089794144009715712';
// Allocating os module
const os = require('os');


const apiKey =
  "0RdOkkjzxbukiMVs0sWqd2Cdzi3FM-_vREfMw9X8HVyFQ2a_g4pDrY5UeOxQMfyqXVrLTJnSEquTdUAU0hlDJvmoq0sCYNMU5C_eOGjR4JpzIj3uhhRQz0Jp-tNjYHYx";

const client = yelp.client(apiKey);
 const {PredictionServiceClient} = require('@google-cloud/automl').v1;
// Instantiates a client
const predClient = new PredictionServiceClient();

let businesses= [];

app.get('/', (req, res) => {
  res.send(os.tmpdir());

});
var fs = require('fs');
 var logger = fs.createWriteStream(os.tmpdir()+'/testRun.jsonl',{flags: 'w'})
app.get('/sendLatLong', (req, res) => {
 logger = fs.createWriteStream(os.tmpdir()+'/testRun.jsonl',{flags: 'w'})
  const latitude = req.query.lat;
  const longitude = req.query.long;
  if(longitude == undefined){
      longitude= -111.941254;
  }
  console.log('location',latitude+"   "+longitude);

  const searchRequest = {
  latitude:latitude,
  longitude:longitude,
  radius:40000,
  limit:10,
  sort_by: "review_count",
};
function andThenThis(out){
    logger.end();
    res.setHeader('Content-Type', 'application/json');
       res.send(out);

    //res.json(JSON.parse(out));
}

  client
  .search(searchRequest)
  .then((response) => {
    businesses = response.jsonBody.businesses;
    doThis(andThenThis)
    
  })
  .catch((e) => {
    console.log(e);
  });
  
});

async function doThis(callback){
    let predictedOutput = await connectToMongo().catch(console.error);
    console.log(predictedOutput+"do This");
    callback(predictedOutput);
}



// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
async function connectToMongo(){

    const uri = "mongodb+srv://admin:root@cluster0.jhmx0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
    const mclient = new MongoClient(uri);
    try {
        // Connect to the MongoDB cluster
        await mclient.connect();
        let predictedOutput = await getReviews(mclient);
        return predictedOutput;
    } catch (e) {
        console.error(e);
    } finally {
        await mclient.close();
    }
}

async function getReviews(client,id){
    for(let i=0;i<businesses.length;i++){
        let cursor = client.db("reviews").collection("yelp-reviews").find({'business_name' : {$regex : ".*"+businesses[i].name+".*"}});
        let results = await cursor.toArray();
        console.log(results.length);
        let outArray = [];
        if(results.length>0){
            for(let j=0;j<5;j++){
            let output = {"id":"","text_snippet":{"content":""},"stars" : 0,"business_id":"","business_city":"","business_full_address":"","business_categories":"","business_name":"","served_dishes" : [],"_id":""};
            output.id = results[j].review_id;
            output["_id"]=results[j].review_id;
            output.text_snippet.content= results[j].text;
            console.log(output.text_snippet.content);
            output.stars=results[j].stars;
            output.business_city=results[j].business_city;
            output.business_categories = results[j].business_categories;
            output.business_full_address=results[j].business_full_address;
            output.business_name = results[j].business_name;
            output.business_id=results[j].business_id;
            //outArray.push(results[j].text)
            console.log("in in");
            let out = await predict(output);
            console.log(out);
            }
        }
        
       // console.log(outArray);
     

  
    }
    let predictedOutput = await pythonRun(os.tmpdir()+'/testRun.jsonl');
    console.log(predictedOutput+"ingetReviews");
    return predictedOutput;
}

async function predict(data) {
  // Construct request
  content=data.text_snippet.content
  const request = {
    name: predClient.modelPath(projectId, location, modelId),
    payload: {
      textSnippet: {
        content: content,
        mimeType: 'text/plain', // Types: 'test/plain', 'text/html'
      },
    },
  };


  const [response] = await predClient.predict(request);
  console.log(response.payload+"predict");
  var dishes = []

  for (const annotationPayload of response.payload) {
    if(annotationPayload.displayName!='served_dish')
           continue;

    // console.log(
    //   `Text Extract Entity Types: ${annotationPayload.displayName}`
    // );
   // console.log(`Text Score: ${annotationPayload.textExtraction.score}`);
    const textSegment = annotationPayload.textExtraction.textSegment;
   // console.log(`Text Extract Entity Content: ${textSegment.content}`);
    dishes.push(textSegment.content)
    // console.log(`Text Start Offset: ${textSegment.startOffset}`);
    // console.log(`Text End Offset: ${textSegment.endOffset}`);

  }





data['served_dishes']=dishes;
    //data['score'] =0.00000

  //data['score'] = quickstart(content)

  data['score'] = await quickstart(data.text_snippet.content)
  //console.log(data['score'] + "--" + data.text_snippet.content)
   logger.write( JSON.stringify(data)+" \n")
   console.log(data['score']+"check2");

   return JSON.stringify(data);



    //logger.write( JSON.stringify(data)+" \n")
//     ner_output_arr.push(data)
//  logger.write(ner_output_arr.map(x=>JSON.stringify(x)).join('\n'))

}

async function quickstart(text) {
  // Imports the Google Cloud client library
  const language = require('@google-cloud/language');

  // Instantiates a client
  const client = new language.LanguageServiceClient();

  // The text to analyze
  //const text = 'food is good!';

  const document = {
    content: text,
    type: 'PLAIN_TEXT',
  };

  // Detects the sentiment of the text
  const [result] = await client.analyzeSentiment({document: document});
  const sentiment = result.documentSentiment;

  //console.log(`Text: ${text}`);
  //console.log(`Sentiment score: ${sentiment.score}`);
  //console.log(`Sentiment magnitude: ${sentiment.magnitude}`);
  return sentiment.score
}

async function pythonRun(path){
    console.log(path)
    const spawn = require("child_process").spawn;
    return new Promise(function(resolve,reject){
      let pythonProcess = spawn('python3',["counter_score2.py",path]);
    pythonProcess.stdout.on('data', (data) => { 
      // Do something with the data returned from python script
    //  console.log(data.toString() +"ooo");
      
      predictedOutput = data.toString();
      console.log(predictedOutput+"pythonRun");
      resolve(data.toString());
     });
     pythonProcess.stderr.on('data',(data)=>{
         console.log(data.toString());
     });
    })
  }