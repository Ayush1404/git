import { Hash } from "node:crypto";
import { writeObject } from "../bl/writeObject";
export function commitTree(treeSha: string, message: string, parentCommit?: string): Hash {
  const content = Buffer.concat([
    Buffer.from(`tree ${treeSha}\n`),
    parentCommit ? Buffer.from(`parent ${parentCommit}\n`) : Buffer.alloc(0),
    Buffer.from(`author John Doe <john.doe@example.com> ${Date.now()} +0000\n`),
    Buffer.from(`committer John Doe <john.doe@example.com> ${Date.now()} +0000\n`),
    Buffer.from(`\n${message}\n`),
  ]);
  return writeObject("commit", content);
}