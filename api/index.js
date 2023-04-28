
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { PutCommand } from "@aws-sdk/lib-dynamodb";

const REGION = "us-west-1";
const ddbClient = new DynamoDBClient({ region: REGION });

const marshallOptions = {
  // Whether to automatically convert empty strings, blobs, and sets to `null`.
  convertEmptyValues: false, // false, by default.
  // Whether to remove undefined values while marshalling.
  removeUndefinedValues: true, // false, by default.
  // Whether to convert typeof object to map attribute.
  convertClassInstanceToMap: false, // false, by default.
};

const unmarshallOptions = {
  // Whether to return numbers as a string instead of converting them to native JavaScript numbers.
  wrapNumbers: false, // false, by default.
};

// Create the DynamoDB document client.
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient, {
  marshallOptions,
  unmarshallOptions,
});


export const handler = async (event) => {
  console.log('Request event: ', event)
  const { requestContext, body, queryStringParameters } = event
  let response;

  switch (requestContext.http.method) {
    case 'GET':
      if (requestContext.http.path === '/healthCheck') {
        response = {
          statusCode: 200,
          body: JSON.stringify('bad-math-api is up'),
        };
      }
      else if (requestContext.http.path === '/scores') {
        const gameType  = queryStringParameters?.gameType
        if (gameType) {
          response = await fetchAllScoresByType(response, gameType);
        } else {
          response = await fetchAllScores(response);
        }
      }
      break
    case 'POST':
      if (requestContext.http.path === '/score') {
        response = await saveScore(body, response);
      }
      break;
    default:
      response = {
        statusCode: 404,
        body: JSON.stringify('endpoint not found'),
      };
  }
  return response;
};

async function saveScore(body, response) {
  const params = {
    TableName: 'bad-math-score',
    Item: { ...JSON.parse(body) }
  };
  console.log('params', params);

  try {
    const data = await ddbDocClient.send(new PutCommand(params));
    console.log("Success - item added or updated", data);
    response = {
      statusCode: 201,
      body: "Success - item added or updated"
    };
  } catch (err) {
    console.log('error', err);
    response = {
      statusCode: 500,
      body: err
    };
  }
  return response;
}

async function fetchAllScores(response) {
  const params = {
    TableName: "bad-math-score",
  };

  response = await scanDocument(params, response);
  return response;
}

async function fetchAllScoresByType(response, gameType) {
  const params = {
    TableName: "bad-math-score",
    FilterExpression: "#T = :T",
    ExpressionAttributeValues: {
      ":T": `${gameType}`
    },
    ExpressionAttributeNames: {
      "#T": "gameType",
    },
  };

  response = await scanDocument(params, response);
  return response;
}

async function scanDocument(params, response) {
  try {
    const data = await ddbDocClient.send(new ScanCommand(params));
    console.log("success", data.Items);
    response = {
      statusCode: 200,
      body: JSON.stringify(data.Items)
    };
  } catch (err) {
    console.log("Error", err);
    response = {
      statusCode: 500,
      body: err
    };
  }
  return response;
}

