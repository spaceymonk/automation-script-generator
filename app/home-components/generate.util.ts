import { Edge, Node } from "reactflow";

export const generate = async (
  nodes: Node<{ text: string }>[],
  edges: Edge[],
  callback?: (text: string) => void
) => {
  // TODO: create python script from blocks
  await timeout(1500);
  let code = "";

  // return
  if (callback) callback(code);
  return code;
};

function timeout(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
