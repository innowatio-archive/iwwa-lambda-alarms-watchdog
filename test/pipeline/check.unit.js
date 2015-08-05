import chai, {expect} from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";

chai.use(sinonChai);

import pipeline from "pipeline";

describe("`check`", function () {

    var check = pipeline.__get__("check");

    var filter = sinon.stub();
    var sift = sinon.stub().returns(filter);

    before(function () {
        pipeline.__Rewire__("sift", sift);
    });

    after(function () {
        pipeline.__ResetDependency__("sift");
    });

    afterEach(function () {
        filter.reset();
        sift.reset();
    });

    it("should filter the pod reading through sift", function () {
        var podReading = {
            date: new Date("2015-08-03T00:00:00.000Z").getTime()
        };
        var alarm = {
            rule: "{}"
        };
        check(podReading, alarm);
        expect(sift).to.have.been.calledWith({});
        expect(filter).to.have.callCount(1);
    });

    it("should convert the pod reading date to a \"comparable\" date format", function () {
        var podReading = {
            date: new Date("2015-08-03T00:00:00.000Z").getTime()
        };
        var alarm = {
            rule: "{}"
        };
        check(podReading, alarm);
        expect(filter).to.have.been.calledWith({
            date: {
                hour: 0,
                millisecond: 0,
                minute: 0,
                month: 7,
                monthDay: 3,
                second: 0,
                week: 32,
                weekDay: 1,
                year: 2015
            }
        });
    });

});
