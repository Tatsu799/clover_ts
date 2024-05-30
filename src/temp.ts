class Pos {
  public position = [
    { x: 10, y: 10, color: 'DarkRed' },
    { x: 30, y: 30, color: 'DarkBlue' },
    { x: 50, y: 50, color: 'DarkGreen' },
  ];
  constructor() {}
}

const pos = new Pos();
console.log(pos.position[0].x);

window.addEventListener('load', init);

function init() {
  let stage = new createjs.Stage('canvas');
  var shape0 = new createjs.Shape();
  var shape1 = new createjs.Shape();
  var shape2 = new createjs.Shape();
  let shapes = [shape0, shape1, shape2];

  // shape.graphics.setStrokeStyle(5);

  shapes[0].graphics.beginFill('DarkRed');
  shapes[1].graphics.beginFill('DarkBlue');
  shapes[2].graphics.beginFill('DarkGreen');

  for (let i = 0; i < 3; i++) {
    shapes[i].graphics.drawRect(0, 0, 10, 12);
    stage.addChild(shapes[i]);
    shapes[i].x = pos.position[i].x;
    shapes[i].y = pos.position[i].y;

    shapes[i].addEventListener('click', () => {
      console.log(pos.position[i].color);
    });
  }

  // shape1.graphics.drawRect(0, 0, 10, 12);
  // stage.addChild(shape1);
  // shape1.x = pos.position[1].x;
  // shape1.y = pos.position[1].y;

  // shape2.graphics.drawRect(0, 0, 10, 12);
  // stage.addChild(shape2);
  // shape2.x = pos.position[2].x;
  // shape2.y = pos.position[2].y;

  stage.update();
}
