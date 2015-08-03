import dotenv from "dotenv";

import router from "kinesis-router";
import pipeline from "./pipeline/";

dotenv.load();

export var handler = router()
    .on("element inserted in collection pod-readings", pipeline);
