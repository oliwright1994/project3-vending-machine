const VendingMachine = require("../src/vending-machine");
const inventory = require("../data/inventory.json");
const change = require("../data/change.json");
const vm = new VendingMachine(inventory);

describe("Vending Machine", () => {
  describe("when i put in £2.50 and A3 (correct payment and stock)", () => {
    it("should return me the item from A3", () => {
      expect(vm.dispense(2.5, "A3")).toEqual({
        item: "Sprite",
        change: 1.0
      });
    });
  });

  describe("when i put in B2 and no money (no payment)", () => {
    it("should throw an error of please insert payment", () => {
      expect(() => vm.dispense(undefined, "B2")).toThrow(
        "Please insert payment"
      );
    });
  });
  describe("when i put in 80p and B2 (not enough money)", () => {
    it("should throw an error of not enough money", () => {
      expect(() => vm.dispense(0.8, "B2")).toThrow(
        "Not enough credit, please insert £0.70"
      );
    });
  });
  describe("when i put in £1.5 and B3 (correct payment, item out of stock)", () => {
    it("should throw an error of item out of stock", () => {
      expect(() => vm.dispense(1.5, "B3")).toThrow("Item out of stock");
    });
  });
  describe("when i put in £50 and c2 (change is greater than change in machine)", () => {
    it("should throw an error of not enough change", () => {
      expect(() => vm.dispense(5000, "C2")).toThrow(
        "Not enough change. Please use exact change"
      );
    });
  });
});
