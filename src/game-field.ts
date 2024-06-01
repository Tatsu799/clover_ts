import { Deck, Card } from './deck';
import { Position } from './position';

export class GameField {
  public deck: Deck = new Deck();
  public cardsPos: Position = new Position();
  public fieldCards: Card[] = [];
  public setTimeId: number = 0;

  public stage = new createjs.Stage('canvas');
  constructor() {
    window.addEventListener('load', () => {
      this.init();
    });

    const startBtn = document.getElementById('start');
    const stopBtn = document.getElementById('stop');

    startBtn?.addEventListener('click', () => {
      const startTime = Date.now();
      this.countTime(startTime);
    });

    stopBtn?.addEventListener('click', () => {
      clearTimeout(this.setTimeId);
    });
  }

  public init() {
    this.lineUpCards();
    this.drawCard();
    this.stage.update();
  }

  public getOpenCards() {
    for (let i = 0; i < 16; i++) {
      this.fieldCards.push(this.deck.cards[i]);
    }
  }

  public drawCard() {
    for (let i = 0; i < 16; i++) {
      this.deck.cards.shift();
    }
  }

  public lineUpCards() {
    this.getOpenCards();
    console.log(this.fieldCards);

    for (let i = 0; i < this.fieldCards.length; i++) {
      let card = new createjs.Text(`${this.fieldCards[i].suit}:${this.fieldCards[i].rank}`, '40px serif');
      this.stage.addChild(card);
      card.x = this.cardsPos.position[i].x;
      card.y = this.cardsPos.position[i].y;

      card!.addEventListener('click', () => {
        console.log(card.text);
      });
    }

    // const cardOne = new createjs.Text(`${GameField.deck.cards[0].suit}:${GameField.deck.cards[0].rank}`, '24px serif');
    // // console.log(cardOne);
    // cardOne.x = GameField.cardsPos.position[0].x;
    // cardOne.y = GameField.cardsPos.position[0].y;
    // const cardTwo = new createjs.Text(`${GameField.deck.cards[1].suit}:${GameField.deck.cards[1].rank}`, '24px serif');
    // // console.log(cardTwo);
    // cardTwo.x = GameField.cardsPos.position[1].x;
    // cardTwo.y = GameField.cardsPos.position[1].y;
    // const cardThree = new createjs.Text(`${GameField.deck.cards[2].suit}:${GameField.deck.cards[2].rank}`, '24px serif');
    // // console.log(cardThree);
    // cardThree.x = GameField.cardsPos.position[4].x;
    // cardThree.y = GameField.cardsPos.position[4].y;
    // GameField.stage.addChild(cardOne);
    // GameField.stage.addChild(cardTwo);
    // GameField.stage.addChild(cardThree);
    // new createjs.Text(`${GameField.deck.cards[i].suit}:${GameField.deck.cards[i].rank}`, '24px serif');
    // console.log(cardOne);
    // card.x = GameField.cardsPos.position[i].x;
    // card.y = GameField.cardsPos.position[i].y;
  }

  //時間の表示
  public countTime(startTime: number) {
    const timer = document.getElementById('timer');
    const time = new Date(Date.now() - startTime);

    const m = String(time.getMinutes()).padStart(2, '0');
    const s = String(time.getSeconds()).padStart(2, '0');
    timer!.textContent = `${m}:${s}`;

    this.setTimeId = window.setTimeout(() => {
      this.countTime(startTime);
    }, 10);
  }
}

// let stage = new createjs.Stage('canvas');
// let shape0 = new createjs.Shape();
// let shape1 = new createjs.Shape();
// let shape2 = new createjs.Shape();
// let shapes = [shape0, shape1, shape2];
// shapes[0].graphics.beginFill('DarkRed');
// shapes[1].graphics.beginFill('DarkBlue');
// shapes[2].graphics.beginFill('DarkGreen');
// for (let i = 0; i < 3; i++) {
//   shapes[i].graphics.drawRect(0, 0, 10, 12);
//   stage.addChild(shapes[i]);
//   shapes[i].x = pos.position[i].x;
//   shapes[i].y = pos.position[i].y;
//   shapes[i].addEventListener('click', () => {
//     console.log(pos.position[i].color);
//   });
// }
