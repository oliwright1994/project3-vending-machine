let inventory = require("../data/inventory.json");
let change = require("../data/change.json");

class VendingMachine {
  constructor(inventory, change) {
    this.inventory = inventory;
    this.change = change;
  }

  dispense(payment, item) {
    if (item.price > payment) {
      throw "Please insert " + (item.price - payment);
    } else {
      return true;
    }
  }
}

module.exports = VendingMachine;
