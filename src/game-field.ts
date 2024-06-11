import { Deck, Card } from './deck';
import { Position } from './position';

export class GameField {
  // public deck: Deck = new Deck();
  public cardsPos: Position = new Position();
  public fieldCards: Card[] = []; //フィールドにあるカードを管理
  public setTimeId: number = 0;
  // public calcTotalNumber: number = 0;
  public selectCard: Card[] = [];
  public sumNumber: number = 0;

  // public fCards: createjs.Text[] = [];

  public static stage = new createjs.Stage('canvas');
  public mainArr: number[][] = [
    [11, 12, 13],
    [6, 9],
    [7, 8],
    [1, 5, 9],
    [1, 6, 8],
    [2, 4, 9],
    [2, 5, 8],
    [2, 6, 7],
    [3, 4, 8],
    [3, 5, 7],
    [4, 5, 6],
    [1, 2, 4, 8],
    [1, 2, 5, 7],
    [1, 3, 4, 7],
    [2, 3, 4, 6],
    [1, 2, 3, 4, 5],
  ];

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
    // this.lineUpCards();

    //////////////////////////////////////////
    /////ここから下は消す
    const gaugeWidth = 200;
    const gaugeHeight = 20;

    //ゲージを描画する関数
    function drawGauge(x: number, y: number, width: number, height: number, value: number) {
      const shape = new createjs.Shape();
      const g = shape.graphics;

      g.beginFill('#00F'); // ゲージの色
      g.drawRect(x, y, width * value, height); // ゲージの値に応じて描画
      g.endFill();

      return shape;
    }

    //////////////////

    let gaugeValue = 1;

    const gauge = drawGauge(0, 0, gaugeWidth, gaugeHeight, gaugeValue);
    GameField.stage.addChild(gauge);

    // GameField.stage.update();
    //////////////////
    function updateGauge() {
      gaugeValue -= 0.01; // ゲージの減少量

      // ゲージが0未満になった場合は0に補正
      if (gaugeValue < 0) {
        gaugeValue = 0;
      }

      // ゲージを再描画
      gauge.graphics
        .clear()
        .beginFill('#00F')
        .drawRect(0, 0, gaugeWidth * gaugeValue, gaugeHeight)
        .endFill();

      updateGauge();
      function updateGauge() {
        gaugeValue -= 0.01; // ゲージの減少量

        // ゲージが0未満になった場合は0に補正
        if (gaugeValue < 0) {
          gaugeValue = 0;
        }

        // ゲージを再描画
        gauge.graphics
          .clear()
          .beginFill('#00F')
          .drawRect(0, 0, gaugeWidth * gaugeValue, gaugeHeight)
          .endFill();
        // GameField.stage.update();

        // 100ミリ秒後に再度ゲージを更新
        setTimeout(updateGauge, 10);
      }
      // GameField.stage.update();

      // 100ミリ秒後に再度ゲージを更新
      setTimeout(updateGauge, 10);
    }

    createjs.Tween.get(gauge).call(updateGauge);
    /////ここから上は消す
    //////////////////////////////////////////

