async function quickstart(review) {
  // Imports the Google Cloud client library
  const language = require('@google-cloud/language');

  // Instantiates a client
  const client = new language.LanguageServiceClient();

  // The text to analyze
  const text = review

  const document = {
    content: text,
    type: 'PLAIN_TEXT',
  };

  // Detects the sentiment of the text
  const [result] = await client.analyzeSentiment({document: document});
  const sentiment = result.documentSentiment;

  //console.log(`Text: ${text}`);
 // console.log(`Sentiment score: ${sentiment.score}`);
  //console.log(`Sentiment magnitude: ${sentiment.magnitude}`);

  return sentiment.score
}


(async () => {
  score_val = await quickstart("food is good")
  console.log(score_val + "--" + "---")
})().catch( e => { console.error(e) })
