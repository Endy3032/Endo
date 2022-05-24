export const toTimestamp = (id: BigInt): bigint => {
  return id.valueOf() / 4194304n + 1420070400000n
}
