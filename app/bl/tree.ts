import {
    existsSync,
    mkdirSync,
    readdirSync,
    readFileSync,
    writeFileSync,
  } from "node:fs";
  import { deflateSync, inflateSync } from "node:zlib";
  import { hashObject } from "./hashObject";
  import { createHash, Hash } from "node:crypto";
  import { writeObject } from "./writeObject";
  const MODES = {
    REGULAR_FILE: "100644",
    EXECUTABLE_FILE: "100755",
    DIRECTORY: "40000",
    SYMBOLIC_LINK: "120000",
  } as const;
  type Mode = (typeof MODES)[keyof typeof MODES];
  interface TreeEntry {
    mode: Mode;
    name: string;
    sha: Buffer;
  }
  export function readTree(sha: string): TreeEntry[] {
    const directoryPath = `.git/objects/${sha.slice(0, 2)}`;
    const filename = sha.slice(2);
    const compressed = readFileSync(`${directoryPath}/${filename}`);
    const store = inflateSync(compressed);
    const content = store.toString().substring(store.indexOf("\0") + 1);
    const res: TreeEntry[] = [];
    let currentIndex = 0;
    while (currentIndex < content.length) {
      const spaceIndex = content.indexOf(" ", currentIndex);
      const nullIndex = content.indexOf("\0", currentIndex);
      const mode = content.substring(currentIndex, spaceIndex) as Mode;
      const name = content.substring(spaceIndex + 1, nullIndex);
      const shaBytes = content.substring(nullIndex + 1, nullIndex + 20);
      res.push({ mode, name, sha: Buffer.from(shaBytes) });
      currentIndex = nullIndex + 20;
    }
    return res;
  }
  export function createTree(directoryPath: string): Hash {
    const treeEntries: TreeEntry[] = [];
    const dirEntries = readdirSync(directoryPath, { withFileTypes: true });
    for (const dirEntry of dirEntries) {
      if (dirEntry.isFile()) {
        const sha = hashObject(`${directoryPath}/${dirEntry.name}`);
        treeEntries.push({
          mode: MODES.REGULAR_FILE,
          name: dirEntry.name,
          sha: sha.digest(),
        });
      } else if (dirEntry.isDirectory() && dirEntry.name !== ".git") {
        const sha = createTree(`${directoryPath}/${dirEntry.name}`);
        treeEntries.push({
          mode: MODES.DIRECTORY,
          name: dirEntry.name,
          sha: sha.digest(),
        });
      }
    }
    treeEntries.sort((a, b) => a.name.localeCompare(b.name));
    const content = treeEntries.reduce(
      (acc, entry) =>
        Buffer.concat([
          acc,
          Buffer.from(`${entry.mode} ${entry.name}\0`),
          entry.sha,
        ]),
      Buffer.alloc(0)
    );
    return writeObject("tree", content);
  }