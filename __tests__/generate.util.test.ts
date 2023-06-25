import { Edge, Node } from "reactflow";
import {
  generate,
  getBlockCode,
  getEntryPoints,
} from "../app/home-components/generate.util";

test("generate: rejects no entry point (no start block)", async () => {
  const nodes: Node[] = [
    { id: "n2", type: "click", position: { x: 0, y: 0 }, data: null },
    { id: "n3", type: "wait", position: { x: 0, y: 0 }, data: null },
  ];
  const edges: Edge[] = [{ id: "e1", source: "n2", target: "n3" }];

  await expect(generate(nodes, edges)).rejects.toThrowError("no entry point");
});

test("generate: rejects no entry point (start block present)", async () => {
  const nodes: Node[] = [
    { id: "n1", type: "start", position: { x: 0, y: 0 }, data: null },
    { id: "n2", type: "click", position: { x: 0, y: 0 }, data: null },
    { id: "n3", type: "wait", position: { x: 0, y: 0 }, data: null },
  ];
  const edges: Edge[] = [{ id: "e1", source: "n2", target: "n3" }];

  await expect(generate(nodes, edges)).rejects.toThrowError("no entry point");
});

test("getEntryPoints: should be empty)", () => {
  const nodes: Node[] = [
    { id: "n1", type: "start", position: { x: 0, y: 0 }, data: null },
    { id: "n2", type: "click", position: { x: 0, y: 0 }, data: null },
    { id: "n3", type: "wait", position: { x: 0, y: 0 }, data: null },
  ];
  const edges: Edge[] = [{ id: "e1", source: "n2", target: "n3" }];

  expect(getEntryPoints(nodes, edges)).toStrictEqual([]);
});

test("getEntryPoints: should be 1 (separate start blocks)", () => {
  const nodes: Node[] = [
    { id: "n1", type: "start", position: { x: 0, y: 0 }, data: null },
    { id: "n2", type: "start", position: { x: 0, y: 0 }, data: null },
    { id: "n3", type: "click", position: { x: 0, y: 0 }, data: null },
    { id: "n4", type: "wait", position: { x: 0, y: 0 }, data: null },
  ];
  const edges: Edge[] = [
    { id: "e1", source: "n1", target: "n3" },
    { id: "e2", source: "n1", target: "n4" },
  ];

  expect(getEntryPoints(nodes, edges)).toStrictEqual([nodes[0]]);
});

test("getEntryPoints: should be 2 (separate start blocks)", () => {
  const nodes: Node[] = [
    { id: "n1", type: "start", position: { x: 0, y: 0 }, data: null },
    { id: "n2", type: "start", position: { x: 0, y: 0 }, data: null },
    { id: "n3", type: "click", position: { x: 0, y: 0 }, data: null },
    { id: "n4", type: "wait", position: { x: 0, y: 0 }, data: null },
  ];
  const edges: Edge[] = [
    { id: "e1", source: "n1", target: "n3" },
    { id: "e2", source: "n2", target: "n4" },
  ];

  expect(getEntryPoints(nodes, edges)).toStrictEqual([nodes[0], nodes[1]]);
});

test("getEntryPoints: should be 2 (separate start blocks combined)", () => {
  const nodes: Node[] = [
    { id: "n1", type: "start", position: { x: 0, y: 0 }, data: null },
    { id: "n2", type: "start", position: { x: 0, y: 0 }, data: null },
    { id: "n3", type: "click", position: { x: 0, y: 0 }, data: null },
    { id: "n4", type: "wait", position: { x: 0, y: 0 }, data: null },
  ];
  const edges: Edge[] = [
    { id: "e1", source: "n1", target: "n3" },
    { id: "e2", source: "n1", target: "n4" },
    { id: "e3", source: "n2", target: "n4" },
  ];

  expect(getEntryPoints(nodes, edges)).toStrictEqual([nodes[0], nodes[1]]);
});

