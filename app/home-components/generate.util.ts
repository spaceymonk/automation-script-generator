import { Edge, Node, getOutgoers } from "reactflow";

export type Path = { [key: string]: { code: string[]; leaf: boolean } };

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
  edges: Edge[],
  debugging?: boolean
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const entryPoints = getEntryPoints(nodes, edges);
    if (entryPoints.length === 0) {
      reject(new Error("no entry point"));
    }

    const path: Path = {};
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
          if (typeof path[n.id] === "undefined") {
            path[n.id] = { code: path[current.id].code.concat(), leaf: true };
          } else {
            path[n.id].code = path[n.id].code.concat(
              path[current.id].code[lastIndex]
            );
          }
        });
      }
    });

    if (debugging) {
      let codeText = "";
      for (let id in path) {
        if (path[id].leaf) {
          for (let code of path[id].code) {
            codeText += code + "\n";
          }
        }
      }
      resolve(codeText);
    } else {
      resolve(getCode(path));
    }
  });
};

export const getBlockCode = (node: Node, indent = 1) => {
  if (node.type === "start") {
    return "";
  }
  if (node.type === "click") {
    return `${" ".repeat(indent * 4)}pyautogui.click(${node.data?.text})\n`;
  }
  if (node.type === "wait") {
    return `${" ".repeat(indent * 4)}time.sleep(${node.data?.text})\n`;
  }
  return `${" ".repeat(indent * 4)}# ${node.type?.toUpperCase()}(${
    node.data?.text
  })\n`;
};

const getCode = (path: Path) => {
  let codeText = "import threading\nimport time\nimport pyautogui\n\n\n";

  let forkCount = 1;
  for (let id in path) {
    if (path[id].leaf) {
      for (let code of path[id].code) {
        codeText += `def scenario_${forkCount}():\n`;
        codeText += code + "\n";
        forkCount++;
      }
    }
  }

  codeText += "if __name__ == '__main__':\n";
  for (let i = 1; i < forkCount; i++) {
    codeText += `    thread_scenario_${i} = threading.Thread(target=scenario_${i})\n`;
  }
  for (let i = 1; i < forkCount; i++) {
    codeText += `    thread_scenario_${i}.start()\n`;
  }
  for (let i = 1; i < forkCount; i++) {
    codeText += `    thread_scenario_${i}.join()\n`;
  }
  return codeText;
};

function timeout(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
