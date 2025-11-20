import { readFileSync } from "fs";
import { resolve } from "path";
import { test, expect } from "vitest";

test("frontend/index.html has title 'UCSB Rec'", () => {
  const indexPath = resolve(process.cwd(), "index.html");
  const html = readFileSync(indexPath, "utf-8");
  const m = html.match(/<title>(.*?)<\/title>/i);
  expect(m).not.toBeNull();
  expect(m[1]).toBe("UCSB Rec");
});
