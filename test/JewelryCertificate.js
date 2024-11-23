const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("JewelryCertificate", function () {
    let contract, owner, addr1;

    beforeEach(async function () {
        const JewelryCertificate = await ethers.getContractFactory("JewelryCertificate");
        [owner, addr1] = await ethers.getSigners();
        contract = await JewelryCertificate.deploy();
        await contract.deployed();
    });

    it("Should allow authorized manufacturer to create certificate", async function () {
        await contract.authorizeManufacturer(owner.address);
        await contract.createCertificate(1, addr1.address);
        const events = await contract.getEvents(1);
        expect(events[0].description).to.equal("Certificate created");
    });

    it("Should log events correctly", async function () {
        await contract.authorizeManufacturer(owner.address);
        await contract.createCertificate(1, addr1.address);
        await contract.logEvent(1, "Diamond mined");
        const events = await contract.getEvents(1);
        expect(events[1].description).to.equal("Diamond mined");
    });

    it("Should transfer ownership and log event", async function () {
        await contract.authorizeManufacturer(owner.address);
        await contract.createCertificate(1, addr1.address);
        await contract.connect(addr1).transferCertificateOwnership(1, owner.address);
        const events = await contract.getEvents(1);
        expect(events[1].description).to.equal("Ownership transferred");
    });
});
