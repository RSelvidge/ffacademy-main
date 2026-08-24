const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  QueryCommand,
  PutCommand,
  UpdateCommand,
  DeleteCommand,
} = require("@aws-sdk/lib-dynamodb");

const doc = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const TABLE = process.env.TABLE_NAME;

function getUserId(event) {
  return event.requestContext.authorizer.jwt.claims.sub;
}

function connectionIdFrom(event) {
  return event.pathParameters?.connectionId;
}

exports.handler = async (event) => {
  const userId = getUserId(event);
  if (!userId) {
    return { statusCode: 401, body: JSON.stringify({ error: "unauthorized" }) };
  }

  try {
    switch (event.routeKey) {
      case "GET /connections": {
        const result = await doc.send(
          new QueryCommand({ TableName: TABLE, KeyConditionExpression: "userId = :uid", ExpressionAttributeValues: { ":uid": userId } })
        );
        return { statusCode: 200, body: JSON.stringify(result.Items.map((i) => ({ ...i, id: i.connectionId }))) };
      }
      case "POST /connections": {
        const body = JSON.parse(event.body || "{}");
        const connectionId = body.connectionId || require("crypto").randomUUID();
        const item = { ...body, id: connectionId, connectionId, userId, created_at: new Date().toISOString() };
        await doc.send(new PutCommand({ TableName: TABLE, Item: item }));
        return { statusCode: 201, body: JSON.stringify(item) };
      }
      case "PUT /connections/{connectionId}": {
        const connectionId = connectionIdFrom(event);
        const body = JSON.parse(event.body || "{}");
        // Build an update expression from the top-level keys sent by the client
        const entries = Object.entries(body).filter(([k]) => !["userId", "connectionId"].includes(k));
        if (entries.length === 0) return { statusCode: 400, body: JSON.stringify({ error: "nothing to update" }) };
        const names = {};
        const values = {};
        const sets = entries.map(([k], i) => {
          names[`#k${i}`] = k;
          values[`:v${i}`] = entries[i][1];
          return `#k${i} = :v${i}`;
        });
        values[":uid"] = userId;
        values[":cid"] = connectionId;
        const result = await doc.send(
          new UpdateCommand({
            TableName: TABLE,
            Key: { userId, connectionId },
            UpdateExpression: `SET ${sets.join(", ")}`,
            ExpressionAttributeNames: names,
            ExpressionAttributeValues: values,
            ConditionExpression: "userId = :uid AND connectionId = :cid",
            ReturnValues: "ALL_NEW",
          })
        );
        return { statusCode: 200, body: JSON.stringify(result.Attributes) };
      }
      case "DELETE /connections/{connectionId}": {
        await doc.send(
          new DeleteCommand({
            TableName: TABLE,
            Key: { userId, connectionId: connectionIdFrom(event) },
            ConditionExpression: "userId = :uid",
            ExpressionAttributeValues: { ":uid": userId },
          })
        );
        return { statusCode: 204, body: "" };
      }
      default:
        return { statusCode: 404, body: JSON.stringify({ error: "not found" }) };
    }
  } catch (err) {
    if (err.name === "ConditionalCheckFailedException") {
      return { statusCode: 404, body: JSON.stringify({ error: "not found" }) };
    }
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ error: "internal error" }) };
  }
};
