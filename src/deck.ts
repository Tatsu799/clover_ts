export class Card {
  public suit: string;
  public rank: string;
  public index: number;
  public currentPos: number; //

  constructor(suit: string, rank: string, index: number, currentPos: number) {
    this.suit = suit;
    this.rank = rank;
    this.index = index;
    this.currentPos = currentPos;
  }
}

export class Deck {
  public static _SUITS = ['H', 'D', 'C', 'S'];
  public static _RANKS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '11', '12', '13'];
  // public cards: Card[];
  public cards: Card[] = [];

  constructor() {
    this.cards = this.createDeck();
    // this.shuffleDeck();
  }

  public createDeck(): Card[] {
    const suitsLen = Deck._SUITS.length; //4
    const rankLen = Deck._RANKS.length; //12

    for (let i = 0; i < suitsLen; i++) {
      for (let j = 0; j < rankLen; j++) {
        this.cards.push(new Card(Deck._SUITS[i], Deck._RANKS[j], i * rankLen + j, 0));
      }
    }
    return this.cards;
  }

  //上と同じ処理
  // public static createDeck(): Card[] {
  //   const suitsLen = Deck._SUITS.length; //4
  //   const rankLen = Deck._RANKS.length; //12
  //   const cards: Card[] = [];

  //   for (let i = 0; i < suitsLen; i++) {
  //     for (let j = 0; j < rankLen; j++) {
  //       cards[i * rankLen + j] = new Card(Deck._SUITS[i], Deck._RANKS[j], i * rankLen + j);
  //     }
  //   }
  //   return cards;
  // }

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

// let cont = document.getElementById('container');
// const deck = new Deck();
// console.log(deck);

// let fArr = [];
// for (let i = 0; i < 5; i++) {
//   fArr.push(deck.cards[i]);
// }
// console.log(fArr);

// for (let i = 0; i < 5; i++) {
//   let html = '';
//   html = `
//   <p id="tag${i}" class="${i}" value="${i}">${deck.cards[i].rank}:${deck.cards[i].suit}</p>
//   `;

//   cont!.innerHTML += html;
// }

// for (let i = 0; i < 5; i++) {
//   let p = <HTMLElement>document.querySelector(`#tag${i}`)!;

//   p!.addEventListener('click', () => {
//     // console.log(`${deck.cards[i].rank}`);

//     console.log(p);

//     if (p.id === 'tag0') {
//       p!.style.color = 'red';
//     }
//   });
// }
