import BPromise from "bluebird";
import chai, {expect} from "chai";
import chaiAsPromised from "chai-as-promised";
import sinon from "sinon";
import sinonChai from "sinon-chai";

chai.use(chaiAsPromised);
chai.use(sinonChai);

import pipeline from "pipeline";

describe("`getAlarmsByPod`", function () {

    var getAlarmsByPod = pipeline.__get__("getAlarmsByPod");

    var config = {
        ALARMS_TABLE_NAME: "TABLE_NAME"
    };

    var dynamodb = {
        scan: sinon.stub().returns(BPromise.resolve({
            Items: [0, 1, 2]
        }))
    };

    before(function () {
        pipeline.__Rewire__("config", config);
        pipeline.__Rewire__("dynamodb", dynamodb);
    });

    after(function () {
        pipeline.__ResetDependency__("config");
        pipeline.__ResetDependency__("dynamodb");
    });

    beforeEach(function () {
        dynamodb.scan.reset();
    });

    it("returns a promise", function () {
        var ret = getAlarmsByPod("podId");
        expect(ret).to.be.an.instanceOf(BPromise);
    });

    it("queries dynamodb", function () {
        getAlarmsByPod("podId");
        expect(dynamodb.scan).to.have.been.calledWith({
            ExpressionAttributeValues: {
                podId: {
                    S: "podId"
                }
            },
            FilterExpression: "podId = :podId",
            TableName: "TABLE_NAME"
        });
    });

    it("returns an array (of items retrieved from dynamodb)", function () {
        var ret = getAlarmsByPod("podId");
        expect(ret).to.eventually.eql([0, 1, 2]);
    });

});
