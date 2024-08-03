import { hashObject } from "./bl/hashObject";
import { catFile } from "./commands/cat-file";
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
  
  default:
    throw new Error(`Unknown command ${command}`);
}