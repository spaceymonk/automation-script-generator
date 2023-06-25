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

test("generate: resolves single thread, no branch, no loop", async () => {
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
  const expected = `${getBlockCode(nodes[0])}${getBlockCode(nodes[1])}${getBlockCode(nodes[2])}`;
  await expect(generate(nodes, edges)).resolves.toBe(expected);
});
