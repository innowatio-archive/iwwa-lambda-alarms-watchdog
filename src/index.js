import dotenv from "dotenv";
dotenv.load();

import router from "kinesis-router";
import pipeline from "./pipeline/";

export var handler = router()
    .on("element inserted in collection pod-readings", pipeline);
