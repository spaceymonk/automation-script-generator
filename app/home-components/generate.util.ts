import { Edge, Node, getOutgoers } from "reactflow";

export const getEntryPoints = (nodes: Node[], edges: Edge[]) =>
  Object.values(
    nodes
      .filter((n) => n.type === "start" && getOutgoers(n, nodes, edges).length !== 0)
      .reduce((acc, n) => ({ ...acc, [n.id]: n }), {}) as Node[]
  );

const generate_top2bottom = async (nodes: Node[], edges: Edge[], debugging?: boolean): Promise<string> =>
  new Promise((resolve, reject) => {
    const entryPoints = getEntryPoints(nodes, edges);
    if (entryPoints.length === 0) {
      reject(new Error("no entry point"));
    }

    const closureMap = new Map<string, Set<string>>();
    const codeMap = new Map<string, string[]>();
    const leafSet = new Set<string>();
    entryPoints.forEach((entryPoint) => {
      const ss = [entryPoint];
      let current: Node;

      while (ss.length > 0) {
        current = ss.pop() as Node;

        const currentCodeList = codeMap.get(current.id) || [""];
        const lastIndex = currentCodeList.length - 1;

        const outgoers = getOutgoers(current, nodes, edges);
        if (outgoers.length === 0) {
          leafSet.add(current.id);
        }

        let currentIndent = 1;
        if (closureMap.has(current.id)) {
          currentIndent = (closureMap.get(current.id) as Set<string>).size + 1;
        }

        if (current.type === "find") {
          const trueOuts = [] as Node[];
          const falseOuts = [] as Node[];
          outgoers.forEach((outgoer) => {
            const fromTrueHandle = edges.some(
              (e) => e.source === current.id && e.target === outgoer.id && e.sourceHandle === "true"
            );
            let temp = currentCodeList[lastIndex].concat();

            if (fromTrueHandle) {
              traverseTreeDFS(
                outgoer,
                (child) => {
                  const childClosure = closureMap.get(child.id) || new Set();
                  if (childClosure.has(current.id + "-false")) {
                    childClosure.delete(current.id + "-false");
                  } else {
                    childClosure.add(current.id + "-true");
                  }
                  closureMap.set(child.id, childClosure);
                },
                nodes,
                edges
              );
              temp += getTryExceptCode("try", currentIndent);
              temp += getBlockCode(current, currentIndent + 1);
              trueOuts.push(outgoer);
            } else {
              traverseTreeDFS(
                outgoer,
                (child) => {
                  const childClosure = closureMap.get(child.id) || new Set();
                  if (childClosure.has(current.id + "-true")) {
                    childClosure.delete(current.id + "-true");
                  } else {
                    childClosure.add(current.id + "-false");
                  }
                  closureMap.set(child.id, childClosure);
                },
                nodes,
                edges
              );
              temp += getTryExceptCode("except", currentIndent);
              falseOuts.push(outgoer);
            }

            if (codeMap.has(outgoer.id)) {
              const outgoerCodeList = codeMap.get(outgoer.id) as string[];
              const newOutgoerCodeList = outgoerCodeList.concat(temp);
              codeMap.set(outgoer.id, newOutgoerCodeList);
            } else {
              codeMap.set(outgoer.id, [temp]);
            }
          });
          ss.push(...falseOuts, ...trueOuts);
          currentCodeList[lastIndex] += getTryExceptCode("try", currentIndent);
          currentCodeList[lastIndex] += getBlockCode(current, currentIndent + 1);
        } else {
          currentCodeList[lastIndex] += getBlockCode(current, currentIndent);
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

const traverseTreeDFS = (node: Node, callback: (n: Node) => void, nodes: Node[], edges: Edge[]) => {
  const ss = [node];
  while (ss.length > 0) {
    const current = ss.pop() as Node;
    callback(current);
    ss.push(...getOutgoers(current, nodes, edges));
  }
};

const generate_bottom2top = async (nodes: Node[], edges: Edge[], debugging?: boolean): Promise<string> =>
  new Promise((resolve, reject) => {
    const entryPoints = getEntryPoints(nodes, edges);
    if (entryPoints.length === 0) {
      reject(new Error("no entry point"));
    }

    const codeMap = new Map<string, string[]>();
    const leafSet = new Set<string>();
    entryPoints.forEach((entry) => {
      leafSet.add(entry.id);
      generate_util(entry, nodes, edges, codeMap);
    });

    if (debugging) {
      resolve(getDebugCode(codeMap, leafSet));
    } else {
      resolve(getCode(codeMap, leafSet));
    }
  });

const generate_util = (
  current: Node,
  nodes: Node[],
  edges: Edge[],
  codeMap: Map<string, string[]>,
  closureMap = new Map<string, Set<string>>(),
  currentIndent = 1
) => {
  const outgoers = getOutgoers(current, nodes, edges);

  if (current.type === "find") {
    const trueOutgoers = [] as Node[];
    const falseOutgoers = [] as Node[];
    outgoers.forEach((outgoer) => {
      const fromTrueHandle = edges.some(
        (e) => e.source === current.id && e.target === outgoer.id && e.sourceHandle === "true"
      );
      const fromFalseHandle = edges.some(
        (e) => e.source === current.id && e.target === outgoer.id && e.sourceHandle === "false"
      );
      if (fromTrueHandle) {
        trueOutgoers.push(outgoer);
        traverseTreeDFS(
          outgoer,
          (child) => {
            const childClosure = closureMap.get(child.id) || new Set();
            if (childClosure.has(current.id + "-false")) {
              childClosure.delete(current.id + "-false");
            } else {
              childClosure.add(current.id + "-true");
            }
            closureMap.set(child.id, childClosure);
          },
          nodes,
          edges
        );
      }
      if (fromFalseHandle) {
        falseOutgoers.push(outgoer);
        traverseTreeDFS(
          outgoer,
          (child) => {
            const childClosure = closureMap.get(child.id) || new Set();
            if (childClosure.has(current.id + "-true")) {
              childClosure.delete(current.id + "-true");
            } else {
              childClosure.add(current.id + "-false");
            }
            closureMap.set(child.id, childClosure);
          },
          nodes,
          edges
        );
      }
    });
    trueOutgoers.forEach((outgoer) => generate_util(outgoer, nodes, edges, codeMap, closureMap, currentIndent + 1));
    falseOutgoers.forEach((outgoer) => generate_util(outgoer, nodes, edges, codeMap, closureMap, currentIndent + 1));

    let currentCodeList = [] as string[];
    const trueOutgoerCodeList = trueOutgoers.flatMap((outgoer) => codeMap.get(outgoer.id));
    const falseOutgoerCodeList = falseOutgoers.flatMap((outgoer) => codeMap.get(outgoer.id));
    const blockCode = getBlockCode(current, currentIndent + 1);
    if (trueOutgoerCodeList.length === 0 && falseOutgoerCodeList.length !== 0) {
      currentCodeList = falseOutgoerCodeList.map(
        (code) => getTryExceptCode("try", currentIndent) + blockCode + getTryExceptCode("except", currentIndent) + code
      );
    } else if (trueOutgoerCodeList.length !== 0 && falseOutgoerCodeList.length === 0) {
      currentCodeList = trueOutgoerCodeList.map(
        (code) => getTryExceptCode("try", currentIndent) + blockCode + code + getTryExceptCode("except", currentIndent)
      );
    } else if (trueOutgoerCodeList.length === 0 && falseOutgoerCodeList.length === 0) {
      currentCodeList = [
        getTryExceptCode("try", currentIndent) + blockCode + getTryExceptCode("except", currentIndent),
      ];
    } else {
      currentCodeList = trueOutgoerCodeList.flatMap((trueCode) =>
        falseOutgoerCodeList.map(
          (falseCode) =>
            getTryExceptCode("try", currentIndent) +
            blockCode +
            trueCode +
            getTryExceptCode("except", currentIndent) +
            falseCode
        )
      );
    }

    codeMap.set(current.id, currentCodeList);
  } else {
    outgoers.forEach((outgoer) => generate_util(outgoer, nodes, edges, codeMap, closureMap, currentIndent));
    const outgoerCodeList = outgoers.flatMap((outgoer) => codeMap.get(outgoer.id));
    const blockCode = getBlockCode(current, currentIndent);
    let currentCodeList = outgoerCodeList.map((code) => blockCode + code);
    if (currentCodeList.length === 0) {
      currentCodeList.push(blockCode);
    }
    codeMap.set(current.id, currentCodeList);
  }
};

export const getTryExceptCode = (part: "try" | "except", indent = 1, exceptionType = "ImageNotFoundException") => {
  if (part === "try") {
    return `${" ".repeat(indent * 4)}try:\n`;
  }
  return `${" ".repeat(indent * 4)}except ${exceptionType}:\n${" ".repeat((indent + 1) * 4)}pass\n`;
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

export const generate = generate_bottom2top;
