import moment from "moment-timezone";
import {merge, partial, prop} from "ramda";
import sift from "sift";

import * as config from "./common/config";
import * as dynamodb from "./common/dynamodb";
import * as sns from "./common/sns";

var getAlarmsByPod = function getAlarmsByPod (podId) {
    return dynamodb.scan({
        TableName: config.ALARMS_TABLE_NAME,
        ExpressionAttributeValues: {
            podId: {
                S: podId
            }
        },
        FilterExpression: "podId = :podId"
    }).then(prop("Items"));
};

var replaceDate = function replaceDate (podReading) {
    var date = moment(podReading.date);
    return merge(podReading, {
        date: {
            millisecond: date.millisecond(),
            second: date.second(),
            minute: date.minute(),
            hour: date.hour(),
            monthDay: date.date(),
            weekDay: date.isoWeekday(),
            week: date.isoWeek(),
            month: date.month(),
            year: date.year()
        }
    });
};

var check = function check (podReading, rule) {
    podReading = replaceDate(podReading);
    return sift(rule)(podReading);
};

var trigger = function trigger (podReading, alarm) {
    return sns.publish({
        Message: [
            `Pod reading ${podReading.id}`,
            `from site ${podReading.podId}`,
            `triggered alarm ${alarm.name}`,
            `on ${moment(podReading.date).tz(config.TIMEZONE).format("llll")}`
        ].join("\n"),
        Subject: "Triggered alarm",
        TopicArn: config.ALARMS_TOPIC_ARN
    });
};

export default function pipeline (event) {
    var podReading = merge(event.data.element, {
        id: event.data.id
    });
    return getAlarmsByPod(podReading.podId)
        .filter(partial(check, podReading))
        .map(partial(trigger, podReading));
}