test("generate: resolves no fork (one entry), no branch, no loop", async () => {
  /* prettier-ignore */
  const nodes: Node[] = [
    { id: "n1", type: "start", position: { x: 0, y: 0 }, data: null },
    { id: "n2", type: "click", position: { x: 0, y: 0 }, data: {text:"100, 100"} },
    { id: "n3", type: "wait", position: { x: 0, y: 0 }, data: {text: "5"} },
  ];
  const edges: Edge[] = [
    { id: "e1", source: "n1", target: "n2" },
    { id: "e2", source: "n2", target: "n3" },
  ];

  /* prettier-ignore */
  let expected = "";
  expected += getBlockCode(nodes[0]);
  expected += getBlockCode(nodes[1]);
  expected += getBlockCode(nodes[2]);
  expected += "\n";
  await expect(generate(nodes, edges)).resolves.toBe(expected);
});

test("generate: resolves no fork (2 entry), no branch, no loop", async () => {
  /* prettier-ignore */
  const nodes: Node[] = [
    { id: "n1", type: "start", position: { x: 0, y: 0 }, data: null },
    { id: "n2", type: "start", position: { x: 0, y: 0 }, data: null },
    { id: "n3", type: "click", position: { x: 0, y: 0 }, data: {text:"100, 100"} },
    { id: "n4", type: "wait", position: { x: 0, y: 0 }, data: {text: "5"} },
  ];
  const edges: Edge[] = [
    { id: "e1", source: "n1", target: "n3" },
    { id: "e2", source: "n2", target: "n4" },
  ];

  /* prettier-ignore */
  let expected = "";
  expected += getBlockCode(nodes[0]);
  expected += getBlockCode(nodes[2]);
  expected += "\n";
  expected += getBlockCode(nodes[1]);
  expected += getBlockCode(nodes[3]);
  expected += "\n";
  await expect(generate(nodes, edges)).resolves.toBe(expected);
});

test("generate: resolves forked (simple), no branch, no loop", async () => {
  /* prettier-ignore */
  const nodes: Node[] = [
    { id: "n1", type: "start", position: { x: 0, y: 0 }, data: null },
    { id: "n2", type: "click", position: { x: 0, y: 0 }, data: {text:"100, 100"} },
    { id: "n3", type: "click", position: { x: 0, y: 0 }, data: {text:"200, 200"} },
  ];
  const edges: Edge[] = [
    { id: "e1", source: "n1", target: "n2" },
    { id: "e2", source: "n1", target: "n3" },
  ];

  let expected = "";
  expected += getBlockCode(nodes[0]);
  expected += getBlockCode(nodes[1]);
  expected += "\n";
  expected += getBlockCode(nodes[0]);
  expected += getBlockCode(nodes[2]);
  expected += "\n";
  await expect(generate(nodes, edges)).resolves.toBe(expected);
});

test("generate: resolves forked (complex), no branch, no loop", async () => {
  /* prettier-ignore */
  const nodes: Node[] = [
    { id: "n1", type: "start", position: { x: 0, y: 0 }, data: null },
    { id: "n2", type: "click", position: { x: 0, y: 0 }, data: {text:"200, 200"} },
    { id: "n3", type: "click", position: { x: 0, y: 0 }, data: {text:"300, 300"} },
    { id: "n4", type: "click", position: { x: 0, y: 0 }, data: {text:"400, 400"} },
    { id: "n5", type: "click", position: { x: 0, y: 0 }, data: {text:"500, 500"} },
    { id: "n6", type: "click", position: { x: 0, y: 0 }, data: {text:"600, 600"} },
  ];
  const edges: Edge[] = [
    { id: "e1", source: "n1", target: "n2" },
    { id: "e2", source: "n1", target: "n3" },
    { id: "e3", source: "n2", target: "n3" },
    { id: "e4", source: "n2", target: "n4" },
    { id: "e5", source: "n2", target: "n5" },
    { id: "e6", source: "n3", target: "n6" },
  ];

  let expected = "";
  expected += getBlockCode(nodes[0]);
  expected += getBlockCode(nodes[2]);
  expected += getBlockCode(nodes[5]);
  expected += "\n";
  expected += getBlockCode(nodes[0]);
  expected += getBlockCode(nodes[1]);
  expected += getBlockCode(nodes[2]);
  expected += getBlockCode(nodes[5]);
  expected += "\n";
  expected += getBlockCode(nodes[0]);
  expected += getBlockCode(nodes[1]);
  expected += getBlockCode(nodes[3]);
  expected += "\n";
  expected += getBlockCode(nodes[0]);
  expected += getBlockCode(nodes[1]);
  expected += getBlockCode(nodes[4]);
  expected += "\n";
  await expect(generate(nodes, edges)).resolves.toBe(expected);
});
