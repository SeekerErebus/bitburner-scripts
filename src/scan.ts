import { NS } from "@ns";

export async function main(ns: NS): Promise<void> {
  let servers = scan(ns, ns.getHostname());
  ns.tprint(servers);
}

function scan(ns: NS, starting_server: string): string[] {
  let visited = new Set<string>();
  const result: string[] = [];

  function visit(node: string) {
    if (visited.has(node))
      return;
    visited.add(node);
    result.push(node);

    let servers = ns.scan(node);
    for (let server in servers) {
      visit(server);
    }
  }
  visit(starting_server);
  return result;
}