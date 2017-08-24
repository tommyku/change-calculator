class Pocket {
  constructor(coinPrototype) {
    this.coinType = coinPrototype
    this.count = 0;
  }

  add(count) {
    this.count += count;
  }

  take(count) {
    if (count > this.count) throw new Error('Not enough coins to take')
    this.count -= count;
  }

  getCoinType() {
    return this.coinType;
  }
}
