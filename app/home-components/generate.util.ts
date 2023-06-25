import { Edge, Node, getOutgoers } from "reactflow";

export const getEntryPoints = (nodes: Node[], edges: Edge[]) =>
  Object.values(
    nodes
      .filter(
        (n) => n.type === "start" && getOutgoers(n, nodes, edges).length !== 0
      )
      .reduce((acc, n) => ({ ...acc, [n.id]: n }), {}) as Node[]
  );

export const generate = async (
  nodes: Node[],
  edges: Edge[]
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const entryPoints = getEntryPoints(nodes, edges);
    if (entryPoints.length === 0) {
      reject(new Error("no entry point"));
    }

    let code = "";
    entryPoints.forEach((entryPoint) => {
      let current = entryPoint;
      while (true) {
        code += getBlockCode(current);
        const outgoers = getOutgoers(current, nodes, edges);
        if (outgoers.length === 0) {
          break;
        }
        current = outgoers[0];
      }
    });

    resolve(code);
  });
};

export const getBlockCode = (node: Node) => {
  // TODO: get actual python code
  return `[${node.type?.toUpperCase()}(${node.data?.text.toUpperCase()})]\n`;
};

function timeout(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
