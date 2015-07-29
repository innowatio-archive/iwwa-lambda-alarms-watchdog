import {SNS} from "aws-sdk";
import {promisify} from "bluebird";

var sns = new SNS({
    apiVersion: "2010-03-31"
});

export var publish = promisify(sns.publish, sns);
