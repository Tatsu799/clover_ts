import { Deck, Card } from './deck';
import { Position } from './position';
import { Timer } from './timer';
import { checkNumberPattern } from './check-pattern';

export class GameField {
  ///必要
  //public container = new createjs.Container();

  private deck: Deck = new Deck();
  private cardsPos: Position = new Position();
  private fieldCards: Card[] = []; //フィールドにあるカードを管理
  private timer: Timer = new Timer();

  private selectCards: Card[] = [];
  private sumNumber: number = 0;
  private countAllCards: number = 0;

  //仮
  public deckDisplay = new createjs.Text('DECK', '20px serif');
  static stage = new createjs.Stage('canvas');

  constructor() {
    this.init();

    const startBtn = document.getElementById('start');
    const stopBtn = document.getElementById('stop');

    startBtn?.addEventListener('click', () => {
      // this.countTime(startTime);
      // window.setTimeout(this.resetGame, 1000); ////
      // this.resetGame();
      this.timer.switchTimer();
    });

    stopBtn?.addEventListener('click', () => {
      this.timer.reset();
      // clearTimeout(this.setTimeId);
      // console.log('???????? field', this.fieldCards);
      // console.log('??????? select', this.selectCards);
    });
  }

  public init() {
    //タイマーの実行
    // const startTime = Date.now();
    // this.countTime(startTime);

    // this.lineUpCards();
    // this.showFieldCards();

    this.setImageToDeck();
    this.showCardsToField(); /////追加
    // this.keyDown(); /////////追加

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

  private setImageToDeck = async () => {
    for (let i: number = 0; i < this.deck.cards.length; i++) {
      this.deck.cards[i].cardImage = new createjs.Text(`${this.deck.cards[i].suit}:${this.deck.cards[i].rank}`, '20px serif'); //
    }
    this.fieldCards = new Array(16).fill(null); //
  };

  //カードを生成
  private getCardToField = async (fieldIndex: number): Promise<void> => {
    await this.sleep(100);
    const deckIndex: number = this.deck.cards.length - 1;
    console.log(deckIndex);

    if (this.fieldCards![fieldIndex] === null) {
      GameField.stage.addChild(this.deck.cards[deckIndex].cardImage);
      // this.deck.cards[deckIndex].cardImage.gotoAndStop(this.deck.cards[deckIndex].index);
      this.deck.cards[deckIndex].cardImage.x = 500;
      this.deck.cards[deckIndex].cardImage.y = 390;
      this.clickEvent(this.deck.cards[deckIndex]); //イベントを設定
      createjs.Tween.get(this.deck.cards[deckIndex].cardImage)
        .to({ x: this.cardsPos.fieldPosition[fieldIndex].x, y: this.cardsPos.fieldPosition[fieldIndex].y, scaleX: 1 }, 500) //500
        //一旦コメントアウト
        .to({ scaleX: 0 }, 100)
        .to({ scaleX: 1 }, 100);

      // await this.sleep(300);
      if (this.deck.cards.length >= 0) {
        const card: Card | undefined = this.deck.cards.pop();
        console.log(card);

        if (this.fieldCards !== null && card !== undefined) {
          this.fieldCards[fieldIndex] = card;
          this.fieldCards[fieldIndex].currentPos = this.cardsPos.fieldPosition[fieldIndex].pos;
          await this.sleep(100);
          GameField.stage.addChild(card.cardImage);
        }
      }
    }
  };

  //フィールドにカードを表示
  private showCardsToField = async () => {
    for (let i: number = 0; i < this.fieldCards.length; i++) {
      console.log('aaaaaaaaaaaaaa', i);
      if (this.fieldCards![i] === null) {
        await this.getCardToField(i);
      }

      // await this.sleep(100);
      // await this.getCardToField(i);
    }
    // console.log(this.deck);

    await this.sleep(800); ///////追加
    this.changeFieldCardOpacity(); ///////追加
    // console.log(this.checkNumberPattern());
  };

  //カードを消した時の処理 /////これはフィールドに移動しない
  private removeAndDrawCard = (selectedCard: Card) => {
    if (this.deck.cards.length !== 0) {
      createjs.Tween.get(this.selectCards)
        .to({ scale: 0, regY: 0 }, 500)
        .call(() => this.removeCardFromField(selectedCard))
        // .call(() => this.drawNewCards(deck, selectedCard));
        .call(() => this.showCardsToField());
    } else {
      createjs.Tween.get(this.selectCards)
        .to({ scale: 0, regY: 0, regX: -50 }, 500)
        .call(() => this.removeCardFromField(selectedCard));
      // .call(() => this.drawNewCards(deck, selectedCard));
      console.log('deck is zero!!!!!!!!!2');
      console.log(this.countAllCards);
    }
  };

  //フィールドにあるカードを取り除く
  private removeCardFromField = (selectedCard: Card): void => {
    GameField.stage.removeChild(selectedCard.cardImage);
    // this.fieldCards.splice(selectedCard.currentPos, 1); /////
    if (this.fieldCards !== null) {
      if (this.fieldCards.includes(selectedCard)) {
        const index: number = this.fieldCards!.findIndex((ele) => ele === selectedCard);
        this.fieldCards.splice(index, 1, null!);
      }
    }
    console.log('removed!!!!!!!!!!', this.fieldCards);
  };

  //クリックイベントの設定
  private clickEvent = (fieldCard: Card): void => {
    // this.deck.cards[index].cardImage.addEventListener('click', () => this.event(index));
    fieldCard.cardImage.addEventListener('click', () => this.event(fieldCard));
  };

  private event = async (fieldCard: Card): Promise<void> => {
    console.log(fieldCard);

    if (
      this.selectCards.length === 0 ||
      (this.selectCards[0].suit === fieldCard.suit && +this.selectCards[0].rank < 10 && +fieldCard.rank < 10)
    ) {
      this.addCardToSelectCard(fieldCard);
      this.calcNumbers();
      // console.log('同じsuitで追加 数字が10以下のカード', this.selectCards);

      if (this.sumNumber === 15) {
        for (let i: number = 0; i < this.selectCards.length; i++) {
          let selectedCard: Card = this.selectCards[i];
          this.removeAndDrawCard(selectedCard);
          // this.clearAllOpacity(this.selectCards);

          // console.log('カードの合計値が15の場合', this.fieldCards);
          // console.log('remove fieldCard!!!!!', this.fieldCards);
        }
        await this.sleep(1000);
        this.changeFieldCardOpacity(); /////15の組み合わせがない時にfalseになる
        // console.log(this.checkNumberPattern());
        // console.log('カードの合計値が15の場合のカードリセット', this.selectCards);
      } else if (this.sumNumber > 15) {
        this.resetSelectedCard(this.selectCards);
        // await this.sleep(500);
        // this.clearAllOpacity(this.selectCards);
        // console.log('合計値が15以上になった場合', this.selectCards);
      }
    } else if (
      this.selectCards.length === 0 ||
      (this.selectCards[0].suit === fieldCard.suit && +this.selectCards[0].rank > 10 && +fieldCard.rank > 10)
    ) {
      this.addCardToSelectCard(fieldCard);
      this.calcNumbers();
      // console.log('数字が10以上のカードを選択', this.selectCards);

      if (this.sumNumber === 36) {
        for (let i: number = 0; i < this.selectCards.length; i++) {
          let selectedCard = this.selectCards[i];
          this.removeAndDrawCard(selectedCard);
          this.clearAllOpacity(this.selectCards);
        }
        await this.sleep(1000);
        this.changeFieldCardOpacity(); /////1組み合わせがない時にfalseになる
      }
    } else {
      this.resetSelectedCard(this.selectCards);
      // this.addCardToSelectCard(fieldCard);
      this.calcNumbers();
      console.log('別のスイーツ追加', this.selectCards);
    }
  };

  //SelectCardリストに追加,Cardのステータスを変更、
  private addCardToSelectCard = (card: Card): void => {
    // if (this.checkNumberPattern()) {
    if (checkNumberPattern(this.fieldCards)) {
      if (!card.isClicked) {
        this.changeClickState(card);
        this.pushSelectCard(card);
      } else {
        this.changeClickState(card);
        this.removeSelectCard(card);
      }
    }
  };

  //SelectedCardsリストに追加
  private pushSelectCard = (card: Card) => {
    this.selectCards.push(card);
  };

  //SelectedCardsリストから取り除く
  private removeSelectCard = (selectedCards: Card) => {
    if (this.selectCards.includes(selectedCards)) {
      const index = this.selectCards.findIndex((ele) => ele === selectedCards);
      this.selectCards.splice(index, 1);
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
    if (checkNumberPattern(this.fieldCards)) {
      if (!card.isClicked) {
        card.isClicked = true;
        card.cardImage.alpha = 0.5;
      } else {
        card.isClicked = false;
        card.cardImage.alpha = 1;
      }
    }
  };

  //clickStateをリセット
  private resetClickState = (selectedCards: Card[]): void => {
    selectedCards.forEach((card) => {
      card.isClicked = false;
      card.cardImage.alpha = 1;
    });
  };

  //選択したカードの合計を計算
  private calcNumbers = (): void => {
    this.sumNumber = this.selectCards.reduce((total: number, num: Card) => total + +num.rank, 0);
  };

  private changeFieldCardOpacity = (): void => {
    if (!checkNumberPattern(this.fieldCards)) {
      if (this.fieldCards !== null) {
        this.fieldCards.forEach((card) => {
          card.isClicked = true;
          card.cardImage.alpha = 0.5;
        });
      }
    }
  };

  private clearAllOpacity = (selectedCard: Card[]) => {
    selectedCard.forEach((card) => {
      card.cardImage.alpha = 1;
    });
  };

  // private preventMove = (e: KeyboardEvent): void => {
  //   e.preventDefault();
  // };

  // private keyDown() {
  //   window.addEventListener('keydown', this.preventMove);
  // }
}

// private resetGame = () => {
//   GameField.stage.removeChild(this.deckDisplay);
//   for (const fieldCard of this.fieldCards) {
//    GameField.stage.removeChild(fieldCard.cardImage);
//     fieldCard.cardImage.removeAllEventListeners('click');
//   }
//   this.fieldCards = [];
//   this.selectCards = [];
//   this.sumNumber = 0;
//   this.countAllCards = 0;
//   this.init();
// };
