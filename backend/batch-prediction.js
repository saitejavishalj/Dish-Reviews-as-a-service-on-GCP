/**
 * TODO(developer): Uncomment these variables before running the sample.
 */
const projectId = 'sixth-syntax-309905';
 const location = 'us-central1';
 const modelId = 'TEN1089794144009715712';
 const inputUri = 'gs://bucket_for_reviews/350.jsonl';
 const outputUri = 'gs://bucket_for_reviews/';

// Imports the Google Cloud AutoML library
const {PredictionServiceClient} = require('@google-cloud/automl').v1;

// Instantiates a client
const client = new PredictionServiceClient();

async function batchPredict() {
  // Construct request
  const request = {
    name: client.modelPath(projectId, location, modelId),
    inputConfig: {
      gcsSource: {
        inputUris: [inputUri],
      },
    },
    outputConfig: {
      gcsDestination: {
        outputUriPrefix: outputUri,
      },
    },
  };

  const [operation] = await client.batchPredict(request);

  console.log('Waiting for operation to complete...');
  // Wait for operation to complete.
  const [response] = await operation.promise();
  console.log(
    `Batch Prediction results saved to Cloud Storage bucket. ${response}`
  );
}

batchPredict();