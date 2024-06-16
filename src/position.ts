export class Position {
  public fieldPosition = [
    { x: 100, y: 10, pos: 0 },
    { x: 200, y: 10, pos: 1 },
    { x: 300, y: 10, pos: 2 },
    { x: 400, y: 10, pos: 3 },

    { x: 100, y: 100, pos: 4 },
    { x: 200, y: 100, pos: 5 },
    { x: 300, y: 100, pos: 6 },
    { x: 400, y: 100, pos: 7 },

    { x: 100, y: 200, pos: 8 },
    { x: 200, y: 200, pos: 9 },
    { x: 300, y: 200, pos: 10 },
    { x: 400, y: 200, pos: 11 },

    { x: 100, y: 300, pos: 12 },
    { x: 200, y: 300, pos: 13 },
    { x: 300, y: 300, pos: 14 },
    { x: 400, y: 300, pos: 15 },
  ];
  constructor() {}
}

// const pos = new Pos();
// console.log(pos.position[0].x);

// window.addEventListener('load', init);

// function init() {
//   let stage = new createjs.Stage('canvas');
//   var shape0 = new createjs.Shape();
//   var shape1 = new createjs.Shape();
//   var shape2 = new createjs.Shape();
//   let shapes = [shape0, shape1, shape2];

//   // shape.graphics.setStrokeStyle(5);

//   shapes[0].graphics.beginFill('DarkRed');
//   shapes[1].graphics.beginFill('DarkBlue');
//   shapes[2].graphics.beginFill('DarkGreen');

//   for (let i = 0; i < 3; i++) {
//     shapes[i].graphics.drawRect(0, 0, 10, 12);
//     stage.addChild(shapes[i]);
//     shapes[i].x = pos.position[i].x;
//     shapes[i].y = pos.position[i].y;

//     shapes[i].addEventListener('click', () => {
//       console.log(pos.position[i].color);
//     });
//   }

//   // shape1.graphics.drawRect(0, 0, 10, 12);
//   // stage.addChild(shape1);
//   // shape1.x = pos.position[1].x;
//   // shape1.y = pos.position[1].y;

//   // shape2.graphics.drawRect(0, 0, 10, 12);
//   // stage.addChild(shape2);
//   // shape2.x = pos.position[2].x;
//   // shape2.y = pos.position[2].y;

//   stage.update();
// }
