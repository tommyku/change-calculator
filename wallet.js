class Wallet {
  constructor() {
    this.pockets = {};
    Wallet.supportedCoinTypes.forEach((coinType) => {
      this.pockets[coinType.name] = new Pocket(coinType);
    });
  }

  amount() {
    return Object.values(this.pockets).reduce((sum, pocket)=> {
      return sum + pocket.count * pocket.getCoinType().VALUE
    }, 0);
  }

  add(coinType, count) {
    const coinTypeKey = (typeof coinType == 'string') ? coinType : coinType.name;
    this.pockets[coinTypeKey].add(count);
  }

  take(coinType, count) {
    const coinTypeKey = (typeof coinType == 'string') ? coinType : coinType.name;
    this.pockets[coinTypeKey].take(count);
  }

  sortedCoinTypes(option = { ascending: true }) {
    const supportedCoinTypes = Wallet.supportedCoinTypes.map((type) => type);
    return supportedCoinTypes.sort((coinTypeA, coinTypeB) => {
      return (coinTypeA.VALUE < coinTypeB.VALUE ? -1 : 1) * (option.ascending ? 1 : -1);
    });
  }

  minCoin(result, amount) {
    let tmpAmount = amount;

    if (amount > 0 && this.amount() < amount) {
      throw new Error('Not enough moeny');
    } else {
      const coinsTypes = this.sortedCoinTypes({ ascending: false });
      coinsTypes.forEach((coinType) => {
        const coinCount = this.pockets[coinType.name].count;
        const coinAmount = coinCount * coinType.VALUE;
        if (coinAmount <= tmpAmount) {
          tmpAmount -= coinAmount;
          result[coinType.name] = coinCount;
        } else {
          const maxTaken = parseInt(tmpAmount / coinType.VALUE, 10);
          tmpAmount -= coinType.VALUE * maxTaken;
          result[coinType.name] = maxTaken;
        }
        tmpAmount = tmpAmount.toFixed(2);

        if (tmpAmount === 0) return result;
      });
    }

    if (tmpAmount != 0) throw new Error('No such combination');

    return result;
  }

  maxCoin(result, amount) {
    // aims at getting it to work, not getting it perfect
    // get the coins from minCoin then swap out with smaller coins
    let tmpPocket = {}
    let tmpResult = this.minCoin(result, amount);
    Object.values(this.pockets).forEach((pocket) => {
      const coinName = pocket.getCoinType().name;
      tmpPocket[coinName] = pocket.count - tmpResult[coinName];
    });

    Object.keys(tmpResult).forEach((coinName) => {
      const coinsToSwap = Object.keys(tmpPocket).filter((key) => {
        const fromCoinType = this.pockets[coinName].getCoinType();
        const toCoinType = this.pockets[key].getCoinType();
        return coinName !== key &&
          fromCoinType.VALUE > toCoinType.VALUE &&
          this.canSwapCoin(fromCoinType, toCoinType, tmpResult[coinName], tmpPocket[key]);
      });
      if (coinsToSwap.length > 0) {
        const fromCoinType = this.pockets[coinName].getCoinType();
        const toCoinType = this.pockets[coinsToSwap[0]].getCoinType();
        const targetValue = fromCoinType.VALUE * tmpResult[coinName];
        const expectedCount = parseInt(targetValue / toCoinType.VALUE, 10);
        const swapResult = this.swapCoin(tmpResult, tmpPocket, fromCoinType, toCoinType, expectedCount);
        tmpResult = swapResult.pocketA;
        tmpPocket = swapResult.pocketB;
      }
    });

    return tmpResult;
  }

  canSwapCoin(fromCoinType, toCoinType, fromCount, toCount) {
    if (toCount == 0 || fromCount == 0) return false;
    const targetValue = fromCoinType.VALUE * fromCount;
    const expectedCount = parseInt(targetValue / toCoinType.VALUE, 10);
    return expectedCount <= toCount && expectedCount * toCoinType.VALUE == targetValue;
  }

  swapCoin(pocketA, pocketB, fromCoinType, toCoinType, toCount) {
    pocketA[toCoinType.name] += toCount;
    pocketB[toCoinType.name] -= toCount;
    pocketB[fromCoinType.name] += pocketA[fromCoinType.name];
    pocketA[fromCoinType.name] = 0;
    return { pocketA: pocketA, pocketB: pocketB };
  }

  payment(amount, option = { maxCoin: false }) {
    const result = {};
    Wallet.supportedCoinTypes.forEach((coinType) => result[coinType.name] = 0);

    return option.maxCoin ? this.maxCoin(result, amount) : this.minCoin(result, amount);
  }
}

Wallet.supportedCoinTypes = [Penny, Nickel, Dime, Quarter, HalfDollar, Dollar];
