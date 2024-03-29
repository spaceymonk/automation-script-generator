import { Edge, Node } from "reactflow";
import { generate, getBlockCode, getEntryPoints, getTryExceptPassCode } from "../app/home-components/generate.util";

describe("[getEntryPoint]", () => {
  test("should be empty", () => {
    const nodes: Node[] = [
      { id: "n1", type: "start", position: { x: 0, y: 0 }, data: { text: "n1" } },
      { id: "n2", type: "click", position: { x: 0, y: 0 }, data: { text: "n2" } },
      { id: "n3", type: "wait", position: { x: 0, y: 0 }, data: { text: "n3" } },
    ];
    const edges: Edge[] = [{ id: "e1", source: "n2", target: "n3" }];

    expect(getEntryPoints(nodes, edges)).toStrictEqual([]);
  });

  test("should be 1 (separate start blocks)", () => {
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
  describe("✨ exceptions ✨", () => {
    test("rejects no entry point (no start block)", async () => {
      const nodes: Node[] = [
        { id: "n2", type: "click", position: { x: 0, y: 0 }, data: { text: "n2" } },
        { id: "n3", type: "wait", position: { x: 0, y: 0 }, data: { text: "n3" } },
      ];
      const edges: Edge[] = [{ id: "e1", source: "n2", target: "n3" }];

      await expect(generate(nodes, edges, true)).rejects.toThrowError("no entry point");
    });

    test("rejects no entry point (start block present)", async () => {
      const nodes: Node[] = [
        { id: "n1", type: "start", position: { x: 0, y: 0 }, data: { text: "n1" } },
        { id: "n2", type: "click", position: { x: 0, y: 0 }, data: { text: "n2" } },
        { id: "n3", type: "wait", position: { x: 0, y: 0 }, data: { text: "n3" } },
      ];
      const edges: Edge[] = [{ id: "e1", source: "n2", target: "n3" }];

      await expect(generate(nodes, edges, true)).rejects.toThrowError("no entry point");
    });
  });

  describe("❎ fork ❎ branch ❎ loop", () => {
    test("resolves with one entry point data", async () => {
      const nodes: Node[] = [
        { id: "n1", type: "start", position: { x: 0, y: 0 }, data: { text: "n1" } },
        { id: "n2", type: "click", position: { x: 0, y: 0 }, data: { text: "n2" } },
        { id: "n3", type: "wait", position: { x: 0, y: 0 }, data: { text: "n3" } },
      ];
      const edges: Edge[] = [
        { id: "e1", source: "n1", target: "n2" },
        { id: "e2", source: "n2", target: "n3" },
      ];

      let expected = "";
      expected += getBlockCode(nodes[0]);
      expected += getBlockCode(nodes[1]);
      expected += getBlockCode(nodes[2]);
      expected += "\n";
      await expect(generate(nodes, edges, true)).resolves.toBe(expected);
    });

    test("resolves with multiple entry point data", async () => {
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
      await expect(generate(nodes, edges, true)).resolves.toBe(expected);
    });
  });

  describe("✅ fork ❎ branch ❎ loop", () => {
    describe("✨ separate ✨", () => {
      test("resolves from one start block", async () => {
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
        await expect(generate(nodes, edges, true)).resolves.toBe(expected);
      });

      test("resolves from two start block", async () => {
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
        await expect(generate(nodes, edges, true)).resolves.toBe(expected);
      });
    });

    describe("✨ merged ✨", () => {
      test("resolves from one start block", async () => {
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
        expected += getBlockCode(nodes[1]);
        expected += getBlockCode(nodes[3]);
        expected += getBlockCode(nodes[4]);
        expected += "\n";
        expected += getBlockCode(nodes[0]);
        expected += getBlockCode(nodes[2]);
        expected += getBlockCode(nodes[3]);
        expected += getBlockCode(nodes[4]);
        expected += "\n";
        await expect(generate(nodes, edges, true)).resolves.toBe(expected);
      });

      test("resolves from three start block", async () => {
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
        await expect(generate(nodes, edges, true)).resolves.toBe(expected);
      });

      test("resolves from multiple blocks", async () => {
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
        expected += getBlockCode(nodes[1]);
        expected += getBlockCode(nodes[2]);
        expected += "\n";
        expected += getBlockCode(nodes[0]);
        expected += getBlockCode(nodes[1]);
        expected += getBlockCode(nodes[3]);
        expected += getBlockCode(nodes[5]);
        expected += getBlockCode(nodes[6]);
        expected += "\n";
        expected += getBlockCode(nodes[0]);
        expected += getBlockCode(nodes[4]);
        expected += getBlockCode(nodes[5]);
        expected += getBlockCode(nodes[6]);
        expected += "\n";
        expected += getBlockCode(nodes[7]);
        expected += getBlockCode(nodes[4]);
        expected += getBlockCode(nodes[5]);
        expected += getBlockCode(nodes[6]);
        expected += "\n";

        await expect(generate(nodes, edges, true)).resolves.toBe(expected);
      });
    });
  });

  describe("❎ fork ✅ branch ❎ loop", () => {
    describe("✨ flatten ✨ separate ✨", () => {
      test("resolves one true and one false children", async () => {
        const nodes: Node[] = [
          { id: "n1", type: "start", position: { x: 0, y: 0 }, data: { text: "n1" } },
          { id: "n2", type: "click", position: { x: 0, y: 0 }, data: { text: "n2" } },
          { id: "n3", type: "click", position: { x: 0, y: 0 }, data: { text: "n3" } },
          { id: "n4", type: "find", position: { x: 0, y: 0 }, data: { text: "n4" } },
        ];
        const edges: Edge[] = [
          { id: "e1", source: "n4", target: "n2", sourceHandle: "true" },
          { id: "e2", source: "n4", target: "n3", sourceHandle: "false" },
          { id: "e3", source: "n1", target: "n4" },
        ];

        let expected = "";
        expected += getTryExceptPassCode("try", 1);
        expected += getBlockCode(nodes[3], 2);
        expected += getBlockCode(nodes[1], 2);
        expected += getTryExceptPassCode("except", 1);
        expected += getBlockCode(nodes[2], 2);
        expected += "\n";
        await expect(generate(nodes, edges, true)).resolves.toBe(expected);
      });

      test("resolves two true and two false children", async () => {
        const nodes: Node[] = [
          { id: "n0", type: "start", position: { x: 0, y: 0 }, data: { text: "n0" } },
          { id: "n1", type: "find", position: { x: 0, y: 0 }, data: { text: "n1" } },
          { id: "n2", type: "click", position: { x: 0, y: 0 }, data: { text: "n2" } },
          { id: "n3", type: "click", position: { x: 0, y: 0 }, data: { text: "n3" } },
          { id: "n4", type: "click", position: { x: 0, y: 0 }, data: { text: "n4" } },
          { id: "n5", type: "click", position: { x: 0, y: 0 }, data: { text: "n5" } },
        ];
        const edges: Edge[] = [
          { id: "e1", source: "n0", target: "n1" },
          { id: "e2", source: "n1", target: "n2", sourceHandle: "true" },
          { id: "e3", source: "n2", target: "n3" },
          { id: "e4", source: "n1", target: "n4", sourceHandle: "false" },
          { id: "e5", source: "n4", target: "n5" },
        ];

        let expected = "";
        expected += getTryExceptPassCode("try", 1);
        expected += getBlockCode(nodes[1], 2);
        expected += getBlockCode(nodes[2], 2);
        expected += getBlockCode(nodes[3], 2);
        expected += getTryExceptPassCode("except", 1);
        expected += getBlockCode(nodes[4], 2);
        expected += getBlockCode(nodes[5], 2);
        expected += "\n";
        await expect(generate(nodes, edges, true)).resolves.toBe(expected);
      });

      test("resolves one true children", async () => {
        const nodes: Node[] = [
          { id: "n0", type: "start", position: { x: 0, y: 0 }, data: { text: "n0" } },
          { id: "n1", type: "find", position: { x: 0, y: 0 }, data: { text: "n1" } },
          { id: "n2", type: "click", position: { x: 0, y: 0 }, data: { text: "n2" } },
        ];
        const edges: Edge[] = [
          { id: "e2", source: "n0", target: "n1" },
          { id: "e1", source: "n1", target: "n2", sourceHandle: "true" },
        ];

        let expected = "";
        expected += getTryExceptPassCode("try", 1);
        expected += getBlockCode(nodes[1], 2);
        expected += getBlockCode(nodes[2], 2);
        expected += getTryExceptPassCode("except", 1);
        expected += getTryExceptPassCode("pass", 2);
        expected += "\n";
        await expect(generate(nodes, edges, true)).resolves.toBe(expected);
      });

      test("resolves two true children", async () => {
        const nodes: Node[] = [
          { id: "n0", type: "start", position: { x: 0, y: 0 }, data: { text: "n0" } },
          { id: "n1", type: "find", position: { x: 0, y: 0 }, data: { text: "n1" } },
          { id: "n2", type: "click", position: { x: 0, y: 0 }, data: { text: "n2" } },
          { id: "n3", type: "click", position: { x: 0, y: 0 }, data: { text: "n3" } },
        ];
        const edges: Edge[] = [
          { id: "e2", source: "n0", target: "n1" },
          { id: "e1", source: "n1", target: "n2", sourceHandle: "true" },
          { id: "e3", source: "n2", target: "n3" },
        ];

        let expected = "";
        expected += getTryExceptPassCode("try", 1);
        expected += getBlockCode(nodes[1], 2);
        expected += getBlockCode(nodes[2], 2);
        expected += getBlockCode(nodes[3], 2);
        expected += getTryExceptPassCode("except", 1);
        expected += getTryExceptPassCode("pass", 2);
        expected += "\n";
        await expect(generate(nodes, edges, true)).resolves.toBe(expected);
      });

      test("resolves one false children", async () => {
        const nodes: Node[] = [
          { id: "n0", type: "start", position: { x: 0, y: 0 }, data: { text: "n0" } },
          { id: "n1", type: "find", position: { x: 0, y: 0 }, data: { text: "n1" } },
          { id: "n2", type: "click", position: { x: 0, y: 0 }, data: { text: "n2" } },
        ];
        const edges: Edge[] = [
          { id: "e2", source: "n0", target: "n1" },
          { id: "e1", source: "n1", target: "n2", sourceHandle: "false" },
        ];

        let expected = "";
        expected += getTryExceptPassCode("try", 1);
        expected += getBlockCode(nodes[1], 2);
        expected += getTryExceptPassCode("except", 1);
        expected += getBlockCode(nodes[2], 2);
        expected += "\n";
        await expect(generate(nodes, edges, true)).resolves.toBe(expected);
      });

      test("resolves two false children", async () => {
        const nodes: Node[] = [
          { id: "n0", type: "start", position: { x: 0, y: 0 }, data: { text: "n0" } },
          { id: "n1", type: "find", position: { x: 0, y: 0 }, data: { text: "n1" } },
          { id: "n2", type: "click", position: { x: 0, y: 0 }, data: { text: "n2" } },
          { id: "n3", type: "click", position: { x: 0, y: 0 }, data: { text: "n3" } },
        ];
        const edges: Edge[] = [
          { id: "e2", source: "n0", target: "n1" },
          { id: "e1", source: "n1", target: "n2", sourceHandle: "false" },
          { id: "e3", source: "n2", target: "n3" },
        ];

        let expected = "";
        expected += getTryExceptPassCode("try", 1);
        expected += getBlockCode(nodes[1], 2);
        expected += getTryExceptPassCode("except", 1);
        expected += getBlockCode(nodes[2], 2);
        expected += getBlockCode(nodes[3], 2);
        expected += "\n";
        await expect(generate(nodes, edges, true)).resolves.toBe(expected);
      });

      test("resolves no children", async () => {
        const nodes: Node[] = [
          { id: "n0", type: "start", position: { x: 0, y: 0 }, data: { text: "n0" } },
          { id: "n1", type: "find", position: { x: 0, y: 0 }, data: { text: "n1" } },
        ];
        const edges: Edge[] = [{ id: "e2", source: "n0", target: "n1" }];

        let expected = "";
        expected += getTryExceptPassCode("try", 1);
        expected += getBlockCode(nodes[1], 2);
        expected += getTryExceptPassCode("except", 1);
        expected += getTryExceptPassCode("pass", 2);
        expected += "\n";
        await expect(generate(nodes, edges, true)).resolves.toBe(expected);
      });
    });
    describe("✨ flatten ✨ merged ✨", () => {
      test("resolves two true and two false children merged into one", async () => {
        const nodes: Node[] = [
          { id: "n0", type: "start", position: { x: 0, y: 0 }, data: { text: "n0" } },
          { id: "n1", type: "find", position: { x: 0, y: 0 }, data: { text: "n1" } },
          { id: "n2", type: "click", position: { x: 0, y: 0 }, data: { text: "n2" } },
          { id: "n3", type: "click", position: { x: 0, y: 0 }, data: { text: "n3" } },
          { id: "n4", type: "click", position: { x: 0, y: 0 }, data: { text: "n4" } },
          { id: "n5", type: "click", position: { x: 0, y: 0 }, data: { text: "n5" } },
          { id: "n6", type: "click", position: { x: 0, y: 0 }, data: { text: "n6" } },
          { id: "n7", type: "click", position: { x: 0, y: 0 }, data: { text: "n7" } },
        ];
        const edges: Edge[] = [
          { id: "e1", source: "n0", target: "n1" },
          { id: "e2", source: "n1", target: "n2", sourceHandle: "true" },
          { id: "e3", source: "n2", target: "n3" },
          { id: "e4", source: "n1", target: "n4", sourceHandle: "false" },
          { id: "e5", source: "n4", target: "n5" },
          { id: "e6", source: "n5", target: "n6" },
          { id: "e7", source: "n3", target: "n6" },
          { id: "e8", source: "n6", target: "n7" },
        ];

        let expected = "";
        expected += getTryExceptPassCode("try", 1);
        expected += getBlockCode(nodes[1], 2);
        expected += getBlockCode(nodes[2], 2);
        expected += getBlockCode(nodes[3], 2);
        expected += getTryExceptPassCode("except", 1);
        expected += getBlockCode(nodes[4], 2);
        expected += getBlockCode(nodes[5], 2);
        expected += getBlockCode(nodes[6], 1);
        expected += getBlockCode(nodes[7], 1);
        expected += "\n";
        await expect(generate(nodes, edges, true)).resolves.toBe(expected);
      });

      test("resolves two true and no false children merged into one", async () => {
        const nodes: Node[] = [
          { id: "n0", type: "start", position: { x: 0, y: 0 }, data: { text: "n0" } },
          { id: "n1", type: "find", position: { x: 0, y: 0 }, data: { text: "n1" } },
          { id: "n2", type: "click", position: { x: 0, y: 0 }, data: { text: "n2" } },
          { id: "n3", type: "click", position: { x: 0, y: 0 }, data: { text: "n3" } },
          { id: "n4", type: "click", position: { x: 0, y: 0 }, data: { text: "n4" } },
        ];
        const edges: Edge[] = [
          { id: "e1", source: "n0", target: "n1" },
          { id: "e2", source: "n1", target: "n2", sourceHandle: "true" },
          { id: "e3", source: "n2", target: "n3" },
          { id: "e4", source: "n1", target: "n4", sourceHandle: "false" },
          { id: "e7", source: "n3", target: "n4" },
        ];

        let expected = "";
        expected += getTryExceptPassCode("try", 1);
        expected += getBlockCode(nodes[1], 2);
        expected += getBlockCode(nodes[2], 2);
        expected += getBlockCode(nodes[3], 2);
        expected += getTryExceptPassCode("except", 1);
        expected += getTryExceptPassCode("pass", 2);
        expected += getBlockCode(nodes[4], 1);
        expected += "\n";
        await expect(generate(nodes, edges, true)).resolves.toBe(expected);
      });

      test("resolves no true and two false children merged into one", async () => {
        const nodes: Node[] = [
          { id: "n0", type: "start", position: { x: 0, y: 0 }, data: { text: "n0" } },
          { id: "n1", type: "find", position: { x: 0, y: 0 }, data: { text: "n1" } },
          { id: "n2", type: "click", position: { x: 0, y: 0 }, data: { text: "n2" } },
          { id: "n3", type: "click", position: { x: 0, y: 0 }, data: { text: "n3" } },
          { id: "n4", type: "click", position: { x: 0, y: 0 }, data: { text: "n4" } },
        ];
        const edges: Edge[] = [
          { id: "e1", source: "n0", target: "n1" },
          { id: "e2", source: "n1", target: "n2", sourceHandle: "false" },
          { id: "e3", source: "n2", target: "n3" },
          { id: "e4", source: "n1", target: "n4", sourceHandle: "true" },
          { id: "e7", source: "n3", target: "n4" },
        ];

        let expected = "";
        expected += getTryExceptPassCode("try", 1);
        expected += getBlockCode(nodes[1], 2);
        expected += getTryExceptPassCode("except", 1);
        expected += getBlockCode(nodes[2], 2);
        expected += getBlockCode(nodes[3], 2);
        expected += getBlockCode(nodes[4], 1);
        expected += "\n";
        await expect(generate(nodes, edges, true)).resolves.toBe(expected);
      });

      test("resolves no true and no false children merged into one", async () => {
        const nodes: Node[] = [
          { id: "n0", type: "start", position: { x: 0, y: 0 }, data: { text: "n0" } },
          { id: "n1", type: "find", position: { x: 0, y: 0 }, data: { text: "n1" } },
          { id: "n2", type: "click", position: { x: 0, y: 0 }, data: { text: "n2" } },
          { id: "n3", type: "click", position: { x: 0, y: 0 }, data: { text: "n3" } },
        ];
        const edges: Edge[] = [
          { id: "e1", source: "n0", target: "n1" },
          { id: "e2", source: "n1", target: "n2", sourceHandle: "false" },
          { id: "e3", source: "n2", target: "n3" },
          { id: "e4", source: "n1", target: "n2", sourceHandle: "true" },
        ];

        let expected = "";
        expected += getTryExceptPassCode("try", 1);
        expected += getBlockCode(nodes[1], 2);
        expected += getTryExceptPassCode("except", 1);
        expected += getTryExceptPassCode("pass", 2);
        expected += getBlockCode(nodes[2], 1);
        expected += getBlockCode(nodes[3], 1);
        expected += "\n";
        await expect(generate(nodes, edges, true)).resolves.toBe(expected);
      });

      test("resolves two find blocks with merged false handle", async () => {
        const nodes: Node[] = [
          { id: "n0", type: "start", position: { x: 0, y: 0 }, data: { text: "n0" } },
          { id: "n1", type: "find", position: { x: 0, y: 0 }, data: { text: "n1" } },
          { id: "n2", type: "find", position: { x: 0, y: 0 }, data: { text: "n2" } },
          { id: "n3", type: "click", position: { x: 0, y: 0 }, data: { text: "n3" } },
          { id: "n4", type: "click", position: { x: 0, y: 0 }, data: { text: "n4" } },
          { id: "n5", type: "click", position: { x: 0, y: 0 }, data: { text: "n5" } },
          { id: "n6", type: "click", position: { x: 0, y: 0 }, data: { text: "n6" } },
        ];
        const edges: Edge[] = [
          { id: "e1", source: "n0", target: "n1" },
          { id: "e2", source: "n0", target: "n2" },
          { id: "e3", source: "n1", target: "n3", sourceHandle: "false" },
          { id: "e4", source: "n2", target: "n3", sourceHandle: "false" },
          { id: "e5", source: "n1", target: "n4", sourceHandle: "true" },
          { id: "e6", source: "n2", target: "n5", sourceHandle: "true" },
          { id: "e7", source: "n3", target: "n6" },
        ];

        let expected = "";
        expected += getTryExceptPassCode("try", 1);
        expected += getBlockCode(nodes[1], 2);
        expected += getBlockCode(nodes[4], 2);
        expected += getTryExceptPassCode("except", 1);
        expected += getBlockCode(nodes[3], 2);
        expected += getBlockCode(nodes[6], 2);
        expected += "\n";
        expected += getTryExceptPassCode("try", 1);
        expected += getBlockCode(nodes[2], 2);
        expected += getBlockCode(nodes[5], 2);
        expected += getTryExceptPassCode("except", 1);
        expected += getBlockCode(nodes[3], 2);
        expected += getBlockCode(nodes[6], 2);
        expected += "\n";
        await expect(generate(nodes, edges, true)).resolves.toBe(expected);
      });

      test("resolves two find blocks with merged true handle", async () => {
        const nodes: Node[] = [
          { id: "n0", type: "start", position: { x: 0, y: 0 }, data: { text: "n0" } },
          { id: "n1", type: "find", position: { x: 0, y: 0 }, data: { text: "n1" } },
          { id: "n2", type: "find", position: { x: 0, y: 0 }, data: { text: "n2" } },
          { id: "n3", type: "click", position: { x: 0, y: 0 }, data: { text: "n3" } },
          { id: "n4", type: "click", position: { x: 0, y: 0 }, data: { text: "n4" } },
          { id: "n5", type: "click", position: { x: 0, y: 0 }, data: { text: "n5" } },
          { id: "n6", type: "click", position: { x: 0, y: 0 }, data: { text: "n6" } },
        ];
        const edges: Edge[] = [
          { id: "e1", source: "n0", target: "n1" },
          { id: "e2", source: "n0", target: "n2" },
          { id: "e3", source: "n1", target: "n3", sourceHandle: "true" },
          { id: "e4", source: "n2", target: "n3", sourceHandle: "true" },
          { id: "e5", source: "n1", target: "n4", sourceHandle: "false" },
          { id: "e6", source: "n2", target: "n5", sourceHandle: "false" },
          { id: "e7", source: "n4", target: "n6" },
        ];

        let expected = "";
        expected += getTryExceptPassCode("try", 1);
        expected += getBlockCode(nodes[1], 2);
        expected += getBlockCode(nodes[3], 2);
        expected += getTryExceptPassCode("except", 1);
        expected += getBlockCode(nodes[4], 2);
        expected += getBlockCode(nodes[6], 2);
        expected += "\n";
        expected += getTryExceptPassCode("try", 1);
        expected += getBlockCode(nodes[2], 2);
        expected += getBlockCode(nodes[3], 2);
        expected += getTryExceptPassCode("except", 1);
        expected += getBlockCode(nodes[5], 2);
        expected += "\n";
        await expect(generate(nodes, edges, true)).resolves.toBe(expected);
      });

      test("resolves two find blocks with merged opposite handles", async () => {
        const nodes: Node[] = [
          { id: "n0", type: "start", position: { x: 0, y: 0 }, data: { text: "n0" } },
          { id: "n1", type: "find", position: { x: 0, y: 0 }, data: { text: "n1" } },
          { id: "n2", type: "find", position: { x: 0, y: 0 }, data: { text: "n2" } },
          { id: "n3", type: "click", position: { x: 0, y: 0 }, data: { text: "n3" } },
          { id: "n4", type: "click", position: { x: 0, y: 0 }, data: { text: "n4" } },
          { id: "n5", type: "click", position: { x: 0, y: 0 }, data: { text: "n5" } },
          { id: "n6", type: "click", position: { x: 0, y: 0 }, data: { text: "n6" } },
        ];
        const edges: Edge[] = [
          { id: "e1", source: "n0", target: "n1" },
          { id: "e2", source: "n0", target: "n2" },
          { id: "e3", source: "n1", target: "n3", sourceHandle: "true" },
          { id: "e4", source: "n2", target: "n3", sourceHandle: "false" },
          { id: "e5", source: "n1", target: "n4", sourceHandle: "false" },
          { id: "e6", source: "n3", target: "n5" },
          { id: "e7", source: "n4", target: "n6" },
        ];

        let expected = "";
        expected += getTryExceptPassCode("try", 1);
        expected += getBlockCode(nodes[1], 2);
        expected += getBlockCode(nodes[3], 2);
        expected += getBlockCode(nodes[5], 2);
        expected += getTryExceptPassCode("except", 1);
        expected += getBlockCode(nodes[4], 2);
        expected += getBlockCode(nodes[6], 2);
        expected += "\n";
        expected += getTryExceptPassCode("try", 1);
        expected += getBlockCode(nodes[2], 2);
        expected += getTryExceptPassCode("except", 1);
        expected += getBlockCode(nodes[3], 2);
        expected += getBlockCode(nodes[5], 2);
        expected += "\n";
        await expect(generate(nodes, edges, true)).resolves.toBe(expected);
      });
    });
    describe("✨ nested ✨ merged ✨", () => {
      test("separate nested branches", async () => {
        const nodes: Node[] = [
          { id: "block-1", type: "start", position: { x: -260, y: -40 }, data: { text: "" } },
          { id: "block-2", type: "find", position: { x: 60, y: -20 }, data: { text: "f1" } },
          { id: "block-3", type: "find", position: { x: 360, y: -160 }, data: { text: "f3" } },
          { id: "block-4", type: "find", position: { x: 360, y: 40 }, data: { text: "f4" } },
          { id: "block-5", type: "click", position: { x: -60, y: -40 }, data: { text: "c0" } },
          { id: "block-6", type: "click", position: { x: 220, y: -160 }, data: { text: "c2" } },
          { id: "block-7", type: "click", position: { x: 560, y: -320 }, data: { text: "c5" } },
          { id: "block-8", type: "click", position: { x: 560, y: -140 }, data: { text: "c6" } },
          { id: "block-9", type: "click", position: { x: 560, y: 20 }, data: { text: "c7" } },
        ];
        const edges: Edge[] = [
          { source: "block-1", target: "block-5", id: "block-1-block-5" },
          { source: "block-5", target: "block-2", id: "block-5-block-2" },
          { source: "block-2", sourceHandle: "true", target: "block-6", id: "block-2true-block-6" },
          { source: "block-6", target: "block-3", id: "block-6-block-3" },
          { source: "block-3", sourceHandle: "true", target: "block-7", id: "block-3true-block-7" },
          { source: "block-3", sourceHandle: "false", target: "block-8", id: "block-3false-block-8" },
          { source: "block-4", sourceHandle: "true", target: "block-9", id: "block-4true-block-9" },
          { source: "block-2", sourceHandle: "false", target: "block-4", id: "block-2false-block-4" },
        ];

        let expected = "";
        expected += getBlockCode(nodes[4], 1);
        expected += getTryExceptPassCode("try", 1);
        expected += getBlockCode(nodes[1], 2);
        expected += getBlockCode(nodes[5], 2);
        expected += getTryExceptPassCode("try", 2);
        expected += getBlockCode(nodes[2], 3);
        expected += getBlockCode(nodes[6], 3);
        expected += getTryExceptPassCode("except", 2);
        expected += getBlockCode(nodes[7], 3);
        expected += getTryExceptPassCode("except", 1);
        expected += getTryExceptPassCode("try", 2);
        expected += getBlockCode(nodes[3], 3);
        expected += getBlockCode(nodes[8], 3);
        expected += getTryExceptPassCode("except", 2);
        expected += getTryExceptPassCode("pass", 3);
        expected += "\n";
        await expect(generate(nodes, edges, true)).resolves.toBe(expected);
      });

      test("find-1.true > find-2 and find-1.false = find-2.false", async () => {
        const nodes: Node[] = [
          { id: "block-1", type: "start", position: { x: -180, y: 240 }, data: { text: "" } },
          { id: "block-2", type: "click", position: { x: 300, y: 140 }, data: { text: "c1" } },
          { id: "block-3", type: "find", position: { x: -40, y: 240 }, data: { text: "f1" } },
          { id: "block-4", type: "click", position: { x: 460, y: 140 }, data: { text: "c2" } },
          { id: "block-5", type: "click", position: { x: 320, y: 260 }, data: { text: "c3" } },
          { id: "block-6", type: "find", position: { x: 120, y: 160 }, data: { text: "f2" } },
        ];
        const edges: Edge[] = [
          { source: "block-1", target: "block-3", id: "block-1-block-3" },
          { source: "block-3", sourceHandle: "true", target: "block-6", id: "block-3true-block-6" },
          { source: "block-6", sourceHandle: "true", target: "block-2", id: "block-6true-block-2" },
          { source: "block-2", target: "block-4", id: "block-2-block-4" },
          { source: "block-6", sourceHandle: "false", target: "block-5", id: "block-6false-block-5" },
          { source: "block-3", sourceHandle: "false", target: "block-5", id: "block-3false-block-5" },
        ];

        let expected = "";
        expected += getTryExceptPassCode("try", 1);
        expected += getBlockCode(nodes[2], 2);
        expected += getTryExceptPassCode("try", 2);
        expected += getBlockCode(nodes[5], 3);
        expected += getBlockCode(nodes[1], 3);
        expected += getBlockCode(nodes[3], 3);
        expected += getTryExceptPassCode("except", 2);
        expected += getBlockCode(nodes[4], 3);
        expected += getTryExceptPassCode("except", 1);
        expected += getBlockCode(nodes[4], 2);
        expected += "\n";
        await expect(generate(nodes, edges, true)).resolves.toBe(expected);
      });

      test("find-1.true > find-2 and find-1.false = find-2.false.next", async () => {
        const nodes: Node[] = [
          { id: "block-1", type: "start", position: { x: 640, y: -100 }, data: { text: "" } },
          { id: "block-2", type: "find", position: { x: 780, y: -100 }, data: { text: "f1" } },
          { id: "block-3", type: "find", position: { x: 940, y: -200 }, data: { text: "f2" } },
          { id: "block-4", type: "click", position: { x: 1080, y: -280 }, data: { text: "c1" } },
          { id: "block-5", type: "click", position: { x: 1080, y: -140 }, data: { text: "c2" } },
          { id: "block-6", type: "click", position: { x: 1240, y: -80 }, data: { text: "c3" } },
        ];
        const edges: Edge[] = [
          { source: "block-2", sourceHandle: "true", target: "block-3", id: "block-2true-block-3" },
          { source: "block-1", target: "block-2", id: "block-1-block-2" },
          { source: "block-3", sourceHandle: "true", target: "block-4", id: "block-3true-block-4" },
          { source: "block-3", sourceHandle: "false", target: "block-5", id: "block-3false-block-5" },
          { source: "block-2", sourceHandle: "false", target: "block-6", id: "block-2false-block-6" },
          { source: "block-5", target: "block-6", id: "block-5-block-6" },
        ];

        const expected = `    try:
        x, y = pyautogui.locateCenterOnScreen(f1)
        try:
            x, y = pyautogui.locateCenterOnScreen(f2)
            pyautogui.click(c1)
        except ImageNotFoundException:
            pyautogui.click(c2)
            pyautogui.click(c3)
    except ImageNotFoundException:
        pyautogui.click(c3)

`;
        await expect(generate(nodes, edges, true)).resolves.toBe(expected);
      });

      test("find-1.true > find-2 and find-1.false = find-2.true", async () => {
        const nodes: Node[] = [
          { id: "block-1", type: "start", position: { x: 620, y: -220 }, data: { text: "" } },
          { id: "block-2", type: "find", position: { x: 760, y: -220 }, data: { text: "f1" } },
          { id: "block-3", type: "find", position: { x: 900, y: -380 }, data: { text: "f2" } },
          { id: "block-4", type: "click", position: { x: 1160, y: -400 }, data: { text: "c1" } },
          { id: "block-5", type: "click", position: { x: 1160, y: -280 }, data: { text: "c2" } },
          { id: "block-6", type: "click", position: { x: 1300, y: -400 }, data: { text: "c3" } },
        ];
        const edges: Edge[] = [
          { source: "block-2", sourceHandle: "true", target: "block-3", id: "block-2true-block-3" },
          { source: "block-1", target: "block-2", id: "block-1-block-2" },
          { source: "block-3", sourceHandle: "true", target: "block-4", id: "block-3true-block-4" },
          { source: "block-3", sourceHandle: "false", target: "block-5", id: "block-3false-block-5" },
          { source: "block-4", target: "block-6", id: "block-4-block-6" },
          { source: "block-2", sourceHandle: "false", target: "block-4", id: "block-2false-block-4" },
        ];
        const expected = `    try:
        x, y = pyautogui.locateCenterOnScreen(f1)
        try:
            x, y = pyautogui.locateCenterOnScreen(f2)
            pyautogui.click(c1)
            pyautogui.click(c3)
        except ImageNotFoundException:
            pyautogui.click(c2)
    except ImageNotFoundException:
        pyautogui.click(c1)
        pyautogui.click(c3)

`;
        await expect(generate(nodes, edges, true)).resolves.toBe(expected);
      });

      test("find-1.true > find-2 and find-1.false = find-2.true.next", async () => {
        const nodes: Node[] = [
          { id: "block-1", type: "start", position: { x: 620, y: -220 }, data: { text: "" } },
          { id: "block-2", type: "find", position: { x: 760, y: -220 }, data: { text: "f1" } },
          { id: "block-3", type: "find", position: { x: 940, y: -260 }, data: { text: "f2" } },
          { id: "block-4", type: "click", position: { x: 1080, y: -300 }, data: { text: "c1" } },
          { id: "block-5", type: "click", position: { x: 1080, y: -220 }, data: { text: "c2" } },
          { id: "block-6", type: "click", position: { x: 1060, y: -440 }, data: { text: "c3" } },
        ];
        const edges: Edge[] = [
          { source: "block-2", sourceHandle: "true", target: "block-3", id: "block-2true-block-3" },
          { source: "block-1", target: "block-2", id: "block-1-block-2" },
          { source: "block-3", sourceHandle: "true", target: "block-4", id: "block-3true-block-4" },
          { source: "block-3", sourceHandle: "false", target: "block-5", id: "block-3false-block-5" },
          { source: "block-4", target: "block-6", id: "block-4-block-6" },
          { source: "block-2", sourceHandle: "false", target: "block-6", id: "block-2false-block-6" },
        ];
        const expected = `    try:
        x, y = pyautogui.locateCenterOnScreen(f1)
        try:
            x, y = pyautogui.locateCenterOnScreen(f2)
            pyautogui.click(c1)
            pyautogui.click(c3)
        except ImageNotFoundException:
            pyautogui.click(c2)
    except ImageNotFoundException:
        pyautogui.click(c3)

`;
        await expect(generate(nodes, edges, true)).resolves.toBe(expected);
      });

      test("find-1.false > find-2 and find-1.true > find-2.true.next", async () => {
        const nodes: Node[] = [
          { id: "block-1", type: "start", position: { x: 620, y: -220 }, data: { text: "" } },
          { id: "block-2", type: "find", position: { x: 760, y: -220 }, data: { text: "f1" } },
          { id: "block-3", type: "find", position: { x: 1000, y: -140 }, data: { text: "f2" } },
          { id: "block-4", type: "click", position: { x: 1140, y: -220 }, data: { text: "c1" } },
          { id: "block-5", type: "click", position: { x: 1140, y: -140 }, data: { text: "c2" } },
          { id: "block-6", type: "click", position: { x: 1180, y: -420 }, data: { text: "c3" } },
        ];
        const edges: Edge[] = [
          { source: "block-1", target: "block-2", id: "block-1-block-2" },
          { source: "block-3", sourceHandle: "true", target: "block-4", id: "block-3true-block-4" },
          { source: "block-3", sourceHandle: "false", target: "block-5", id: "block-3false-block-5" },
          { source: "block-4", target: "block-6", id: "block-4-block-6" },
          { source: "block-2", sourceHandle: "false", target: "block-3", id: "block-2false-block-3" },
          { source: "block-2", sourceHandle: "true", target: "block-6", id: "block-2true-block-6" },
        ];
        const expected = `    try:
        x, y = pyautogui.locateCenterOnScreen(f1)
        pyautogui.click(c3)
    except ImageNotFoundException:
        try:
            x, y = pyautogui.locateCenterOnScreen(f2)
            pyautogui.click(c1)
            pyautogui.click(c3)
        except ImageNotFoundException:
            pyautogui.click(c2)

`;
        await expect(generate(nodes, edges, true)).resolves.toBe(expected);
      });

      test("nested switch case", async () => {
        const nodes: Node[] = [
          { id: "block-1", type: "start", position: { x: 220, y: 200 }, data: { text: "" } },
          { id: "block-2", type: "find", position: { x: 380, y: 200 }, data: { text: "f1" } },
          { id: "block-3", type: "find", position: { x: 540, y: 140 }, data: { text: "f2" } },
          { id: "block-4", type: "find", position: { x: 700, y: 80 }, data: { text: "f3" } },
          { id: "block-5", type: "click", position: { x: 560, y: 320 }, data: { text: "c1" } },
          { id: "block-6", type: "click", position: { x: 700, y: 320 }, data: { text: "c2" } },
          { id: "block-7", type: "click", position: { x: 840, y: 320 }, data: { text: "c3" } },
          { id: "block-8", type: "click", position: { x: 840, y: 40 }, data: { text: "f4" } },
        ];
        const edges: Edge[] = [
          { source: "block-1", target: "block-2", id: "block-1-block-2" },
          { source: "block-2", sourceHandle: "true", target: "block-3", id: "block-2true-block-3" },
          { source: "block-3", sourceHandle: "true", target: "block-4", id: "block-3true-block-4" },
          { source: "block-2", sourceHandle: "false", target: "block-5", id: "block-2false-block-5" },
          { source: "block-5", target: "block-6", id: "block-5-block-6" },
          { source: "block-6", target: "block-7", id: "block-6-block-7" },
          { source: "block-3", sourceHandle: "false", target: "block-6", id: "block-3false-block-6" },
          { source: "block-4", sourceHandle: "false", target: "block-7", id: "block-4false-block-7" },
          { source: "block-4", sourceHandle: "true", target: "block-8", id: "block-4true-block-8" },
        ];
        const expected = `    try:
        x, y = pyautogui.locateCenterOnScreen(f1)
        try:
            x, y = pyautogui.locateCenterOnScreen(f2)
            try:
                x, y = pyautogui.locateCenterOnScreen(f3)
                pyautogui.click(f4)
            except ImageNotFoundException:
                pyautogui.click(c3)
        except ImageNotFoundException:
            pyautogui.click(c2)
            pyautogui.click(c3)
    except ImageNotFoundException:
        pyautogui.click(c1)
        pyautogui.click(c2)
        pyautogui.click(c3)

`;
        await expect(generate(nodes, edges, true)).resolves.toBe(expected);
      });
    });
  });

  describe("✅ fork ✅ branch ❎ loop", () => {
    test("one find block, each branch forks into two", async () => {
      const nodes: Node[] = [
        { id: "block-1", type: "start", position: { x: 160, y: 140 }, data: { text: "" } },
        { id: "block-2", type: "find", position: { x: 380, y: 100 }, data: { text: "f1" } },
        { id: "block-6", type: "click", position: { x: 620, y: -20 }, data: { text: "c1" } },
        { id: "block-7", type: "click", position: { x: 620, y: 80 }, data: { text: "c2" } },
        { id: "block-8", type: "click", position: { x: 600, y: 220 }, data: { text: "c3" } },
        { id: "block-9", type: "click", position: { x: 600, y: 340 }, data: { text: "c4" } },
      ];
      const edges: Edge[] = [
        { source: "block-1", target: "block-2", id: "block-1-block-2" },
        { source: "block-2", sourceHandle: "true", target: "block-6", id: "block-2true-block-6" },
        { source: "block-2", sourceHandle: "true", target: "block-7", id: "block-2true-block-7" },
        { source: "block-2", sourceHandle: "false", target: "block-8", id: "block-2false-block-8" },
        { source: "block-2", sourceHandle: "false", target: "block-9", id: "block-2false-block-9" },
      ];
      const expected = `    try:
        x, y = pyautogui.locateCenterOnScreen(f1)
        pyautogui.click(c1)
    except ImageNotFoundException:
        pyautogui.click(c3)

    try:
        x, y = pyautogui.locateCenterOnScreen(f1)
        pyautogui.click(c1)
    except ImageNotFoundException:
        pyautogui.click(c4)

    try:
        x, y = pyautogui.locateCenterOnScreen(f1)
        pyautogui.click(c2)
    except ImageNotFoundException:
        pyautogui.click(c3)

    try:
        x, y = pyautogui.locateCenterOnScreen(f1)
        pyautogui.click(c2)
    except ImageNotFoundException:
        pyautogui.click(c4)

`;
      await expect(generate(nodes, edges, true)).resolves.toBe(expected);
    });

    test("one find block, two forks, find.true-thread-1 > find.false.thread-2", async () => {
      const nodes: Node[] = [
        { id: "block-1", type: "start", position: { x: 160, y: 140 }, data: { text: "" } },
        { id: "block-2", type: "find", position: { x: 380, y: 100 }, data: { text: "f1" } },
        { id: "block-6", type: "click", position: { x: 620, y: -20 }, data: { text: "c1" } },
        { id: "block-7", type: "click", position: { x: 620, y: 80 }, data: { text: "c2" } },
        { id: "block-8", type: "click", position: { x: 600, y: 220 }, data: { text: "c3" } },
        { id: "block-9", type: "click", position: { x: 600, y: 340 }, data: { text: "c4" } },
      ];
      const edges: Edge[] = [
        { source: "block-1", target: "block-2", id: "block-1-block-2" },
        { source: "block-2", sourceHandle: "true", target: "block-6", id: "block-2true-block-6" },
        { source: "block-2", sourceHandle: "true", target: "block-7", id: "block-2true-block-7" },
        { source: "block-2", sourceHandle: "false", target: "block-8", id: "block-2false-block-8" },
        { source: "block-2", sourceHandle: "false", target: "block-9", id: "block-2false-block-9" },
        { source: "block-7", target: "block-8", id: "block-7-block-8" },
      ];
      const expected = `    try:
        x, y = pyautogui.locateCenterOnScreen(f1)
        pyautogui.click(c1)
    except ImageNotFoundException:
        pyautogui.click(c4)
        pyautogui.click(c3)

    try:
        x, y = pyautogui.locateCenterOnScreen(f1)
        pyautogui.click(c2)
    except ImageNotFoundException:
        pyautogui.click(c4)
        pyautogui.click(c3)

`;
      await expect(generate(nodes, edges, true)).resolves.toBe(expected);
    });

    test("find block forked into two find blocks", async () => {
      const nodes: Node[] = [
        { id: "block-1", type: "start", position: { x: -120, y: 100 }, data: { text: "" } },
        { id: "block-2", type: "find", position: { x: 80, y: 100 }, data: { text: "f1" } },
        { id: "block-3", type: "find", position: { x: 280, y: -120 }, data: { text: "f2" } },
        { id: "block-4", type: "find", position: { x: 280, y: 100 }, data: { text: "f3" } },
        { id: "block-5", type: "click", position: { x: 360, y: 240 }, data: { text: "c4" } },
        { id: "block-6", type: "click", position: { x: 460, y: -140 }, data: { text: "c1" } },
        { id: "block-7", type: "click", position: { x: 460, y: -40 }, data: { text: "c2" } },
        { id: "block-8", type: "click", position: { x: 460, y: 80 }, data: { text: "c3" } },
      ];
      const edges: Edge[] = [
        { source: "block-2", sourceHandle: "true", target: "block-3", id: "block-2true-block-3" },
        { source: "block-2", sourceHandle: "true", target: "block-4", id: "block-2true-block-4" },
        { source: "block-2", sourceHandle: "false", target: "block-5", id: "block-2false-block-5" },
        { source: "block-1", target: "block-2", id: "block-1-block-2" },
        { source: "block-3", sourceHandle: "true", target: "block-6", id: "block-3true-block-6" },
        { source: "block-3", sourceHandle: "false", target: "block-7", id: "block-3false-block-7" },
        { source: "block-4", sourceHandle: "true", target: "block-8", id: "block-4true-block-8" },
        { source: "block-4", sourceHandle: "false", target: "block-5", id: "block-4false-block-5" },
      ];
      const expected = `    try:
        x, y = pyautogui.locateCenterOnScreen(f1)
        try:
            x, y = pyautogui.locateCenterOnScreen(f2)
            pyautogui.click(c1)
        except ImageNotFoundException:
            pyautogui.click(c2)
    except ImageNotFoundException:
        pyautogui.click(c4)

    try:
        x, y = pyautogui.locateCenterOnScreen(f1)
        try:
            x, y = pyautogui.locateCenterOnScreen(f3)
            pyautogui.click(c3)
        except ImageNotFoundException:
            pyautogui.click(c4)
    except ImageNotFoundException:
        pyautogui.click(c4)

`;
      await expect(generate(nodes, edges, true)).resolves.toBe(expected);
    });
  });
});
