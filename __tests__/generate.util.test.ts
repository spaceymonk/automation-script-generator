import { generate } from "../app/home-components/generate.util";

test("resolves", async () => {
  await expect(Promise.resolve(generate([], []))).resolves.toStrictEqual("");
});
