import { readFileSync } from "node:fs";
import { inflateSync } from "node:zlib";
export function catFile(sha: string) {
  if (sha.length !== 40) {
    throw new Error("Invalid sha");
  }
  const dir = sha.slice(0, 2);
  const filename = sha.slice(2);
  
  const file = readFileSync(`.git/objects/${dir}/${filename}`);
  const decompressed = inflateSync(file);
  const headerEnd = decompressed.indexOf(0);
  const content = decompressed.slice(headerEnd + 1);
  return content.toString();
}