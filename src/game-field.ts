import { Deck, Card } from './deck';
import { Position } from './position';

export class GameField {
  ///必要
  //public container = new createjs.Container();

  // public deck: Deck = new Deck();
  public cardsPos: Position = new Position();
  public fieldCards: Card[] = []; //フィールドにあるカードを管理
  public setTimeId: number = 0;
  public selectCards: Card[] = [];
  public sumNumber: number = 0;
  public countAllCards: number = 0;

  // public timer: string = '';

  //仮
  public deckDisplay = new createjs.Text('DECK', '20px serif');
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
    [1, 2, 3, 9],
    [1, 2, 5, 7],
    [1, 3, 4, 7],
    [2, 3, 4, 6],
    [1, 2, 3, 4, 5],
  ];

  constructor() {
    const startBtn = document.getElementById('start');
    const stopBtn = document.getElementById('stop');

    startBtn?.addEventListener('click', () => {
      // const startTime = Date.now();
      // this.countTime(startTime);
      window.setTimeout(this.resetGame, 1000); ////
      // this.resetGame();
    });

    stopBtn?.addEventListener('click', () => {
      // clearTimeout(this.setTimeId);

      console.log('???????? field', this.fieldCards);
      console.log('??????? select', this.selectCards);
    });
  }

  public init() {
    //タイマーの実行
    // const startTime = Date.now();
    // this.countTime(startTime);

    // this.lineUpCards();

    this.showFieldCards();

    createjs.Ticker.addEventListener('tick', handleTick);
    function handleTick() {
      GameField.stage.update();
    }
  }

  private sleep = async (second: number) => {
    return new Promise((resolve) => {
      setTimeout(resolve, second);
    });
  };

  //開始時のフィールドに表示するカードを取得
  private showFieldCards = async () => {
    let deck: Deck = new Deck();
    this.countAllCards = deck.cards.length;

    // let displayDeck = new createjs.Text('DECK', '20px serif');
    GameField.stage.addChild(this.deckDisplay);
    this.deckDisplay.x = 380;
    this.deckDisplay.y = 380;

    for (let i = this.fieldCards.length; i < 16; i++) {
      await this.sleep(100);
      await this.showCardImage(deck, i);
    }
    //仮
    this.deckDisplay.addEventListener('click', () => console.log(this.showAllCardsCount(deck)));

    this.clickEvent(deck);
    await this.sleep(1000);
    this.changeFieldCardOpacity();
    console.log(this.checkNumberPattern());
  };

  //カードの画像を表示
  private showCardImage = async (deck: Deck, fieldIndex: number) => {
    //ここはAnimateの画像に変える
    let deckIndex = deck.cards.length - 1;
    let card: createjs.Text = new createjs.Text(`${deck.cards[deckIndex].suit}:${deck.cards[deckIndex].rank}`, '20px serif'); //
    GameField.stage.addChild(card);
    card.x = 380;
    card.y = 380;
    createjs.Tween.get(card).to(
      { x: this.cardsPos.fieldPosition[fieldIndex].x, y: this.cardsPos.fieldPosition[fieldIndex].y },
      500
    );
    deck.cards[deckIndex].cardImage = card;
    this.addCardToField(deck, fieldIndex);
  };

  //場と山札の枚数を表示
  public showAllCardsCount = (deck: Deck) => {
    this.countAllCards = deck.cards.length + this.fieldCards.length;
    console.log(this.countAllCards);
  };

  //カードを消した時の処理
  private removeAndDrawCard = (deck: Deck, selectedCard: Card) => {
    if (deck.cards.length !== 0) {
      createjs.Tween.get(this.selectCards)
        .to({ scale: 0, regY: 0, regX: -50 }, 500)
        .call(() => this.removeCardFromField(selectedCard))
        .call(() => this.drawNewCards(deck, selectedCard));
    } else {
      createjs.Tween.get(this.selectCards)
        .to({ scale: 0, regY: 0, regX: -50 }, 500)
        .call(() => this.removeCardFromField(selectedCard));
      // .call(() => this.drawNewCards(deck, selectedCard));

      console.log('deck is zero!!!!!!!!!2');
      console.log(this.countAllCards);
    }
  };

  //山札からカードをフィールドに追加する処理
  private addCardToField = (deck: Deck, fieldIndex: number): void => {
    const card = deck.cards.pop();
    if (deck.cards.length > 0 && card !== undefined) {
      this.fieldCards.push(card);
      this.fieldCards[fieldIndex].currentPos = this.cardsPos.fieldPosition[fieldIndex].pos;
    }
    // if (this.fieldCards.length !== 0) {
    //   this.fieldCards.push(card);
    //   this.fieldCards[fieldIndex].currentPos = this.cardsPos.fieldPosition[fieldIndex].pos;
    // } else {
    //   this.fieldCards.push(card);
    //   this.fieldCards[fieldIndex].currentPos = this.cardsPos.fieldPosition[fieldIndex].pos;
    // }
  };

  //山札からフィールドに追加するカードを生成
  private drawNewCards = (deck: Deck, fieldCard: Card) => {
    if (deck.cards.length > 0) {
      const cardIndex = deck.cards.length - 1;
      const newCard = new createjs.Text(`${deck.cards[cardIndex].suit}:${deck.cards[cardIndex].rank}`, '30px serif'); //
      deck.cards[cardIndex].cardImage = newCard;
      deck.cards[cardIndex].cardImage.x = 380;
      deck.cards[cardIndex].cardImage.y = 380;
      deck.cards[cardIndex].currentPos = fieldCard.currentPos;
      this.fieldCards.splice(deck.cards[cardIndex].currentPos, 0, deck.cards[cardIndex]); /////フィールドからカードを取り除く
      createjs.Tween.get(deck.cards[cardIndex].cardImage).to(
        { x: this.cardsPos.fieldPosition[fieldCard.currentPos].x, y: this.cardsPos.fieldPosition[fieldCard.currentPos].y },
        1000
      );
      // deck.cards[cardIndex].cardImage.addEventListener('click', () => this.event(deck, deck.cards[cardIndex]));
      const card = deck.cards.pop();
      console.log('card!!!!!!!!!!!!', card);

      if (card !== undefined) {
        card.cardImage.addEventListener('click', () => this.event(deck, card));
      }
      GameField.stage.addChild(newCard);
    } else {
      console.log('Deck is zero');
      console.log(this.countAllCards);
      GameField.stage.removeChild(this.deckDisplay);
    }
  };

  //フィールドにあるカードを取り除く
  private removeCardFromField = (selectedCard: Card) => {
    GameField.stage.removeChild(selectedCard.cardImage);
    // this.fieldCards.splice(selectedCard.currentPos, 1); /////
    if (this.fieldCards.includes(selectedCard)) {
      const index = this.fieldCards.findIndex((ele) => ele === selectedCard);
      this.fieldCards.splice(index, 1);
    }
    console.log('removed!!!!!!!!!!', this.fieldCards);
  };

  //クリックイベントを設定
  private clickEvent = (deck: Deck) => {
    for (let i = 0; i < 16; i++) {
      this.fieldCards[i].cardImage.addEventListener('click', () => this.event(deck, this.fieldCards[i]));
    }
  };

  // private removeEvent = (fieldCard: Card) => {
  //   fieldCard.cardImage.removeAllEventListeners('click');
  // };

  //クリックイベントの処理
  private event = async (deck: Deck, fieldCard: Card): Promise<void> => {
    if (
      this.selectCards.length === 0 ||
      (this.selectCards[0].suit === fieldCard.suit && +this.selectCards[0].rank < 10 && +fieldCard.rank < 10)
    ) {
      this.addCardToSelectCard(fieldCard);
      this.calcNumbers();
      console.log('同じsuitで追加 数字が10以下のカード', this.selectCards);
      console.log(deck);

      if (this.sumNumber === 15) {
        for (let i = 0; i < this.selectCards.length; i++) {
          let selectedCard = this.selectCards[i];
          this.removeAndDrawCard(deck, selectedCard);
          this.clearAllOpacity(this.selectCards);

          console.log('カードの合計値が15の場合', this.fieldCards);
          console.log('remove fieldCard!!!!!', this.fieldCards);
        }
        await this.sleep(1000);
        this.changeFieldCardOpacity();
        console.log(this.checkNumberPattern());
        console.log('カードの合計値が15の場合のカードリセット', this.selectCards);
      } else if (this.sumNumber > 15) {
        this.resetSelectedCard(this.selectCards);
        await this.sleep(500);
        this.clearAllOpacity(this.selectCards);
        console.log('合計値が15以上になった場合', this.selectCards);
      }
    } else if (
      this.selectCards.length === 0 ||
      (this.selectCards[0].suit === fieldCard.suit && +this.selectCards[0].rank > 10 && +fieldCard.rank > 10)
    ) {
      this.addCardToSelectCard(fieldCard);
      this.calcNumbers();
      console.log('数字が10以上のカードを選択', this.selectCards);

      if (this.sumNumber === 36) {
        for (let i = 0; i < this.selectCards.length; i++) {
          let selectedCard = this.selectCards[i];
          this.removeAndDrawCard(deck, selectedCard);
          this.clearAllOpacity(this.selectCards);
        }
        await this.sleep(1000);
        this.changeFieldCardOpacity();
        console.log(this.checkNumberPattern());
      }
    } else {
      this.resetSelectedCard(this.selectCards);
      this.addCardToSelectCard(fieldCard);
      this.calcNumbers();
      console.log('別のスイーツ追加', this.selectCards);
    }
  };

  //SelectedCardsリストから取り除く
  private removeSelectCard = (selectedCards: Card) => {
    if (this.selectCards.includes(selectedCards)) {
      const index = this.selectCards.findIndex((ele) => ele === selectedCards);
      this.selectCards.splice(index, 1);
    }
  };

  //clickStateをリセット
  private resetClickState = (selectedCards: Card[]): void => {
    for (const card of selectedCards) {
      card.isClicked = false;
      card.cardImage.alpha = 1;
    }
  };

  //SelectedCardsリストに追加
  private pushSelectCard = (card: Card) => {
    this.selectCards.push(card);
  };

  //SelectCardリストに追加,Cardのステータスを変更、
  private addCardToSelectCard = (card: Card): void => {
    if (this.checkNumberPattern()) {
      if (!card.isClicked) {
        this.changeClickState(card);
        this.pushSelectCard(card);
      } else {
        this.changeClickState(card);
        this.removeSelectCard(card);
      }
    }
  };

  //SelectCardsをリセット
  private resetSelectedCard = (selectedCards: Card[]) => {
    this.selectCards = [];
    this.sumNumber = 0;
    this.resetClickState(selectedCards);
  };

  //クリックのonoffを入れ替える
  private changeClickState = (card: Card) => {
    if (this.checkNumberPattern()) {
      if (!card.isClicked) {
        card.isClicked = true;
        card.cardImage.alpha = 0.5;
      } else {
        card.isClicked = false;
        card.cardImage.alpha = 1;
      }
    }
  };

  private clearAllOpacity = (selectedCard: Card[]) => {
    for (const card of selectedCard) {
      card.cardImage.alpha = 1;
    }
  };

  //選択したカードの合計を計算
  private calcNumbers = (): void => {
    this.sumNumber = this.selectCards.reduce((total: number, num: Card) => total + +num.rank, 0);
  };

  private changeFieldCardOpacity = (): void => {
    for (const card of this.fieldCards) {
      if (!this.checkNumberPattern()) {
        card.isClicked = true;
        card.cardImage.alpha = 0.5;
      }
    }
  };

  private SuitArrays = (): number[][] => {
    let hartArray: number[] = [];
    let diamondArray: number[] = [];
    let cloverArray: number[] = [];
    let spadeArray: number[] = [];

    let suitArrays = [hartArray, diamondArray, cloverArray, spadeArray];
    // let subArr = [Harr, Carr, Sarr, Darr];
    for (const type of this.fieldCards) {
      if (type.suit === 'H') hartArray.push(+type.rank);
      if (type.suit === 'D') diamondArray.push(+type.rank);
      if (type.suit === 'C') cloverArray.push(+type.rank);
      if (type.suit === 'S') spadeArray.push(+type.rank);
    }
    return suitArrays;
  };

  // [key: string]: number;
  private checkNumberPattern = (): boolean => {
    let suitArrays = this.SuitArrays();
    // console.log('aaaaaaa', suitArrays);

    for (let i = 0; i < suitArrays.length; i++) {
      for (let j = 0; j < this.mainArr.length; j++) {
        if (this.mainArr[j].every((ele) => suitArrays[i].includes(ele))) {
          return true;
        }
      }
    }
    return false;
  };

  private resetGame = () => {
    GameField.stage.removeChild(this.deckDisplay);
    for (const fieldCard of this.fieldCards) {
      GameField.stage.removeChild(fieldCard.cardImage);
      fieldCard.cardImage.removeAllEventListeners('click');
      console.log('remove Event!!!!!!!!!!!!!!!!!!!!');
    }
    this.init();
    this.fieldCards = [];
    this.selectCards = [];
    this.sumNumber = 0;
    this.countAllCards = 0;
  };

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
