import { createTree } from "../bl/tree";
export function writeTree() {
  const sha = createTree(".").digest("hex");
  console.log(sha);
}