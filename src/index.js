import router from "kinesis-router";
import pipeline from "./pipeline/";

export var handler = router()
    .on("/pod-reading/insert", pipeline);
