import BPromise from "bluebird";
import chai, {expect} from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";

chai.use(sinonChai);

import pipeline from "pipeline";

describe("`trigger`", function () {

    var trigger = pipeline.__get__("trigger");

    var config = {
        ALARMS_TOPIC_ARN: "0"
    };

    var sns = {
        publish: sinon.stub().returns(BPromise.resolve())
    };

    before(function () {
        pipeline.__Rewire__("sns", sns);
        pipeline.__Rewire__("config", config);
    });

    after(function () {
        pipeline.__ResetDependency__("sns");
        pipeline.__ResetDependency__("config");
    });

    beforeEach(function () {
        sns.publish.reset();
    });

    it("returns a promise", function () {
        var podReading = {};
        var alarm = {
            notifiers: []
        };
        var ret = trigger(podReading, alarm);
        expect(ret).to.be.an.instanceOf(BPromise);
    });

    it("publishes a notification to sns", function () {
        var podReading = {
            id: "0",
            podId: "1",
            date: new Date("2015-08-03").getTime()
        };
        var alarm = {
            name: "Alarm"
        };
        trigger(podReading, alarm);
        expect(sns.publish).to.have.been.calledWith({
            Message: [
                "Pod reading 0",
                "from site 1",
                "triggered alarm Alarm",
                "on Mon, Aug 3, 2015 2:00 AM"
            ].join("\n"),
            Subject: "Triggered alarm",
            TopicArn: "0"
        });
    });

});
