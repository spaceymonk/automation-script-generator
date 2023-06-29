import { Edge, Node } from "reactflow";
import { generate, getBlockCode, getEntryPoints, getTryExceptCode } from "../app/home-components/generate.util";

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
        expected += getTryExceptCode("try", 1);
        expected += getBlockCode(nodes[3], 2);
        expected += getBlockCode(nodes[1], 2);
        expected += getTryExceptCode("except", 1);
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
        expected += getTryExceptCode("try", 1);
        expected += getBlockCode(nodes[1], 2);
        expected += getBlockCode(nodes[2], 2);
        expected += getBlockCode(nodes[3], 2);
        expected += getTryExceptCode("except", 1);
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
        expected += getTryExceptCode("try", 1);
        expected += getBlockCode(nodes[1], 2);
        expected += getBlockCode(nodes[2], 2);
        expected += getTryExceptCode("except", 1);
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
        expected += getTryExceptCode("try", 1);
        expected += getBlockCode(nodes[1], 2);
        expected += getBlockCode(nodes[2], 2);
        expected += getBlockCode(nodes[3], 2);
        expected += getTryExceptCode("except", 1);
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
        expected += getTryExceptCode("try", 1);
        expected += getBlockCode(nodes[1], 2);
        expected += getTryExceptCode("except", 1);
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
        expected += getTryExceptCode("try", 1);
        expected += getBlockCode(nodes[1], 2);
        expected += getTryExceptCode("except", 1);
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
        expected += getTryExceptCode("try", 1);
        expected += getBlockCode(nodes[1], 2);
        expected += getTryExceptCode("except", 1);
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
        expected += getTryExceptCode("try", 1);
        expected += getBlockCode(nodes[1], 2);
        expected += getBlockCode(nodes[2], 2);
        expected += getBlockCode(nodes[3], 2);
        expected += getTryExceptCode("except", 1);
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
        expected += getTryExceptCode("try", 1);
        expected += getBlockCode(nodes[1], 2);
        expected += getBlockCode(nodes[2], 2);
        expected += getBlockCode(nodes[3], 2);
        expected += getTryExceptCode("except", 1);
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
        expected += getTryExceptCode("try", 1);
        expected += getBlockCode(nodes[1], 2);
        expected += getTryExceptCode("except", 1);
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
        expected += getTryExceptCode("try", 1);
        expected += getBlockCode(nodes[1], 2);
        expected += getTryExceptCode("except", 1);
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
        expected += getTryExceptCode("try", 1);
        expected += getBlockCode(nodes[1], 2);
        expected += getBlockCode(nodes[4], 2);
        expected += getTryExceptCode("except", 1);
        expected += getBlockCode(nodes[3], 2);
        expected += getBlockCode(nodes[6], 2);
        expected += "\n";
        expected += getTryExceptCode("try", 1);
        expected += getBlockCode(nodes[2], 2);
        expected += getBlockCode(nodes[5], 2);
        expected += getTryExceptCode("except", 1);
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
        expected += getTryExceptCode("try", 1);
        expected += getBlockCode(nodes[1], 2);
        expected += getBlockCode(nodes[3], 2);
        expected += getTryExceptCode("except", 1);
        expected += getBlockCode(nodes[4], 2);
        expected += getBlockCode(nodes[6], 2);
        expected += "\n";
        expected += getTryExceptCode("try", 1);
        expected += getBlockCode(nodes[2], 2);
        expected += getBlockCode(nodes[3], 2);
        expected += getTryExceptCode("except", 1);
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
        expected += getTryExceptCode("try", 1);
        expected += getBlockCode(nodes[1], 2);
        expected += getBlockCode(nodes[3], 2);
        expected += getBlockCode(nodes[5], 2);
        expected += getTryExceptCode("except", 1);
        expected += getBlockCode(nodes[4], 2);
        expected += getBlockCode(nodes[6], 2);
        expected += "\n";
        expected += getTryExceptCode("try", 1);
        expected += getBlockCode(nodes[2], 2);
        expected += getTryExceptCode("except", 1);
        expected += getBlockCode(nodes[3], 2);
        expected += getBlockCode(nodes[5], 2);
        expected += "\n";
        await expect(generate(nodes, edges, true)).resolves.toBe(expected);
      });
    });
    describe("✨ nested ✨ merged ✨", () => {
      // TODO: add test cases
    });
  });
});
