import { DiscordenoShard, GatewayManager, ShardState } from "discordeno"
import { activities } from "modules"

// https://github.com/discordeno/discordeno/blob/main/packages/gateway/src/Shard.ts#L120
async function connect(this: DiscordenoShard): Promise<DiscordenoShard> {
	if (![ShardState.Identifying, ShardState.Resuming].includes(this.state)) this.state = ShardState.Connecting
	this.events.connecting?.(this)

	const url = new URL(this.connectionUrl)
	url.searchParams.set("v", this.gatewayConfig.version.toString())
	url.searchParams.set("encoding", "json")

	const socket = new WebSocket(url.toString())

	socket.onerror = event => console.log({ error: event, shardId: this.id })
	socket.onclose = async event => await this.handleClose(event)
	socket.onmessage = async message => await this.handleMessage(message)

	this.socket = socket

	return await new Promise(resolve => {
		socket.onopen = () => {
			if (![ShardState.Identifying, ShardState.Resuming].includes(this.state)) this.state = ShardState.Unidentified
			this.events.connected?.(this)

			resolve(this)
		}
	})
}

// https://codeberg.org/Yui/katsura/src/branch/main/src/discordenoFixes/gatewaySocket.ts#L40
export function fixGatewayWebsocket(gateway: GatewayManager) {
	const activity = activities()
	const baseSet = gateway.shards.set.bind(gateway.shards)

	gateway.shards.set = (key, value) => {
		// deno-lint-ignore require-await
		value.makePresence = async () => activity
		value.connect = () => connect.apply(value)
		return baseSet(key, value)
	}
}
