import { Hash } from "node:crypto";
import { readFileSync } from "node:fs";
import { writeObject } from "./writeObject";
export function hashObject(filePath: string): Hash {
  const content = readFileSync(filePath);
  return writeObject("blob", content);
}