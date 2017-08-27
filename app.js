class App {
  constructor(id) {
    this.dom = document.getElementById(id);
    this.input = this.dom.querySelectorAll('#price')[0];
    this.paymentDisplay = this.dom.querySelectorAll('#payment-display')[0];
    this.amountDisplay = this.dom.querySelectorAll('#amount-display')[0];
    this.values = {
      paymentDisplay: {},
      wallet: new Wallet()
    };
    this.fillWalletFromStorage();
    this.registerEventHandlers();
    this.updateUI();
  }

  fillWalletFromStorage() {
    // TODO: implement this
  }

  registerEventHandlers() {
    this.input.addEventListener('keydown', (e)=> this.handleAndUpdateUI(e, this.handlePriceChange));
  }

  handleAndUpdateUI(e, handler) {
    handler.bind(this)(e);
    this.updateUI();
  }

  handlePriceChange(e) {
    const price = parseFloat(e.target.value, 10).toFixed(2);
    if (isNaN(price)) return;
    this.values.paymentDisplay = this.values.wallet.payment(price);
  }

  updateUI() { // because I am lazy
    this.paymentDisplay.innerHTML = JSON.stringify(this.values.paymentDisplay);
    this.amountDisplay.innerHTML = this.values
      .wallet
      .amount()
      .toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  }
}

(() => {
  const app = new App('main');
})();
