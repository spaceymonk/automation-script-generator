import { Edge, Node } from "reactflow";
import {
  generate,
  getBlockCode,
  getEntryPoints,
} from "../app/home-components/generate.util";

describe("[getEntryPoint]", () => {
  test("should be empty", () => {
    /* prettier-ignore */
    const nodes: Node[] = [
      { id: "n1", type: "start", position: { x: 0, y: 0 }, data: { text: "n1" } },
      { id: "n2", type: "click", position: { x: 0, y: 0 }, data: { text: "n2" } },
      { id: "n3", type: "wait", position: { x: 0, y: 0 }, data: { text: "n3" } },
    ];
    const edges: Edge[] = [{ id: "e1", source: "n2", target: "n3" }];

    expect(getEntryPoints(nodes, edges)).toStrictEqual([]);
  });

  test("should be 1 (separate start blocks)", () => {
    /* prettier-ignore */
    const nodes: Node[] = [
      { id: "n1", type: "start", position: { x: 0, y: 0 }, data: { text: "n1" } },
      { id: "n2", type: "start", position: { x: 0, y: 0 }, data: { text: "n2" } },
      { id: "n3", type: "click", position: { x: 0, y: 0 }, data: { text: "n3" } },
      { id: "n4", type: "wait", position: { x: 0, y: 0 }, data: { text: "n4" } },
    ];
    const edges: Edge[] = [
      { id: "e1", source: "n1", target: "n3" },
      { id: "e2", source: "n1", target: "n4" },
    ];

    expect(getEntryPoints(nodes, edges)).toStrictEqual([nodes[0]]);
  });

  test("should be 2 (separate start blocks)", () => {
    /* prettier-ignore */
    const nodes: Node[] = [
      { id: "n1", type: "start", position: { x: 0, y: 0 }, data: { text: "n1" } },
      { id: "n2", type: "start", position: { x: 0, y: 0 }, data: { text: "n2" } },
      { id: "n3", type: "click", position: { x: 0, y: 0 }, data: { text: "n3" } },
      { id: "n4", type: "wait", position: { x: 0, y: 0 }, data: { text: "n4" } },
    ];
    const edges: Edge[] = [
      { id: "e1", source: "n1", target: "n3" },
      { id: "e2", source: "n2", target: "n4" },
    ];

    expect(getEntryPoints(nodes, edges)).toStrictEqual([nodes[0], nodes[1]]);
  });

  test("should be 2 (separate start blocks combined)", () => {
    /* prettier-ignore */
    const nodes: Node[] = [
      { id: "n1", type: "start", position: { x: 0, y: 0 }, data: { text: "n1" } },
      { id: "n2", type: "start", position: { x: 0, y: 0 }, data: { text: "n2" } },
      { id: "n3", type: "click", position: { x: 0, y: 0 }, data: { text: "n3" } },
      { id: "n4", type: "wait", position: { x: 0, y: 0 }, data: { text: "n4" } },
    ];
    const edges: Edge[] = [
      { id: "e1", source: "n1", target: "n3" },
      { id: "e2", source: "n1", target: "n4" },
      { id: "e3", source: "n2", target: "n4" },
    ];

    expect(getEntryPoints(nodes, edges)).toStrictEqual([nodes[0], nodes[1]]);
  });
});

