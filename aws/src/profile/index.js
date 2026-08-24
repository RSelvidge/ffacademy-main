const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, GetCommand, PutCommand } = require("@aws-sdk/lib-dynamodb");

const doc = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const TABLE = process.env.TABLE_NAME;

function getUserId(event) {
  // API Gateway HTTP API JWT authorizer puts claims here
  return event.requestContext.authorizer.jwt.claims.sub;
}

exports.handler = async (event) => {
  const userId = getUserId(event);
  if (!userId) {
    return { statusCode: 401, body: JSON.stringify({ error: "unauthorized" }) };
  }

  try {
    if (event.routeKey === "GET /profile") {
      const result = await doc.send(new GetCommand({ TableName: TABLE, Key: { userId } }));
      return {
        statusCode: 200,
        body: JSON.stringify(result.Item ?? { userId, email: event.requestContext.authorizer.jwt.claims.email }),
      };
    }

    if (event.routeKey === "PUT /profile") {
      const body = JSON.parse(event.body || "{}");
      // Never let the client overwrite its own identity
      const profile = { ...body, userId, email: event.requestContext.authorizer.jwt.claims.email, updated_at: new Date().toISOString() };
      await doc.send(new PutCommand({ TableName: TABLE, Item: profile }));
      return { statusCode: 200, body: JSON.stringify(profile) };
    }

    return { statusCode: 404, body: JSON.stringify({ error: "not found" }) };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ error: "internal error" }) };
  }
};
