import { BitmapText, Container } from "pixi.js";

export function text(
  content: string,
  pos: { x: number; y: number },
  fontSize: number = 48,
  letterSpacing: number = 5,
) {
  const container = new Container();

  const title = new BitmapText();
  const titleShadow = new BitmapText();

  title.text = content;
  title.anchor.set(0.5, 0.5);
  title.position.set(0, 0);
  title.style = {
    fill: 0xFFFFFF,
    fontSize,
    fontFamily: "LuckiestGuy",
    letterSpacing,
    stroke: {
      color: 0x000000,
      width: Math.min(6, 0.2 * fontSize),
    }
  }

  titleShadow.text = content;
  titleShadow.anchor.set(0.5, 0.5);
  titleShadow.position.set(0, Math.min(6, 0.2 * fontSize));
  titleShadow.style = {
    fill: 0x000000,
    fontSize,
    fontFamily: "LuckiestGuy",
    letterSpacing,
    stroke: {
      color: 0x000000,
      width: Math.min(2, 2 * fontSize),
    }
  }

  container.addChild(titleShadow);
  container.addChild(title);

  container.position.set(pos.x, pos.y);

  return container;
}

