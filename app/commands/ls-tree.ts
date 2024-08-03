import { readTree } from "../bl/tree";

export function lsTree(sha: string) {
  const entries = readTree(sha);
  entries.forEach((entry) => {
    console.log(entry.name);
  });
}
