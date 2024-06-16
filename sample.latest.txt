import { Deck, Card } from './deck';
import { Position } from './position';

export class GameField {
  ///必要
  //public container = new createjs.Container();

  // public deck: Deck = new Deck();
  public cardsPos: Position = new Position();
  public fieldCards: Card[] = []; //フィールドにあるカードを管理
  public setTimeId: number = 0;
  // public calcTotalNumber: number = 0;
  public selectCard: Card[] = [];
  public sumNumber: number = 0;

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

    let displayDeck = new createjs.Text('DECK', '20px serif');
    GameField.stage.addChild(displayDeck);
    displayDeck.x = 380;
    displayDeck.y = 380;

    this.getFirstFieldCards(deck);
  }

  private showCard = async (deck: Deck, index: number) => {
    //ここはAnimateの画像に変える
    let card: createjs.Text = new createjs.Text(`${deck.cards[index].suit}:${deck.cards[index].rank}`, '20px serif'); //
    GameField.stage.addChild(card);
    card.x = 380;
    card.y = 380;
    createjs.Tween.get(card).to({ x: this.cardsPos.position[index].x, y: this.cardsPos.position[index].y }, 500);
    deck.cards[index].cardImage = card;
    this.updateFieldState(deck, index);
  };

  private updateFieldState = (deck: Deck, index: number): void => {
    this.fieldCards.push(deck.cards[index]);
    this.fieldCards[index].currentPos = this.cardsPos.position[index].pos;
  };

  // private updateFieldCard = async (deck: Deck, index: number) => {
  //   for (let i = 0; i < 16 - this.fieldCards.length; i++) {
  //     await this.sleep(100);
  //     await this.showText(deck, index);
  //   }
  // };

  private updateDeckState = (deck: Deck, index: number): void => {
    /////`ここ修正
    deck.cards = deck.cards.filter((card) => card.index !== index);
    // console.log(deck);
  };

  private getFirstFieldCards = async (deck: Deck) => {
    for (let i = 0; i < 16; i++) {
      // const index: number = this.cardsPos.position[i].pos;
      await this.sleep(100);
      // await this.showCard(deck, index);
      await this.showCard(deck, i);
      // await this.updateDeckState(deck, i);
    }
    this.clickEvent(deck);
    console.log(this.fieldCards);
  };

  private clickEvent = (deck: Deck) => {
    for (let i = 0; i < 16; i++) {
      this.fieldCards[i].cardImage.addEventListener('click', () => this.event(deck, this.fieldCards[i]));
      this.updateDeckState(deck, i);
    }
  };

  //////////////////////////////////////////////////////////////////////////////
  private removeAndDrawCard = (deck: Deck, fieldCard: Card, index: number) => {
    createjs.Tween.get(this.selectCard)
      .to({ scale: 0, regY: 0, regX: -50 }, 500)
      .call(() => this.removeCardFromField(fieldCard))
      .call(() => {
        let newCard = new createjs.Text(`${deck.cards[index].suit}:${deck.cards[index].rank}`, '30px serif'); //
        deck.cards[index].cardImage = newCard;
        deck.cards[index].cardImage.addEventListener('click', () => this.event(deck, deck.cards[index]));
        deck.cards[index].currentPos = fieldCard.currentPos;
        // this.fieldCards.push(deck.cards[index]);////
        this.fieldCards.splice(deck.cards[index].currentPos, 0, deck.cards[index]); /////
        // GameField.stage.addChild(newCard);
        newCard.x = 380;
        newCard.y = 380;

        createjs.Tween.get(newCard).to(
          { x: this.cardsPos.position[fieldCard.currentPos].x, y: this.cardsPos.position[fieldCard.currentPos].y },
          1000
        );
        // this.fieldCards.push(deck.cards[index]);
        GameField.stage.addChild(newCard);
      });
    // console.log(this.fieldCards);
    console.log(deck);
  };

  private event = async (deck: Deck, fieldCard: Card): Promise<void> => {
    if (
      this.selectCard.length === 0 ||
      (this.selectCard[0].suit === fieldCard.suit && +this.selectCard[0].rank < 10 && +fieldCard.rank < 10)
    ) {
      this.changeCardState(fieldCard);
      this.calcNumbers();
      console.log('同じsuitで追加 数字が10以下のカード', this.selectCard);

      if (this.sumNumber === 15) {
        for (let i = 0; i < this.selectCard.length; i++) {
          let card = this.selectCard[i];

          this.removeAndDrawCard(deck, card, i);
          await this.sleep(1000);
          this.updateDeckState(deck, i);
          this.clearAllOpacity(this.selectCard);
          console.log('カードの合計値が15の場合', this.fieldCards);
          // console.log('event 終了', this.fieldCards);
        }
        // this.resetSelectedCard(this.selectCard);
        console.log('カードの合計値が15の場合のカードリセット', this.selectCard);
      } else if (this.sumNumber > 15) {
        this.resetSelectedCard(this.selectCard);
        this.clearAllOpacity(this.selectCard);

        console.log('合計値が15以上になった場合', this.selectCard);
      }
    } else if (
      this.selectCard.length === 0 ||
      (this.selectCard[0].suit === fieldCard.suit && +this.selectCard[0].rank > 10 && +fieldCard.rank > 10)
    ) {
      this.changeCardState(fieldCard);
      this.calcNumbers();
      console.log('数字が10以上のカードを選択', this.selectCard);

      if (this.sumNumber === 36) {
        for (let i = 0; i < this.selectCard.length; i++) {
          let card = this.selectCard[i];
          this.removeAndDrawCard(deck, card, i);
          this.updateDeckState(deck, i);
          this.clearAllOpacity(this.selectCard);
        }
        // this.resetSelectedCard(this.selectCard);
      }
    } else {
      this.resetSelectedCard(this.selectCard);
      this.changeCardState(fieldCard);
      this.calcNumbers();
      console.log('別のスイーツ追加', this.selectCard);
    }
  };

  // private removeEvent = () => {
  //   ev.removeAllEventListeners('click', this.event);
  //   console.log('canceled');
  // };

  //フィールドにあるカードを取り除く
  private removeCardFromField = (selectedCard: Card) => {
    GameField.stage.removeChild(selectedCard.cardImage);
    this.fieldCards = this.fieldCards.filter((ele) => ele !== selectedCard);
    // console.log(this.fieldCards);
  };

  //SelectedCardsリストから取り除く
  private removeSelectCard = (selectedCards: Card) => {
    if (this.selectCard.includes(selectedCards)) {
      const index = this.selectCard.findIndex((ele) => ele === selectedCards);
      this.selectCard.splice(index, 1);
    }
  };

  //clickStateをリセット
  private resetClickState = (selectedCards: Card[]): void => {
    for (const card of selectedCards) {
      card.isClicked = false;
      card.cardImage.alpha = 1;
    }
    // selectedCards.forEach((ele) => (ele.isClicked = false));
  };

  //SelectCardsをリセット
  private resetSelectedCard = (selectedCards: Card[]) => {
    this.selectCard = [];
    this.sumNumber = 0;
    this.resetClickState(selectedCards);
  };

  //クリックのon offを入れ替える
  private changeClickState = (card: Card) => {
    // card.isClicked = !card.isClicked;
    if (!card.isClicked) {
      card.isClicked = true;
      card.cardImage.alpha = 0.5;
    } else {
      card.isClicked = false;
      card.cardImage.alpha = 1;
    }
  };

  //SelectedCardsリストに追加
  private pushSelectCard = (card: Card) => {
    this.selectCard.push(card);
  };

  //Cardのステータスを変更、SelectCardリストに追加
  private changeCardState = (card: Card): void => {
    if (!card.isClicked) {
      this.changeClickState(card);
      this.pushSelectCard(card);
    } else {
      this.changeClickState(card);
      this.removeSelectCard(card);
    }
  };

  private clearAllOpacity = (selectedCard: Card[]) => {
    for (const card of selectedCard) {
      card.cardImage.alpha = 1;
    }
    // selectedCard.forEach((ele) => (ele.cardImage.alpha = 1));
    // selectedCard.cardImage.alpha = 1;
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

  //選択したカードの合計を計算
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
//
