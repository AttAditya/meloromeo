import { ColorMatrixFilter, Container, Graphics } from "pixi.js";

export function button(
  innerContent: Container,
  color: number,
  action: () => void = () => {},
  options: {
    position?: {
      posX: number;
      posY: number;
    };
    styles?: {
      width: number;
      height: number;
      roundness: number;
    };
    anchor?: {
      anchorX: number;
      anchorY: number;
    };
    scale?: number;
  } = {},
) {
  const { position, styles, anchor, scale } = options;

  const { posX, posY } = position || { posX: 0, posY: 0 };
  const { anchorX, anchorY } = anchor || { anchorX: 0.5, anchorY: 0.5 };
  const { width, height, roundness } = styles || {
    width: 100,
    height: 75,
    roundness: 15,
  };

  const button = new Container();
  const buttonBg = new Container();

  const cmf = new ColorMatrixFilter();
  cmf.brightness(0.75, false);
  
  const buttonBgDepth = new Graphics();
  buttonBgDepth.roundRect(0, 20, width, height, roundness);
  buttonBgDepth.fill(color);
  buttonBgDepth.stroke({ color: 0xffffff, width: 2 });
  buttonBgDepth.filters = [cmf];
  
  const buttonBgColor = new Graphics();
  buttonBgColor.roundRect(0, 0, width, height, roundness);
  buttonBgColor.fill(color);
  buttonBgColor.stroke({ color: 0xffffff, width: 2 });
  
  buttonBg.addChild(buttonBgDepth);
  buttonBg.addChild(buttonBgColor);

  button.addChild(buttonBg);
  button.addChild(innerContent);

  innerContent.position.set(width / 2, height / 2);

  button.position.set(posX, posY);
  button.pivot.set(anchorX * width, anchorY * (height + 20));
  button.scale.set(scale || 1, scale || 1);
  
  button.eventMode = "static";
  button.onmousedown = () => {
    buttonBgColor.position.y += 10;
    innerContent.position.y += 10;
  }

  button.onmouseup = () => {
    buttonBgColor.position.y -= 10;
    innerContent.position.y -= 10;
    action();
  }

  return button;
}