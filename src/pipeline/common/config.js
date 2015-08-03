import dotenv from "dotenv";
dotenv.load();

export var ALARMS_TABLE_NAME = process.env.ALARMS_DYNAMODB_TABLE_NAME;
export var ALARMS_TOPIC_ARN = process.env.ALARMS_SNS_TOPIC_ARN;
export var DEBUG = process.env.DEBUG;
export var TIMEZONE = process.env.TIMEZONE;
