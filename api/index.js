
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
  // console.log('body', body)

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
  const newItem = {...JSON.parse(body), date: Date.now()};
  console.log('new Item', newItem)
  const params = {
    TableName: 'bad-math-score',
    Item: newItem
  };
  console.log('params', params);

  try {
    const data = await ddbDocClient.send(new PutCommand(params));
    console.log("Success - item added or updated", data);
    response = {
      statusCode: 201,
      body: {message: JSON.stringify("Success - item added or updated")}
    };
  } catch (err) {
    console.log('error', err);
    response = {
      statusCode: 500,
      body: {message: JSON.stringify(err)}
    };
  }
  console.log("response", response)
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
  const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000)
  console.log(sevenDaysAgo)
  const sevenDaysParams = {
    TableName: "bad-math-score",
    ScanIndexForward: false,
    FilterExpression: "#T = :T and #D > :D",
    ExpressionAttributeValues: {
      ":T": `${gameType}`,
      ":D": sevenDaysAgo
    },
    ExpressionAttributeNames: {
      "#T": "gameType",
      "#D": "date",
    },
  };

  const lastSevenDays = await scanDocument(sevenDaysParams, response);
  const filteredlastSevenDays = JSON.parse(lastSevenDays.body);
  if (filteredlastSevenDays) {
    filteredlastSevenDays.sort((a,b) => b.score - a.score)
  }
  // figure out how to build approopriate body 
  
  const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000)
  console.log(thirtyDaysAgo)
  const thirtyDaysParams = {
    TableName: "bad-math-score",
    FilterExpression: "#T = :T and #D > :D",
    ExpressionAttributeValues: {
      ":T": `${gameType}`,
      ":D": thirtyDaysAgo
    },
    ExpressionAttributeNames: {
      "#T": "gameType",
      "#D": "date",
    },
  };

  const lastThirtDays = await scanDocument(thirtyDaysParams, response);
  const filteredlastThirtyDays = JSON.parse(lastThirtDays.body);
  if (filteredlastThirtyDays) {
    filteredlastThirtyDays.sort((a,b) => b.score - a.score)
  }
  
  
  const oneDayAgo = Date.now() - (1 * 24 * 60 * 60 * 1000)
  console.log(oneDayAgo)
  const oneDayParams = {
    TableName: "bad-math-score",
    FilterExpression: "#T = :T and #D > :D",
    ExpressionAttributeValues: {
      ":T": `${gameType}`,
      ":D": oneDayAgo
    },
    ExpressionAttributeNames: {
      "#T": "gameType",
      "#D": "date",
    },
  };

  const lastDay = await scanDocument(oneDayParams, response);
  const filteredlastDay = JSON.parse(lastDay.body);
  if (filteredlastDay) {
    filteredlastDay.sort((a,b) => b.score - a.score)
  }
  
  response = {lastSevenDays: filteredlastSevenDays.slice(0, 10),
    lastThirtyDays: filteredlastThirtyDays.slice(0, 10),
    lastDay: filteredlastDay.slice(0, 10)
  }
  
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

