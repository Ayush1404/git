import { hashObject } from "./bl/hashObject";
import { catFile } from "./commands/cat-file";
import { commitTree } from "./commands/commit-tree";
import { init } from "./commands/init";
import { lsTree } from "./commands/ls-tree";
import { writeTree } from "./commands/write-tree";
const args = process.argv.slice(2);
const command = args[0];
switch (command) {
  case "init": {
    init();
    break;
  }
  case "cat-file": {
    const sha = args[2];
    catFile(sha);
    break;
  }
  case "hash-object": {
    const filePath = args[2];
    const sha = hashObject(filePath);
    console.log(sha.digest("hex"));
    break;
  }
  case "ls-tree": {
    const sha = args[2];
    lsTree(sha);
    break;
  }
  case "write-tree": {
    writeTree();
    break;
  }
  case "commit-tree": {
    const treeSha = args[1];
    if (args.length == 4) {
      const message = args[3];
      const sha = commitTree(treeSha, message);
      console.log(sha.digest("hex"));
    } else if (args.length == 6) {
      const message = args[5];
      const parentCommit = args[3];
      const sha = commitTree(treeSha, message, parentCommit);
      console.log(sha.digest("hex"));
    }
    break;
  }
  default:
    throw new Error(`Unknown command ${command}`);
}