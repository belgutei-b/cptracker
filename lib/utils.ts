export { cn } from "cn";

/** pluralize(1, "problem") → "1 problem", pluralize(3, "problem") → "3 problems" */
export function pluralize(count: number, singular: string, plural = `${singular}s`) {
  return `${count} ${count === 1 ? singular : plural}`;
}
