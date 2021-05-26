const { expect } = require('chai');
const { ethers } = require("hardhat");

describe("John2 Token", function () {
  let john2, dev, owner, user1, alice, bob, charlie, dan, eve;
 

  this.beforeEach(async function () {
    [dev, owner, user1, alice, bob, charlie, dan, eve] = await ethers.getSigners();
    
    const John2 = await ethers.getContractFactory('John2');
    john2 = await John2.connect(dev).deploy(owner.address, ethers.utils.parseEther('800000000'));
  })


  describe("Deployement", function () {
    
    it("Has name JohnYolo ", async function() {
      expect(await john2.name()).to.equal("JohnYolo");
    });

    it("Has symbol JOHN2", async function() {
      expect(await john2.symbol()).to.equal("JOHN2");
    });

    it('mints totalSupply to owner', async function() {
      expect(await john2.balanceOf(owner.address)).to.equal(ethers.utils.parseEther('800000000'));
    });

  });

  describe("Transaction", function () {

    it("should transfert 1000 token between accounts", async function() {
      await john2.connect(owner).transfer(dev.address, 1000);
      const devBalance = await john2.balanceOf(dev.address);
      expect(devBalance).to.equal(1000);
    });

    it('should fail if sender doesnt have enought token', async function() {
      const initialBalanceOwner = await john2.balanceOf(owner.address); 
      await expect(john2.connect(owner).transfer(bob.address, initialBalanceOwner + 1000)).to.be.revertedWith('John2: transfer amount exceed balance');
      expect(await john2.balanceOf(owner.address)).to.equal(initialBalanceOwner);
    });

    it("should update balances after tranfers", async function() {
     // const initialBalanceOwner = await john2.balanceOf(owner.address);

      await john2.connect(owner).transfer(alice.address, 1000);
      expect(await john2.balanceOf(alice.address)).to.equal(1000);

      let finalBalanceOwner = await john2.balanceOf(owner.address);
      expect(finalBalanceOwner).to.equal("799999999999999999999999000");
    });

    it('should emit Transfer event when using approve', async function() {
      await expect(john2.connect(owner).transfer(bob.address, 1000))
      .to.emit(john2, 'Transfer')
      .withArgs(owner.address, bob.address, 1000);
    });

  });

  describe("Approve", function () {

    it('should emit Approval event when using approve', async function() {
      await expect(john2.connect(owner).approve(bob.address, 1000))
      .to.emit(john2, 'Approval')
      .withArgs(owner.address, bob.address, 1000);
    });

  });

  describe("TransferFrom", function () {

    it("can't spend more than he is allowed", async function() {

      await john2.connect(owner).approve(alice.address, 1000); 
      await expect(john2.connect(alice).transferFrom(owner.address, bob.address, 2000)).to.be.revertedWith("John2: the amount exceed your allowance");
    });


    it('should emit Transfer event when using approve', async function() {
      const initialBalanceOwner = await john2.balanceOf(owner.address);

      await john2.connect(owner).approve(alice.address, initialBalanceOwner);
      await expect(john2.connect(alice).transferFrom(owner.address, bob.address, initialBalanceOwner))
      .to.emit(john2, 'Transfer')
      .withArgs(owner.address, bob.address, initialBalanceOwner);
    });

  });

})