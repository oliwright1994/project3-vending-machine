const VendingMachine = require("../src/vending-machine");

describe("Vending Machine", () => {
  describe("when i put in £2.50 and A3", () => {
    it("should return me the item from A3", () => {
      expect(VendingMachine.dispense("2.50", "A3")).toEqual("Fanta");
    });
  });
});
