import { Card } from './deck';

const mainArr: number[][] = [
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

const makeSuitArrays = (fieldCards: Card[]): number[][] => {
  let hartArray: number[] = [];
  let diamondArray: number[] = [];
  let cloverArray: number[] = [];
  let spadeArray: number[] = [];

  let suitArrays = [hartArray, diamondArray, cloverArray, spadeArray];
  if (fieldCards !== null) {
    fieldCards.forEach((type) => {
      if (type.suit === 'H') hartArray.push(+type.rank);
      if (type.suit === 'D') diamondArray.push(+type.rank);
      if (type.suit === 'C') cloverArray.push(+type.rank);
      if (type.suit === 'S') spadeArray.push(+type.rank);
    });
  }
  return suitArrays;
};

export const checkNumberPattern = (fieldCards: Card[]): boolean => {
  let suitArrays = makeSuitArrays(fieldCards);

  for (let i = 0; i < suitArrays.length; i++) {
    for (let j = 0; j < mainArr.length; j++) {
      if (mainArr[j].every((ele) => suitArrays[i].includes(ele))) {
        console.log(true);
        return true;
      }
    }
  }
  console.log(false);
  return false;
};
