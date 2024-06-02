import { Deck, Card } from './deck';
import { Position } from './position';

export class GameField {
  public deck: Deck = new Deck();
  public cardsPos: Position = new Position();
  public fieldCards: Card[] = []; //フィールドにあるカードを管理
  public setTimeId: number = 0;

  public static stage = new createjs.Stage('canvas');
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

    createjs.Ticker.addEventListener('tick', handleTick);
    function handleTick() {
      GameField.stage.update();
    }
    // GameField.stage.update();
  }

  public getOpenCards() {
    for (let i = 0; i < 16; i++) {
      this.fieldCards.push(this.deck.cards[i]);
    }
  }

  // public drawCard() {

  // }

  public lineUpCards() {
    this.getOpenCards();

    let deck = new createjs.Text('DECK', '20px serif');
    GameField.stage.addChild(deck);
    deck.x = 380;
    deck.y = 380;

    // console.log(this.fieldCards);

    const sleep = async (second: number) => {
      return new Promise((resolve) => {
        setTimeout(resolve, second);
      });
    };

    const loop = async () => {
      for (let i = 0; i < this.fieldCards.length; i++) {
        await sleep(100);
        //ここはAnimateの画像に変える
        let card = new createjs.Text(`${this.fieldCards[i].suit}:${this.fieldCards[i].rank}`, '20px serif');

        GameField.stage.addChild(card);
        card.x = 380;
        card.y = 380;
        createjs.Tween.get(card).to({ x: this.cardsPos.position[i].x, y: this.cardsPos.position[i].y }, 500);

        this.fieldCards[i].currentPos = this.cardsPos.position[i].pos;
        this.deck.cards.shift();

        card.addEventListener('click', () => {
          // console.log(card.text);
          // console.log(card);
          if (card.text === 'H:A') {
            console.log('aaaaaa');
          } else {
            console.log(card.text);
          }
        });
      }
    };
    loop();

    /////////////////////////
    // let cards: createjs.Text[] = [];
    // for (let i = 0; i < this.fieldCards.length; i++) {
    //   cards.push(new createjs.Text(`${this.fieldCards[i].suit}:${this.fieldCards[i].rank}`, '20px serif'));
    //   GameField.stage.addChild(cards[i]);

    //   cards[i].x = 380;
    //   cards[i].y = 380;
    //   // card[i].visible = false;

    //   // createjs.Tween.get(card).wait(1000).to({ x: this.cardsPos.position[i].x, y: this.cardsPos.position[i].y }, 1000).wait(1000);

    //   // card.x = this.cardsPos.position[i].x;
    //   // card.y = this.cardsPos.position[i].y;

    //   // card[i].addEventListener('click', () => {
    //   //   console.log(card[i].text);
    //   // });
    // }

    // createjs.Tween.get(cards[0]).to({ x: this.cardsPos.position[0].x, y: this.cardsPos.position[0].y }, 1000);
    // createjs.Tween.get(cards[1]).wait(100).to({ x: this.cardsPos.position[1].x, y: this.cardsPos.position[1].y }, 1000);
    // createjs.Tween.get(cards[2]).wait(200).to({ x: this.cardsPos.position[2].x, y: this.cardsPos.position[2].y }, 1000);
    // createjs.Tween.get(cards[3]).wait(300).to({ x: this.cardsPos.position[3].x, y: this.cardsPos.position[3].y }, 1000);
    // createjs.Tween.get(cards[4]).wait(400).to({ x: this.cardsPos.position[4].x, y: this.cardsPos.position[4].y }, 1000);
    // createjs.Tween.get(cards[5]).wait(500).to({ x: this.cardsPos.position[5].x, y: this.cardsPos.position[5].y }, 1000);
    // createjs.Tween.get(cards[6]).wait(600).to({ x: this.cardsPos.position[6].x, y: this.cardsPos.position[6].y }, 1000);
    // createjs.Tween.get(cards[7]).wait(700).to({ x: this.cardsPos.position[7].x, y: this.cardsPos.position[7].y }, 1000);
    // createjs.Tween.get(cards[8]).wait(800).to({ x: this.cardsPos.position[8].x, y: this.cardsPos.position[8].y }, 1000);
    // createjs.Tween.get(cards[9]).wait(900).to({ x: this.cardsPos.position[9].x, y: this.cardsPos.position[9].y }, 1000);
    // createjs.Tween.get(cards[10]).wait(1000).to({ x: this.cardsPos.position[10].x, y: this.cardsPos.position[10].y }, 1000);
    // createjs.Tween.get(cards[11]).wait(1100).to({ x: this.cardsPos.position[11].x, y: this.cardsPos.position[11].y }, 1000);
    // createjs.Tween.get(cards[12]).wait(1200).to({ x: this.cardsPos.position[12].x, y: this.cardsPos.position[12].y }, 1000);
    // createjs.Tween.get(cards[13]).wait(1300).to({ x: this.cardsPos.position[13].x, y: this.cardsPos.position[13].y }, 1000);
    // createjs.Tween.get(cards[14]).wait(1400).to({ x: this.cardsPos.position[14].x, y: this.cardsPos.position[14].y }, 1000);
    // createjs.Tween.get(cards[15]).wait(1500).to({ x: this.cardsPos.position[15].x, y: this.cardsPos.position[15].y }, 1000);
    /////////////////////////
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

// // 対象の反復オブジェクト
// const targetArr = [1, 2, 3];

// // 実行する関数
// const sampleFunc = (value: number) => {
//   // asyncの効果は各functionブロックで切れるので逐一指定が必要
//   return new Promise((resolve) => {
//     // 2秒待ってから計算結果をresolveする
//     setTimeout(() => {
//       console.log('Calculating...');
//       resolve(value * 2);
//     }, 1000);
//   });
// };

// // for await...of文は必ずasyncの中で
// let num;
// (async () => {
//   for await (num of targetArr) {
//     // 関数の実行結果を格納して表示
//     const result = await sampleFunc(num);
//     console.log(result);
//   }
// })();
