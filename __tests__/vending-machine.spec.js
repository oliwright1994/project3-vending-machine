const VendingMachine = require("../src/vending-machine");
const inventory = require("../data/inventory.json");
const change = require("../data/change.json");
const vm = new VendingMachine(inventory, change);

describe("Vending Machine", () => {
  describe("VendingMachine.displayInventory", () => {
    describe("when i try to display inventory, it should return what items are in stock", () => {
      it("should return an array of item names", () => {
        expect(vm.displayInventory()).toEqual([
          "A2: Coke",
          "A3: Sprite",
          "B1: Yorkie",
          "B2: Twix",
          "C1: Pringles",
          "C2: Walkers - Salt and Vinegar",
          "C3: Quavers"
        ]);
      });
    });
  });
  //dispense tests
  describe("VendingMachine.dispense", () => {
    describe("when i put in £2.50 and A3 (correct payment and stock)", () => {
      it("should return me the item from A3", () => {
        expect(vm.dispense(2.5, "A3")).toEqual(
          expect.objectContaining({ item: "Sprite" })
        );
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
          expect(() => vm.dispense(50, "C2")).toThrow(
            "Not enough change. Please use exact change"
          );
        });
      });
    });
  });
  //refillStock tests
  describe("VendingMachine.refillStock", () => {
    describe("When i try to refill B2 with 15 items", () => {
      it("should return the item was filled with some left over", () => {
        expect(vm.refillStock(15, "B2")).toEqual(
          expect.stringMatching("Item stocked to 15, 5 left over ")
        );
      });
    });
    describe("When i try to refill B1 with 5 items", () => {
      it("should return the item was filled with space", () => {
        expect(vm.refillStock(5, "B1")).toEqual(
          expect.stringMatching("Item stocked to 12, space for 3 left")
        );
      });
    });
    describe("When i try to refill A1 with 15 items", () => {
      it("should return the item was fully stocked", () => {
        expect(vm.refillStock(15, "A1")).toEqual(
          expect.stringMatching("Item fully stocked")
        );
      });
    });
    describe("When i try to refill C2 without any items", () => {
      it("should return item could not be stocked", () => {
        expect(() => vm.refillStock("", "C2")).toThrow(
          "Item could not be stocked"
        );
      });
    });
    describe("When i try to refill A5 with 2 items", () => {
      it("should return item could not be stocked", () => {
        expect(() => vm.refillStock(2, "A5")).toThrow(
          "Item could not be stocked"
        );
      });
    });
  });
  //restockCoins tests
  describe("VendingMachine.restockCoins", () => {
    describe("When i try to refill 20 50p coins", () => {
      it("should return the coins were stocked with space left", () => {
        expect(vm.refillCoins(20, "50p")).toEqual(
          expect.stringMatching(
            "50p coins stocked to 40 with space for 10 left"
          )
        );
      });
    });
    describe("When i try to refill 30 2p coins", () => {
      it("should return the coins were stocked with coins left over", () => {
        expect(vm.refillCoins(30, "2p")).toEqual(
          expect.stringMatching(`2p coins stocked to 50, 20 coins left over`)
        );
      });
    });
    describe("When i try to refill 15 £1 coins", () => {
      it("should return the coins were fully stocked", () => {
        expect(vm.refillCoins(15, "£1")).toEqual(
          expect.stringMatching(`£1 coins fully stocked`)
        );
      });
    });
    describe("When i try to refill 10 75p coins", () => {
      it("should return coins could not be stocked", () => {
        expect(() => vm.refillCoins(10, "75p")).toThrow(
          "Coins could not be stocked"
        );
      });
    });
    describe("When i try to refill no 50p coins", () => {
      it("should return coins could not be stocked", () => {
        expect(() => vm.refillCoins("", "50p")).toThrow(
          "Coins could not be stocked"
        );
      });
    });
  });
  describe("dispense item with change", () => {
    describe("When i spend £1 on C3", () => {
      it("it should return Quavers and 35p change", () => {
        expect(vm.dispense(1, "C3")).toStrictEqual({
          item: "Quavers",
          change: {
            "20p": 1,
            "10p": 1,
            "5p": 1
          }
        });
      });
    });
  });
  describe("change item", () => {
    describe("When i replace A2 with 10 Tango", () => {
      it("it should return removed 10 Coke from A2, replaced with 10 Tango", () => {
        expect(vm.changeStock("A2", 10, "Tango")).toBe(
          "Removed 10 Coke from A2, replaced with 10 Tango"
        );
      });
    });
  });
});
