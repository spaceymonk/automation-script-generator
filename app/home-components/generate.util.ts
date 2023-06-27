import { Edge, Node, getOutgoers } from "reactflow";

export const getEntryPoints = (nodes: Node[], edges: Edge[]) =>
  Object.values(
    nodes
      .filter((n) => n.type === "start" && getOutgoers(n, nodes, edges).length !== 0)
      .reduce((acc, n) => ({ ...acc, [n.id]: n }), {}) as Node[]
  );

export const generate = async (nodes: Node[], edges: Edge[], debugging?: boolean): Promise<string> =>
  new Promise((resolve, reject) => {
    const entryPoints = getEntryPoints(nodes, edges);
    if (entryPoints.length === 0) {
      reject(new Error("no entry point"));
    }

    const closureMap = new Map<string, string[]>();
    const codeMap = new Map<string, string[]>();
    const leafSet = new Set<string>();
    entryPoints.forEach((entryPoint) => {
      const ss = [entryPoint];
      let current: Node;

      while (ss.length > 0) {
        current = ss.pop() as Node;

        const currentCodeList = codeMap.get(current.id) || [""];
        const lastIndex = currentCodeList.length - 1;
        currentCodeList[lastIndex] += getBlockCode(current);

        const outgoers = getOutgoers(current, nodes, edges);
        if (outgoers.length === 0) {
          leafSet.add(current.id);
        }

        if (current.type === "find") {
        } else {
          outgoers.forEach((outgoer) => {
            ss.push(outgoer);
            if (codeMap.has(outgoer.id)) {
              const outgoerCodeList = codeMap.get(outgoer.id) as string[];
              const newOutgoerCodeList = outgoerCodeList.concat(currentCodeList[lastIndex]);
              codeMap.set(outgoer.id, newOutgoerCodeList);
            } else {
              codeMap.set(outgoer.id, currentCodeList.concat());
            }
          });
        }
      }
    });

    if (debugging) {
      resolve(getDebugCode(codeMap, leafSet));
    } else {
      resolve(getCode(codeMap, leafSet));
    }
  });

export const getTryExceptCode = (part: "try" | "except", indent = 1, exceptionType = "ImageNotFoundException") => {
  if (part === "try") {
    return `${" ".repeat(indent * 4)}try:\n`;
  }
  return `${" ".repeat(indent * 4)}except ${exceptionType}:\n`;
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
  if (node.type === "find") {
    return `${" ".repeat(indent * 4)}x, y = pyautogui.locateCenterOnScreen(${node.data?.text})\n`;
  }

  return `${" ".repeat(indent * 4)}# ${node.type?.toUpperCase()}(${node.data?.text})\n`;
};

const getCode = (codeMap: Map<string, string[]>, leafSet: Set<string>) => {
  let codeText = "import threading\nimport time\nimport pyautogui\n\n\n";
  let forkCount = 1;
  codeMap.forEach((codeList, id) => {
    if (leafSet.has(id)) {
      codeList.forEach((code) => {
        codeText += `def scenario_${forkCount}():\n`;
        codeText += code + "\n";
        forkCount++;
      });
    }
  });
  codeText += "\nif __name__ == '__main__':\n";
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

function getDebugCode(codeMap: Map<string, string[]>, leafSet: Set<string>) {
  let codeText = "";
  codeMap.forEach((codeList, id) => {
    if (leafSet.has(id)) {
      codeList.forEach((code) => (codeText += code + "\n"));
    }
  });
  return codeText;
}

function timeout(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
