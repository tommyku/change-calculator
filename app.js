class App {
  constructor(id) {
    this.dom = document.getElementById(id);
    this.input = this.dom.querySelectorAll('#price')[0];
    this.payButton = this.dom.querySelectorAll('#pay')[0];
    this.paymentDisplay = this.dom.querySelectorAll('#payment-display')[0];
    this.amountDisplay = this.dom.querySelectorAll('#amount-display')[0];
    this.control = this.dom.querySelectorAll('#control')[0];
    this.values = {
      price: 0,
      wallet: new Wallet()
    };
    this.fillWalletFromStorage();
    this.createWalletControl();
    this.registerEventHandlers();
    this.updateUI();
  }

  fillWalletFromStorage() {
    const pocketsJSON = localStorage.getItem('change-calc:pockets');
    if (pocketsJSON === null) return;
    const pockets = JSON.parse(pocketsJSON);
    Object.keys(pockets).forEach((coinTypeName) => {
      this.values.wallet.add(coinTypeName, pockets[coinTypeName].count);
    });
  }

  registerEventHandlers() {
    this.input.addEventListener('keyup', (e) => this.handleAndUpdateUI(e, this.handlePriceChange));
    this.control.querySelectorAll('button').forEach((button) => {
      button.addEventListener('click', (e) => this.handleAndUpdateUI(e, this.handleControlClick));
    });
    this.payButton.addEventListener('click', (e) => this.handleAndUpdateUI(e, this.handlePayClick));
  }

  createWalletControl() {
    Wallet.supportedCoinTypes.forEach((coinType) => {
      this.control.innerHTML += `
        <button data-coin-type=${coinType.name} data-action='add'>+</button>
        <span class='coinDisplay' data-coin-type='${coinType.name}'></span>
        <button data-coin-type=${coinType.name} data-action='take'>-</button>
        <br />
      `;
    });
  }

  payment() {
    return this.values.wallet.payment(this.values.price);
  }

  save() {
    localStorage.setItem('change-calc:pockets', JSON.stringify(this.values.wallet.pockets));
  }

  handleControlClick(e) {
    const button = e.target;
    const action = e.target.dataset.action;
    const coinType = e.target.dataset.coinType;
    if (action === 'add') {
      this.values.wallet.add(coinType, 1);
    } else if (action === 'take') {
      this.values.wallet.take(coinType, 1);
    }
  }

  handlePayClick(e) {
    const payment = this.payment();
    Object.keys(payment).forEach((coinTypeName) => this.values.wallet.take(coinTypeName, payment[coinTypeName]));
    this.input.value = 0;
  }

  handleAndUpdateUI(e, handler) {
    handler.bind(this)(e);
    this.save();
    this.updateUI();
  }

  handlePriceChange(e) {
    this.values.price = parseFloat(e.target.value, 10).toFixed(2);
  }

  updateUI() { // because I am lazy
    let paymentDisplay;
    try {
      paymentDisplay = isNaN(this.values.price) ?
        'No idea' : JSON.stringify(this.payment())
    } catch(e) {
      paymentDisplay = e.message;
    }
    this.paymentDisplay.innerHTML = paymentDisplay;
    this.amountDisplay.innerHTML = this.values
      .wallet
      .amount()
      .toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    Wallet.supportedCoinTypes.forEach((coinType) => {
      const span = this.control.querySelectorAll(`span[data-coin-type='${coinType.name}']`)[0];
      span.innerHTML = `${this.values.wallet.pockets[coinType.name].count} ${coinType.name}`;
    });
  }
}

(() => {
  const app = new App('main');
})();
