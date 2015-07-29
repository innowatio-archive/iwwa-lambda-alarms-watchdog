import BPromise from "bluebird";
import chai, {expect} from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";

chai.use(sinonChai);

import pipeline from "pipeline";

describe("`trigger`", function () {

    var trigger = pipeline.__get__("trigger");

    var sns = {
        publish: sinon.spy()
    };

    before(function () {
        pipeline.__Rewire__("sns", sns);
    });

    after(function () {
        pipeline.__ResetDependency__("sns");
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

    it("for each notifier publishes a notification to sns", function () {
        var podReading = {};
        var alarm = {
            notifiers: [0, 1, 2]
        };
        return trigger(podReading, alarm)
            .then(function () {
                expect(sns.publish).to.have.callCount(3);
                expect(sns.publish).to.have.been.calledWith(0);
                expect(sns.publish).to.have.been.calledWith(1);
                expect(sns.publish).to.have.been.calledWith(2);
            });
    });

});
