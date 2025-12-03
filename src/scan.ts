import { NS } from "@ns";
import { Server } from "@ns";

export interface ServerSummary {
    hostname: string;

    purchasedByPlayer: boolean;
    hasAdminRights: boolean;
    backdoorInstalled: boolean;

    requiredHackingSkill: number;
    moneyMax: number;
    minDifficulty: number;
    maxRam: number;
}

function collectAllServerData(ns: NS): ServerSummary[] {
	let known_servers = new Set<string>();
	let result: ServerSummary[] = [];

	function visit(node: string) {
		if (known_servers.has(node))
			return;
		known_servers.add(node);

		let s = ns.getServer(node);

		result.push({
			hostname: s.hostname,
			purchasedByPlayer: s.purchasedByPlayer,
			hasAdminRights: s.hasAdminRights,
			backdoorInstalled: s.backdoorInstalled ?? false,
			requiredHackingSkill: s.requiredHackingSkill ?? 0,
			moneyMax: s.moneyMax ?? 0,
			minDifficulty: s.minDifficulty ?? 0,
			maxRam: s.maxRam,
		});
		let neighbors = ns.scan(node);
		
		for (let neighbor in neighbors) {
			if (!known_servers.has(neighbor)) {
				visit(neighbor);
			}
		}
	}
	visit("home");
	return result;
}

export async function main(ns: NS): Promise<void> {
  const servers = collectAllServerData(ns);
  const json = JSON.stringify(servers, null, 2);
  
  ns.write("/data/all_servers.json", json, "w");
}
