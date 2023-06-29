import cloneDeep from "lodash.clonedeep";
import { Edge, Node, getOutgoers } from "reactflow";

export const getEntryPoints = (nodes: Node[], edges: Edge[]) =>
  Object.values(
    nodes
      .filter((n) => n.type === "start" && getOutgoers(n, nodes, edges).length !== 0)
      .reduce((acc, n) => ({ ...acc, [n.id]: n }), {}) as Node[]
  );

const traverseTreeDFS = (node: Node, callback: (n: Node) => void, nodes: Node[], edges: Edge[]) => {
  const ss = [node];
  while (ss.length > 0) {
    const current = ss.pop() as Node;
    callback(current);
    ss.push(...getOutgoers(current, nodes, edges));
  }
};

export const generate = async (nodes: Node[], edges: Edge[], debugging?: boolean): Promise<string> =>
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

const markerGenerator =
  (suffix1: string, suffix2: string, current: Node, closureMap: Map<string, Set<string>>) =>
  (child: Node): void => {
    const childClosure = closureMap.get(child.id) || new Set();
    if (childClosure.has(current.id + suffix1)) {
      childClosure.delete(current.id + suffix1);
    } else {
      childClosure.add(current.id + suffix2);
    }
    closureMap.set(child.id, childClosure);
  };

const separatorGenerator =
  (suffix: string, excludedItemList: Node[], current: Node, closureMap: Map<string, Set<string>>) =>
  (node: Node): boolean => {
    if (closureMap.get(node.id)?.has(current.id + suffix)) {
      return true;
    }
    if (!excludedItemList.includes(node)) {
      excludedItemList.push(node);
    }
    return false;
  };

const generate_util = (
  current: Node,
  nodes: Node[],
  edges: Edge[],
  codeMap: Map<string, string[]>,
  closureMap = new Map<string, Set<string>>(),
  currentIndent = 1,
  predicate: (node: Node) => boolean = () => true
) => {
  const outgoers = getOutgoers(current, nodes, edges);

  if (current.type === "find") {
    generate_util_branch(outgoers, edges, current, closureMap, nodes, codeMap, currentIndent);
  } else {
    outgoers
      .filter(predicate)
      .forEach((outgoer) => generate_util(outgoer, nodes, edges, codeMap, closureMap, currentIndent, predicate));
    const outgoerCodeList = outgoers.flatMap((outgoer) => codeMap.get(outgoer.id) || [""]);
    const blockCode = getBlockCode(current, currentIndent);
    let currentCodeList = outgoerCodeList.map((code) => blockCode + code);
    if (currentCodeList.length === 0) {
      currentCodeList.push(blockCode);
    }
    codeMap.set(current.id, currentCodeList);
  }
};

export const getTryExceptPassCode = (
  part: "try" | "except" | "pass",
  indent = 1,
  exceptionType = "ImageNotFoundException"
) => {
  if (part === "try") {
    return `${" ".repeat(indent * 4)}try:\n`;
  }
  if (part === "pass") {
    return `${" ".repeat(indent * 4)}pass\n`;
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

const generate_util_branch = (
  outgoers: Node<any, string | undefined>[],
  edges: Edge[],
  current: Node,
  closureMap: Map<string, Set<string>>,
  nodes: Node[],
  codeMap: Map<string, string[]>,
  currentIndent: number
) => {
  let trueOutgoers = [] as Node[];
  let falseOutgoers = [] as Node[];
  let remainingOutgoers = [] as Node[];
  outgoers.forEach((outgoer) => {
    const fromTrueHandle = edges.some(
      (e) => e.source === current.id && e.target === outgoer.id && e.sourceHandle === "true"
    );
    const fromFalseHandle = edges.some(
      (e) => e.source === current.id && e.target === outgoer.id && e.sourceHandle === "false"
    );
    if (fromTrueHandle) {
      trueOutgoers.push(outgoer);
      traverseTreeDFS(outgoer, markerGenerator("-false", "-true", current, closureMap), nodes, edges);
    }
    if (fromFalseHandle) {
      falseOutgoers.push(outgoer);
      traverseTreeDFS(outgoer, markerGenerator("-true", "-false", current, closureMap), nodes, edges);
    }
  });

  const trueChildrenFilter = separatorGenerator("-true", remainingOutgoers, current, closureMap);
  const falseChildrenFilter = separatorGenerator("-false", remainingOutgoers, current, closureMap);

  trueOutgoers = trueOutgoers.filter(trueChildrenFilter);
  falseOutgoers = falseOutgoers.filter(falseChildrenFilter);

  const clonedCodeMap = cloneDeep(codeMap);
  trueOutgoers.forEach((outgoer) =>
    generate_util(outgoer, nodes, edges, clonedCodeMap, closureMap, currentIndent + 1, trueChildrenFilter)
  );
  falseOutgoers.forEach((outgoer) =>
    generate_util(outgoer, nodes, edges, clonedCodeMap, closureMap, currentIndent + 1, falseChildrenFilter)
  );
  remainingOutgoers.forEach((outgoer) => generate_util(outgoer, nodes, edges, codeMap, closureMap, currentIndent));

  let currentCodeList = [] as string[];
  const trueOutgoerCodeList = trueOutgoers.flatMap((outgoer) => clonedCodeMap.get(outgoer.id));
  const falseOutgoerCodeList = falseOutgoers.flatMap((outgoer) => clonedCodeMap.get(outgoer.id));
  const remainingOutgoerCodeList = remainingOutgoers.flatMap((outgoer) => codeMap.get(outgoer.id));
  const blockCode = getBlockCode(current, currentIndent + 1);
  if (trueOutgoerCodeList.length === 0 && falseOutgoerCodeList.length !== 0) {
    currentCodeList = falseOutgoerCodeList.map(
      (falseCode) =>
        getTryExceptPassCode("try", currentIndent) +
        blockCode +
        getTryExceptPassCode("except", currentIndent) +
        falseCode
    );
  } else if (trueOutgoerCodeList.length !== 0 && falseOutgoerCodeList.length === 0) {
    currentCodeList = trueOutgoerCodeList.map(
      (trueCode) =>
        getTryExceptPassCode("try", currentIndent) +
        blockCode +
        trueCode +
        getTryExceptPassCode("except", currentIndent) +
        getTryExceptPassCode("pass", currentIndent + 1)
    );
  } else if (trueOutgoerCodeList.length === 0 && falseOutgoerCodeList.length === 0) {
    currentCodeList = [
      getTryExceptPassCode("try", currentIndent) +
        blockCode +
        getTryExceptPassCode("except", currentIndent) +
        getTryExceptPassCode("pass", currentIndent + 1),
    ];
  } else {
    currentCodeList = trueOutgoerCodeList.flatMap((trueCode) =>
      falseOutgoerCodeList.map(
        (falseCode) =>
          getTryExceptPassCode("try", currentIndent) +
          blockCode +
          trueCode +
          getTryExceptPassCode("except", currentIndent) +
          falseCode
      )
    );
  }

  remainingOutgoerCodeList.forEach((remainingCode) => {
    currentCodeList.forEach((_, index) => {
      currentCodeList[index] += remainingCode;
    });
  });

  codeMap.set(current.id, currentCodeList);
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
