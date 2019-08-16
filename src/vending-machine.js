let inventory = require("../data/inventory.json");
let change = require("../data/change.json");

class VendingMachine {
  constructor(inventory) {
    this.inventory = inventory;
    this.change = { total: 1000 };
  }

  dispense(payment, selection) {
    const item = this.inventory[selection];
    if (
      this.checkPayment(payment, item.price) &&
      this.checkStock(item) &&
      this.calculateChange(payment, item.price)
    ) {
      return {
        item: item.name,
        change: payment - item.price
      };
    }
  }
  checkPayment(payment, price) {
    if (typeof payment === "undefined" || payment === 0) {
      throw Error("Please insert payment");
    } else if (price > payment) {
      throw Error(
        "Not enough credit, please insert £" + (price - payment).toFixed(2)
      );
    }
    return true;
  }
  checkStock(item) {
    if (item.quantity === 0) {
      throw Error("Item out of stock");
    }
    return true;
  }
  calculateChange(payment, price) {
    if (payment - price > this.change.total) {
      throw Error("Not enough change. Please use exact change");
    }
    return true;
  }
}

module.exports = VendingMachine;
