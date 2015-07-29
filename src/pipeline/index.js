import BPromise from "bluebird";
import {partial, prop} from "ramda";

import * as config from "./common/config";
import * as dynamodb from "./common/dynamodb";
import * as sns from "./common/sns";

var getAlarmsByPod = function getAlarmsByPod (podId) {
    // TODO make the right query
    return dynamodb.query({
        Item: {
            podId: podId
        },
        TableName: config.ALARMS_TABLE_NAME
    }).then(prop("Items"));
};

var check = function check (/* podReading, rule */) {
    // TODO missing rule check
    return true;
};

var trigger = function trigger (podReading, alarm) {
    // TODO does not work
    return BPromise.map(alarm.notifiers, notifier => {
        return sns.publish(notifier);
    });
};

export default function pipeline (event) {
    var podReading = event.data.element;
    return getAlarmsByPod(podReading.podId)
        .filter(partial(check, podReading))
        .map(partial(trigger, podReading));
}
