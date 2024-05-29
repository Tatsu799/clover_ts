class Card {
  public suit: string;
  public rank: string;

  constructor(suit: string, rank: string) {
    this.suit = suit;
    this.rank = rank;
  }
}

class Deck {
  public static _SUITS = ['H', 'D', 'C', 'S'];
  public static _RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', 'J', 'Q', 'K'];
  public cards: Card[];

  constructor() {
    this.cards = Deck.createDeck();
  }

  public static createDeck(): Card[] {
    const suitsLen = Deck._SUITS.length; //4
    const rankLen = Deck._RANKS.length; //12
    const cards: Card[] = [];

    for (let i = 0; i < suitsLen; i++) {
      for (let j = 0; j < rankLen; j++) {
        cards[i * rankLen + j] = new Card(Deck._SUITS[i], Deck._RANKS[j]);
      }
    }
    return cards;
  }

  public shuffleDeck(): void {
    let deckSize: number = this.cards.length; // 48

    for (let i = deckSize - 1; i >= 0; i--) {
      let randomNum = Math.floor(Math.random() * (i + 1));

      let temp = this.cards[i];
      this.cards[i] = this.cards[randomNum];
      this.cards[randomNum] = temp;
    }
  }
}

const deck = new Deck();
console.log(deck);

deck.shuffleDeck();
console.log(deck);