    createjs.Ticker.addEventListener('tick', handleTick);
    function handleTick() {
      GameField.stage.update();
    }
    // console.log(this.check());
    // console.log(this.fieldCards);
  }

  private sleep = async (second: number) => {
    return new Promise((resolve) => {
      setTimeout(resolve, second);
    });
  };

  public lineUpCards() {
    //ここはAnnimateの画像入れ替え
    let deck: Deck = new Deck();
    console.log('!!!!!!!!!!!!', deck);

    let deckText = new createjs.Text('DECK', '20px serif');
    GameField.stage.addChild(deckText);
    deckText.x = 380;
    deckText.y = 380;

    this.getFirstFieldCards(deck);
  }

  private showText = async (deck: Deck, index: number) => {
    //ここはAnimateの画像に変える
    let card: createjs.Text = new createjs.Text(`${deck.cards[index].suit}:${deck.cards[index].rank}`, '20px serif'); //
    GameField.stage.addChild(card);
    card.x = 380;
    card.y = 380;
    createjs.Tween.get(card).to({ x: this.cardsPos.position[index].x, y: this.cardsPos.position[index].y }, 500);
    deck.cards[index].cardImage = card;
    this.updateFieldState(deck, index);
  };

  private updateFieldState = async (deck: Deck, index: number) => {
    this.fieldCards.push(deck.cards[index]);
    this.fieldCards[index].currentPos = this.cardsPos.position[index].pos;
    // this.fieldCards[index].cardImage = card;
    // this.clickEvent(deck, index);
    deck.cards.shift();
  };

  private getFirstFieldCards = async (deck: Deck) => {
    for (let i = 0; i < 16; i++) {
      const index: number = this.cardsPos.position[i].pos;
      await this.sleep(100);
      await this.showText(deck, index);
      // this.clickEvent(deck, index);
    }
    this.clickEvent(deck);
  };

  // private updateFieldCard = async (deck: Deck, index: number) => {
  //   for (let i = 0; i < 16 - this.fieldCards.length; i++) {
  //     await this.sleep(100);
  //     await this.showText(deck, index);
  //   }
  // };

  private clickEvent = (deck: Deck) => {
    for (let i = 0; i < 16; i++) {
      this.fieldCards[i].cardImage.addEventListener('click', () => this.event(deck, this.fieldCards[i]));
    }
  };

  // private clickEvent = (deck: Deck, index: number) => {
  //   this.fieldCards[index].cardImage.addEventListener('click', () => this.event(deck, this.fieldCards[index]));
  // };

  //////////////////////////////////////////////////////////////////////////////
  private removeAndDrawCard = (deck: Deck, fieldCard: Card) => {
    createjs.Tween.get(this.selectCard)
      .to({ scale: 0, regY: 0, regX: -50 }, 500)
      // .call(() => this.removeCard(this.selectCard))
      .call(() => this.removeCard(fieldCard))
      .call(() => {
        let newCard = new createjs.Text(`${deck.cards[0].suit}:${deck.cards[0].rank}`, '30px serif'); //
        newCard.x = 380;
        newCard.y = 380;
        deck.cards[0].cardImage = newCard;
        createjs.Tween.get(newCard).to(
          { x: this.cardsPos.position[fieldCard.currentPos].x, y: this.cardsPos.position[fieldCard.currentPos].y },
          1000
        );
        GameField.stage.addChild(newCard);
        // this.selectCard = [];
        // this.sumNumber = 0;
        newCard.addEventListener('click', () => this.event(deck, deck.cards[0]));
        deck.cards.shift();
      });
    //////////////////////////////////////////

    // createjs.Tween.get(this.selectCard)
    //   .to({ scale: 0, regY: 0, regX: -50 }, 500)
    //   .call(() => this.removeCard(this.selectCard))
    //   .call(() => {
    //     let newCard = new createjs.Text(`${deck.cards[0].suit}:${deck.cards[0].rank}`, '30px serif'); //
    //     newCard.x = 380;
    //     newCard.y = 380;
    //     deck.cards[0].cardImage = newCard;
    //     createjs.Tween.get(newCard).to(
    //       { x: this.cardsPos.position[fieldCard.currentPos].x, y: this.cardsPos.position[fieldCard.currentPos].y },
    //       1000
    //     );
    //     GameField.stage.addChild(newCard);
    //     this.selectCard = [];
    //     this.sumNumber = 0;
    //     newCard.addEventListener('click', () => this.event(deck, deck.cards[0]));
    //   });
  };

  private event = (deck: Deck, fieldCard: Card): void => {
    console.log('clicked~!!!!!');
    console.log(fieldCard);
    // console.log(this.selectCard);

    // console.log(deck);
    // console.log(this.fieldCards);

    // GameField.stage.removeChild(fieldCards.cardImage);
    // let temp = new createjs.Text(`${deck.cards[20].suit}:${deck.cards[20].rank}`, '30px serif'); //
    // deck.cards[0].cardImage = temp;

    // temp.x = 380;
    // temp.y = 380;
    // GameField.stage.addChild(temp);
    // createjs.Tween.get(temp)
    //   .to({ x: this.cardsPos.position[fieldCards.currentPos].x, y: this.cardsPos.position[fieldCards.currentPos].y }, 1000)
    //   .wait(3000)
    //   .call(() => temp.addEventListener('click', () => this.event(deck, fieldCards)));

    if (this.selectCard.length === 0) {
      this.checkCardsState(fieldCard);
      console.log(this.selectCard);
    } else if (this.selectCard.length > 0 && this.selectCard[0].suit === fieldCard.suit && +fieldCard.rank < 10) {
      ////
      this.selectCard = [];
      this.sumNumber = 0;
      this.checkCardsState(fieldCard);
      this.calcNumbers();

      console.log(this.selectCard);

      if (this.sumNumber === 15) {
        console.log(deck.cards);
        console.log(this.fieldCards);

        this.removeAndDrawCard(deck, fieldCard);
        console.log(this.selectCard);

        // createjs.Tween.get(this.selectCard)
        //   .to({ scale: 0, regY: 0, regX: -50 }, 500)
        //   .call(() => this.removeCard(this.selectCard))
        //   .call(() => {
        //     let newCard = new createjs.Text(`${deck.cards[0].suit}:${deck.cards[0].rank}`, '30px serif'); //
        //     newCard.x = 380;
        //     newCard.y = 380;
        //     deck.cards[0].cardImage = newCard;
        //     createjs.Tween.get(newCard).to(
        //       { x: this.cardsPos.position[fieldCard.currentPos].x, y: this.cardsPos.position[fieldCard.currentPos].y },
        //       1000
        //     );
        //     GameField.stage.addChild(newCard);
        //     this.selectCard = [];
        //     this.sumNumber = 0;
        //     newCard.addEventListener('click', () => this.event(deck, deck.cards[0]));
        //   });
      } else if (this.sumNumber > 15) {
        this.selectCard = [];
        this.sumNumber = 0;

        console.log(this.selectCard);
      }
    } else if (this.selectCard.length > 0 && this.selectCard[0].suit === fieldCard.suit && +fieldCard.rank > 10) {
      this.checkCardsState(fieldCard);
      this.calcNumbers();
      console.log('発火！！！！！！');
      console.log('111111', this.selectCard);
      console.log('11111', this.sumNumber);
      if (this.sumNumber === 36) {
        /////////////////////////////////////////////////////////////////
        for (let i = 0; i < this.selectCard.length; i++) {
          let card = this.selectCard[i];
          this.removeAndDrawCard(deck, card);
        }

        this.selectCard = []; ///////追加した
        this.sumNumber = 0; ///////追加した

        ////////////////////////////////////////////////////
        // this.removeAndDrawCard(deck, fieldCard);
        console.log('222222', this.selectCard);
        console.log('2222', this.sumNumber);
      }

      //  else {
      //   this.selectCard = [];
      //   this.sumNumber = 0;
      //   this.checkCardsState(fieldCard);
      //   this.calcNumbers();

      //   console.log('333333', this.selectCard);
      //   console.log('33333', this.sumNumber);
      // }
    }

    // console.log('sssssss', this.selectCard);
    // console.log(this.sumNumber); ///
  };

  // private removeEvent = () => {
  //   ev.removeAllEventListeners('click', this.event);
  //   console.log('canceled');
  // };

  // private test = (fieldCards: Card) => {
  //   if (this.selectCard.length === 0) {
  //     this.checkCardsState(fieldCards);
  //     // this.calcNumbers();
  //   } else if (this.selectCard.length > 0 && this.selectCard[0].suit === fieldCards.suit) {
  //     this.checkCardsState(fieldCards);
  //     this.calcNumbers();

  //     if (this.sumNumber === 15) {
  //       // createjs.Tween.get(this.fieldCards[i].cardImage)
  //       //   .to({ scale: 0 }, 500)
  //       //   .call(() => this.removeCard(this.selectCard));
  //       createjs.Tween.get(fieldCards.cardImage)
  //         .to({ scale: 0, regY: 0, regX: -50 }, 500)
  //         .call(() => this.removeCard(this.selectCard))
  //         .call(() => {
  //           let temp = new createjs.Text(`${this.deck.cards[20].suit}:${this.deck.cards[20].rank}`, '30px serif'); //
  //           temp.x = 380;
  //           temp.y = 380;
  //           createjs.Tween.get(temp).to(
  //             { x: this.cardsPos.position[fieldCards.currentPos].x, y: this.cardsPos.position[fieldCards.currentPos].y },
  //             1000
  //           );
  //           GameField.stage.addChild(temp);
  //         });
  //     } else if (this.sumNumber > 15) {
  //       this.selectCard = [];
  //       this.sumNumber = 0;
  //     }
  //     console.log(this.selectCard);
  //   } else {
  //     this.selectCard = [];
  //     this.sumNumber = 0;
  //     this.checkCardsState(fieldCards);
  //     console.log('発火！！！！！！');
  //   }

  //   console.log('sssssss', this.selectCard);
  //   console.log(this.sumNumber); ///
  // };

  // private clickEvent = () => {
  //   console.log(this.fieldCards);
  //   const allArr = this.makeArray();
  //   console.log(allArr);
  //   for (let i = 0; i < this.fieldCards.length; i++) {
  //     this.fieldCards[i].cardImage.addEventListener('click', () => this.test(this.fieldCards[i]));
  //   }
  // };

  private removeCard = (selectCard: Card) => {
    GameField.stage.removeChild(selectCard.cardImage);
    // GameField.stage.removeChild(cardImage);
    // for (const card of selectCard) {
    //   GameField.stage.removeChild(card.cardImage);
    // }
  };

  // private removeCard = (selectCard: Card[]) => {
  //   // GameField.stage.removeChild(cardImage);
  //   for (const card of selectCard) {
  //     GameField.stage.removeChild(card.cardImage);
  //   }
  // };

  private changeClickState = (card: Card) => {
    card.isClicked = !card.isClicked;
  };

  private getSelectCard = (card: Card) => {
    if (card.isClicked) this.selectCard.push(card);
  };

  private removeSelectCard = (card: Card) => {
    if (this.selectCard.includes(card)) {
      const index = this.selectCard.findIndex((ele) => ele === card);
      this.selectCard.splice(index, 1);
      console.log(index);
      console.log(this.selectCard);
    }

    // console.log(this.selectCard);
  };

  private checkCardsState = (card: Card): void => {
    if (!card.isClicked) {
      this.changeClickState(card);
      this.getSelectCard(card);
    } else {
      this.changeClickState(card);
      this.removeSelectCard(card);
    }
  };

  // // private drawFromDeck = (): void => {
  // //   this.deck.cards.shift();
  // // };

  // // private getNewCard = (position: number): void => {
  // //   let newCard = new createjs.Text(`${this.deck.cards[0].suit}:${this.deck.cards[0].rank}`, '30px serif'); //
  // //   newCard.x = 380;
  // //   newCard.y = 380;
  // //   createjs.Tween.get(newCard).to({ x: this.cardsPos.position[position].x, y: this.cardsPos.position[position].y }, 1000);
  // //   GameField.stage.addChild(newCard);
  // // };

  private calcNumbers = (): void => {
    this.sumNumber = this.selectCard.reduce((total: number, num: Card) => total + +num.rank, 0);
  };

  // private makeArray = (): number[][] => {
  //   let hartArr: number[] = [];
  //   let diamondArr: number[] = [];
  //   let cloverArr: number[] = [];
  //   let spadeArr: number[] = [];

  //   let subArr = [hartArr, diamondArr, cloverArr, spadeArr];
  //   // let subArr = [Harr, Carr, Sarr, Darr];
  //   for (const word of this.fieldCards) {
  //     if (word.suit === 'H') hartArr.push(+word.rank);
  //     if (word.suit === 'D') diamondArr.push(+word.rank);
  //     if (word.suit === 'C') cloverArr.push(+word.rank);
  //     if (word.suit === 'S') spadeArr.push(+word.rank);
  //   }

  //   // console.log('aaaaaaaa', subArr[0]);

  //   return subArr;
  // };

  // [key: string]: number;
  // private check = (): boolean => {
  //   let subArr = this.makeArray();
  //   console.log('aaaaaaa', subArr);

  //   for (let i = 0; i < subArr.length; i++) {
  //     for (let j = 0; j < this.mainArr.length; j++) {
  //       if (this.mainArr[j].every((ele) => subArr[i].includes(ele))) {
  //         return true;
  //       } else {
  //         continue;
  //       }
  //     }
  //   }
  //   return false;
  // };

  //時間の表示
  private countTime(startTime: number) {
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

//////////////// 参考 ////////////////
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

// const arr = [1, 2, 3, 4];
// const init = 0;
// const sum = arr.reduce((total, current) => total + current, init);
// console.log(sum);

// 15になる組み合わせ
// const mainArr = [
//   [6, 9],
//   [7, 8],
//   [1, 5, 9],
//   [1, 6, 8],
//   [2, 4, 9],
//   [2, 5, 8],
//   [2, 6, 7],
//   [3, 4, 8],
//   [3, 5, 7],
//   [4, 5, 6],
//   [1, 2, 4, 8],
//   [1, 2, 5, 7],
//   [1, 3, 4, 7],
//   [2, 3, 4, 6],
//   [1, 2, 3, 4, 5]
// ]

// const Harr = [];
// const Carr = [];
// const Sarr = [];
// const Darr = [];

// for (const word of this.fieldCards) {
//   // console.log(word.suit);
//   if (word.suit === 'H') Harr.push(+word.rank);
//   if (word.suit === 'C') Carr.push(+word.rank);
//   if (word.suit === 'S') Sarr.push(+word.rank);
//   if (word.suit === 'D') Darr.push(+word.rank);
// }
//////////////// 参考 ////////////////

// オブジェクトの型定義
// interface Item {
//   [key: string]: number;
// }
