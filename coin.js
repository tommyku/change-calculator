class Coin {
}

class Penny extends Coin {
  static get VALUE() {
    return 0.01;
  }
}

class Nickel extends Coin {
  static get VALUE() {
    return 0.05;
  }
}

class Dime extends Coin {
  static get VALUE() {
    return 0.1;
  }
}

class Quarter extends Coin {
  static get VALUE() {
    return 0.25;
  }
}

class HalfDollar extends Coin {
  static get VALUE() {
    return 0.5;
  }
}

class Dollar extends Coin {
  static get VALUE() {
    return 1;
  }
}
