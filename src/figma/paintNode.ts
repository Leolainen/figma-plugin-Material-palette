import clone from "../utils/clone";

type PaintNodeProps = {
  node: RectangleNode;
  rgb: [number, number, number];
};

const paintNode = (paintNodeProps: PaintNodeProps) => {
  const {
    node,
    rgb: [r, g, b],
  } = paintNodeProps;

  const fills = clone(node.fills);
  fills[0].color.r = r / 100;
  fills[0].color.g = g / 100;
  fills[0].color.b = b / 100;

  return fills;
};

export default paintNode;
