import {expect} from "chai";
import {deployBaseToken, deployTokenController} from './helpers/deploy';
import {ZERO_ADDRESS} from '../helpers/constants'


describe("BaseToken - ctor", function () {
  it("Should create the contract correctly", async function () {
    const baseTokenInstance = await deployBaseToken();

    expect(baseTokenInstance.address).to.not.equal(ZERO_ADDRESS);
  });
});

describe("TokenController - ctor", function () {
  it("Should create the contract correctly", async function () {
    const contractInstance = await deployTokenController();

    expect(contractInstance.address).to.not.equal(ZERO_ADDRESS);
  });
});
