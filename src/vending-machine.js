class VendingMachine {
  constructor(inventory, change) {
    this.inventory = inventory;
    this.change = change;
    this.change.total = Object.keys(change.coins).reduce((a, x) => {
      return a + this.change.coins[x].quantity * this.change.coins[x].value;
    }, 0);
  }

  displayInventory() {
    let inventory = Object.keys(this.inventory).filter(key => {
      return this.inventory[key].quantity > 0;
    });
    return inventory.map(key => `${key}: ${this.inventory[key].name}`);
  }

  dispense(payment, selection) {
    const item = this.inventory[selection];
    if (
      this.checkPayment(payment, item.price) &&
      this.checkStock(item) &&
      this.checkChange(payment, item.price)
    ) {
      --item.quantity;
      return {
        item: item.name,
        change: this.calculateChange(payment, item.price)
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
  checkChange(payment, price) {
    if (payment - price > this.change.total / 100) {
      throw Error("Not enough change. Please use exact change");
    }
    return true;
  }

  refillStock(amount, selection) {
    const item = this.inventory[selection];
    if (!item || !amount) {
      throw Error("Item could not be stocked");
    }
    const excess = amount - (item.capacity - item.quantity);
    item.quantity = Math.min(item.capacity, item.quantity + amount);
    if (excess > 0) {
      return `Item stocked to ${item.quantity}, ${excess} left over `;
    } else if (excess < 0) {
      return `Item stocked to ${item.quantity}, space for ${-excess} left`;
    } else if (excess === 0) {
      return `Item fully stocked`;
    }
  }

  refillCoins(amount, coinType) {
    const coin = this.change.coins[coinType];

    if (!coin || !amount) {
      throw Error("Coins could not be stocked");
    }
    const excess = amount - (coin.capacity - coin.quantity);
    coin.quantity = Math.min(coin.capacity, coin.quantity + amount);
    this.change.total += amount * coin.value;
    if (excess < 0) {
      return `${coinType} coins stocked to ${
        coin.quantity
      } with space for ${coin.capacity - coin.quantity} left`;
    } else if (excess > 0) {
      return `${coinType} coins stocked to ${
        coin.quantity
      }, ${excess} coins left over`;
    } else if (excess === 0) {
      return `${coinType} coins fully stocked`;
    }
  }
  calculateChange(payment, price) {
    let changeRemaining = (payment - price) * 100;

    let change = {};
    let coins = Object.keys(this.change.coins).reverse();
    coins.forEach(coin => {
      if (changeRemaining > 0) {
        let coinValue = this.change.coins[coin].value;
        if (changeRemaining % coinValue === 0) {
          change[coin] = changeRemaining / coinValue;
          changeRemaining = 0;
        } else if (changeRemaining > coinValue) {
          let numCoins = Math.floor(changeRemaining / coinValue);
          change[coin] = numCoins;
          changeRemaining = changeRemaining % coinValue;
        }
      }
    });
    Object.keys(change).forEach(key => {
      this.change.coins[key].quantity -= change[key];
    });
    return change;
  }

  changeStock(selector, amount, item) {
    let slot = this.inventory[selector];
    const oldItem = `${slot.quantity} ${slot.name}`;
    slot.quantity = amount;
    slot.name = item;
    return `Removed ${oldItem} from ${selector}, replaced with ${amount} ${item}`;
  }
}

module.exports = VendingMachine;
