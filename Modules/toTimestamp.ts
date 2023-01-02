export function toTimestamp(id: BigInt, type?: "ms"): bigint
export function toTimestamp(id: BigInt, type?: "s" | undefined): number
export function toTimestamp(id: BigInt, type: "ms" | "s" = "s"): bigint | number {
	const ms = id.valueOf() / 4194304n + 1420070400000n
	return type === "ms" ? ms : Math.floor(Number(ms / 1000n))
}
