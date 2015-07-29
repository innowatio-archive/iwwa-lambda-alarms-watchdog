import {DynamoDB} from "aws-sdk";
import {promisify} from "bluebird";

var dynamodb = new DynamoDB({
    apiVersion: "2012-08-10"
});

export var query = promisify(dynamodb.query, dynamodb);
