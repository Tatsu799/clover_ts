export class Card {
  public suit: string;
  public rank: string;
  // public index: number;
  public currentPos: number; //
  public cardImage: createjs.Text = new createjs.Text();
  public isClicked: boolean = false; ///

  constructor(suit: string, rank: string, currentPos: number) {
    this.suit = suit;
    this.rank = rank;
    // this.index = index;
    this.currentPos = currentPos;
  }
}

export class Deck {
  private _SUITS = ['H', 'D', 'C', 'S'];
  private _RANKS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '11', '12', '13'];
  public cards: Card[];

  constructor() {
    this.cards = this.createDeck();
    this.shuffleDeck();
  }

  private createDeck(): Card[] {
    const suitsLen = this._SUITS.length; //4
    const rankLen = this._RANKS.length; //12
    const cards: Card[] = [];

    for (let i = 0; i < suitsLen; i++) {
      for (let j = 0; j < rankLen; j++) {
        // cards.push(new Card(Deck._SUITS[i], Deck._RANKS[j], i * rankLen + j, 0));
        cards.push(new Card(this._SUITS[i], this._RANKS[j], 0));
      }
    }
    return cards;
  }

  private shuffleDeck(): void {
    let deckSize: number = this.cards.length; // 48

    for (let i = deckSize - 1; i >= 0; i--) {
      let randomNum = Math.floor(Math.random() * (i + 1));

      let temp = this.cards[i];
      this.cards[i] = this.cards[randomNum];
      this.cards[randomNum] = temp;
    }
  }
}