describe("[generate]", () => {
  describe("exceptions", () => {
    test("rejects no entry point (no start block)", async () => {
      /* prettier-ignore */
      const nodes: Node[] = [
        { id: "n2", type: "click", position: { x: 0, y: 0 }, data: { text: "n2" } },
        { id: "n3", type: "wait", position: { x: 0, y: 0 }, data: { text: "n3" } },
      ];
      const edges: Edge[] = [{ id: "e1", source: "n2", target: "n3" }];

      await expect(generate(nodes, edges)).rejects.toThrowError(
        "no entry point"
      );
    });

    test("rejects no entry point (start block present)", async () => {
      /* prettier-ignore */
      const nodes: Node[] = [
        { id: "n1", type: "start", position: { x: 0, y: 0 }, data: { text: "n1" } },
        { id: "n2", type: "click", position: { x: 0, y: 0 }, data: { text: "n2" } },
        { id: "n3", type: "wait", position: { x: 0, y: 0 }, data: { text: "n3" } },
      ];
      const edges: Edge[] = [{ id: "e1", source: "n2", target: "n3" }];

      await expect(generate(nodes, edges)).rejects.toThrowError(
        "no entry point"
      );
    });
  });

  describe("no fork, no branch, no loop", () => {
    test("resolves with one entry point data", async () => {
      /* prettier-ignore */
      const nodes: Node[] = [
        { id: "n1", type: "start", position: { x: 0, y: 0 }, data: { text: "n1" } },
        { id: "n2", type: "click", position: { x: 0, y: 0 }, data: { text: "n2" } },
        { id: "n3", type: "wait", position: { x: 0, y: 0 }, data: { text: "n3" } },
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

    test("resolves with multiple entry point data", async () => {
      /* prettier-ignore */
      const nodes: Node[] = [
        { id: "n1", type: "start", position: { x: 0, y: 0 }, data: { text: "n1" } },
        { id: "n2", type: "start", position: { x: 0, y: 0 }, data: { text: "n2" } },
        { id: "n3", type: "click", position: { x: 0, y: 0 }, data: { text: "n3" } },
        { id: "n4", type: "wait", position: { x: 0, y: 0 }, data: { text: "n4" } },
      ];
      const edges: Edge[] = [
        { id: "e1", source: "n1", target: "n3" },
        { id: "e2", source: "n2", target: "n4" },
      ];

      let expected = "";
      expected += getBlockCode(nodes[0]);
      expected += getBlockCode(nodes[2]);
      expected += "\n";
      expected += getBlockCode(nodes[1]);
      expected += getBlockCode(nodes[3]);
      expected += "\n";
      await expect(generate(nodes, edges)).resolves.toBe(expected);
    });
  });

  describe("forked, no branch, no loop", () => {
    test("resolves forked from single start block with no merged connection", async () => {
      /* prettier-ignore */
      const nodes: Node[] = [
        { id: "n1", type: "start", position: { x: 0, y: 0 }, data: { text: "n1" } },
        { id: "n2", type: "click", position: { x: 0, y: 0 }, data: { text: "n2" } },
        { id: "n3", type: "click", position: { x: 0, y: 0 }, data: { text: "n3" } },
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

    test("resolves forked from single start block with merged connection", async () => {
      /* prettier-ignore */
      const nodes: Node[] = [
        { id: "n1", type: "start", position: { x: 0, y: 0 }, data: { text: "n1" } },
        { id: "n2", type: "click", position: { x: 0, y: 0 }, data: { text: "n2" } },
        { id: "n3", type: "click", position: { x: 0, y: 0 }, data: { text: "n3" } },
        { id: "n4", type: "click", position: { x: 0, y: 0 }, data: { text: "n4" } },
        { id: "n5", type: "click", position: { x: 0, y: 0 }, data: { text: "n5" } },
      ];
      const edges: Edge[] = [
        { id: "e1", source: "n1", target: "n2" },
        { id: "e2", source: "n1", target: "n3" },
        { id: "e3", source: "n2", target: "n4" },
        { id: "e4", source: "n3", target: "n4" },
        { id: "e5", source: "n4", target: "n5" },
      ];

      let expected = "";
      expected += getBlockCode(nodes[0]);
      expected += getBlockCode(nodes[2]);
      expected += getBlockCode(nodes[3]);
      expected += getBlockCode(nodes[4]);
      expected += "\n";
      expected += getBlockCode(nodes[0]);
      expected += getBlockCode(nodes[1]);
      expected += getBlockCode(nodes[3]);
      expected += getBlockCode(nodes[4]);
      expected += "\n";
      await expect(generate(nodes, edges)).resolves.toBe(expected);
    });

    test("resolves forked from multiple start block with no merged connection", async () => {
      /* prettier-ignore */
      const nodes: Node[] = [
        { id: "n1", type: "start", position: { x: 0, y: 0 }, data: { text: "n1" } },
        { id: "n2", type: "click", position: { x: 0, y: 0 }, data: { text: "n2" } },
        { id: "n3", type: "click", position: { x: 0, y: 0 }, data: { text: "n3" } },
        { id: "n4", type: "start", position: { x: 0, y: 0 }, data: { text: "n4" } },
        { id: "n5", type: "click", position: { x: 0, y: 0 }, data: { text: "n5" } },
        { id: "n6", type: "click", position: { x: 0, y: 0 }, data: { text: "n6" } },
      ];
      const edges: Edge[] = [
        { id: "e1", source: "n1", target: "n2" },
        { id: "e2", source: "n1", target: "n3" },
        { id: "e3", source: "n4", target: "n5" },
        { id: "e4", source: "n4", target: "n6" },
      ];

      let expected = "";
      expected += getBlockCode(nodes[0]);
      expected += getBlockCode(nodes[1]);
      expected += "\n";
      expected += getBlockCode(nodes[0]);
      expected += getBlockCode(nodes[2]);
      expected += "\n";
      expected += getBlockCode(nodes[3]);
      expected += getBlockCode(nodes[4]);
      expected += "\n";
      expected += getBlockCode(nodes[3]);
      expected += getBlockCode(nodes[5]);
      expected += "\n";
      await expect(generate(nodes, edges)).resolves.toBe(expected);
    });

    test("resolves forked from multiple start block with merged connection (complex)", async () => {
      /* prettier-ignore */
      const nodes: Node[] = [
        { id: "n1", type: "start", position: { x: 0, y: 0 }, data: { text: "n1" } },
        { id: "n2", type: "click", position: { x: 0, y: 0 }, data: { text: "n2" } },
        { id: "n3", type: "click", position: { x: 0, y: 0 }, data: { text: "n3" } },
        { id: "n4", type: "click", position: { x: 0, y: 0 }, data: { text: "n4" } },
        { id: "n5", type: "click", position: { x: 0, y: 0 }, data: { text: "n5" } },
        { id: "n6", type: "click", position: { x: 0, y: 0 }, data: { text: "n6" } },
        { id: "n7", type: "click", position: { x: 0, y: 0 }, data: { text: "n7" } },
        { id: "n8", type: "start", position: { x: 0, y: 0 }, data: { text: "n8" } },
      ];
      const edges: Edge[] = [
        { id: "e1", source: "n1", target: "n2" },
        { id: "e2", source: "n2", target: "n3" },
        { id: "e3", source: "n2", target: "n4" },
        { id: "e4", source: "n4", target: "n6" },
        { id: "e5", source: "n6", target: "n7" },
        { id: "e6", source: "n1", target: "n5" },
        { id: "e7", source: "n5", target: "n6" },
        { id: "e8", source: "n8", target: "n5" },
      ];

      let expected = "";
      expected += getBlockCode(nodes[0]);
      expected += getBlockCode(nodes[4]);
      expected += getBlockCode(nodes[5]);
      expected += getBlockCode(nodes[6]);
      expected += "\n";
      expected += getBlockCode(nodes[0]);
      expected += getBlockCode(nodes[1]);
      expected += getBlockCode(nodes[3]);
      expected += getBlockCode(nodes[5]);
      expected += getBlockCode(nodes[6]);
      expected += "\n";
      expected += getBlockCode(nodes[7]);
      expected += getBlockCode(nodes[4]);
      expected += getBlockCode(nodes[5]);
      expected += getBlockCode(nodes[6]);
      expected += "\n";
      expected += getBlockCode(nodes[0]);
      expected += getBlockCode(nodes[1]);
      expected += getBlockCode(nodes[2]);
      expected += "\n";
      await expect(generate(nodes, edges)).resolves.toBe(expected);
    });

    test("resolves forked from multiple start block with merged connection (simple)", async () => {
      /* prettier-ignore */
      const nodes: Node[] = [
        { id: "n1", type: "start", position: { x: 0, y: 0 }, data: { text: "n1" } },
        { id: "n2", type: "start", position: { x: 0, y: 0 }, data: { text: "n2" } },
        { id: "n3", type: "start", position: { x: 0, y: 0 }, data: { text: "n3" } },
        { id: "n4", type: "click", position: { x: 0, y: 0 }, data: { text: "n4" } },
      ];
      const edges: Edge[] = [
        { id: "e1", source: "n1", target: "n4" },
        { id: "e2", source: "n2", target: "n4" },
        { id: "e3", source: "n3", target: "n4" },
      ];

      let expected = "";
      expected += getBlockCode(nodes[0]);
      expected += getBlockCode(nodes[3]);
      expected += "\n";
      expected += getBlockCode(nodes[1]);
      expected += getBlockCode(nodes[3]);
      expected += "\n";
      expected += getBlockCode(nodes[2]);
      expected += getBlockCode(nodes[3]);
      expected += "\n";
      await expect(generate(nodes, edges)).resolves.toBe(expected);
    });
  });
});
