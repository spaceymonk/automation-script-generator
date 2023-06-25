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

    const path: { [key: string]: { code: string[]; leaf: boolean } } = {};
    entryPoints.forEach((entryPoint) => {
      const ss = [entryPoint];
      let current: Node;
      path[entryPoint.id] = { code: [""], leaf: true };
      while (ss.length > 0) {
        current = ss.pop() as Node;

        const lastIndex = path[current.id].code.length - 1;
        path[current.id].code[lastIndex] += getBlockCode(current);

        const outgoers = getOutgoers(current, nodes, edges);
        path[current.id].leaf = outgoers.length === 0;

        outgoers.forEach((n) => {
          ss.push(n);
          if (Object.keys(path).includes(n.id)) {
            path[n.id].code = path[n.id].code.concat([
              path[current.id].code[lastIndex].concat(),
            ]);
          } else {
            path[n.id] = { code: path[current.id].code.concat(), leaf: true };
          }
        });
      }
    });

    let code = "";
    for (let id in path) {
      if (path[id].leaf) {
        path[id].code.forEach((c) => (code += c + "\n"));
      }
    }
    resolve(code);
  });
};

export const getBlockCode = (node: Node) => {
  // TODO: get actual python code
  return `# ${node.type?.toUpperCase()}(${node.data?.text})\n`;
};

function timeout(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
