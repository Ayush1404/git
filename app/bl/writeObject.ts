import { createHash, Hash } from "node:crypto";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { deflateSync } from "node:zlib";
type ObjectType = "blob" | "tree" | "commit";
export function writeObject(type: ObjectType, content: Buffer): Hash {
  const header = Buffer.from(`${type} ${content.length}\0`);
  const store = Buffer.concat([header, content]);
  const sha = createHash("sha1").update(store);
  const hexSha = sha.copy().digest("hex");
  const dir = hexSha.slice(0, 2);
  const filename = hexSha.slice(2);
  const compressed = deflateSync(store);
  const directoryPath = `.git/objects/${dir}`;
  if (!existsSync(directoryPath)) {
    mkdirSync(directoryPath, { recursive: true });
  }
  writeFileSync(`${directoryPath}/${filename}`, compressed);
  return sha;
}