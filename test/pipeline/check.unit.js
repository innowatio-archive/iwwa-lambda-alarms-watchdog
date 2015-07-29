import chai, {expect} from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";

chai.use(sinonChai);

import pipeline from "pipeline";

describe("`check`", function () {

    var check = pipeline.__get__("check");

    it("TODO (returns true for now)", function () {
        expect(check()).to.equal(true);
    });

});
