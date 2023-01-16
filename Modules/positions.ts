import { Channel, ChannelTypes as Types, Collection, ModifyGuildChannelPositions } from "discordeno"

type Channels = Collection<bigint, Channel>

export function modifyChannelPositions(channels: Channels, id: bigint, type: Types, position: number): ModifyGuildChannelPositions[] {
	return channels.array()
		.filter(c => c.type == type)
		.sort((a: Channel, b: Channel) => (a.position ?? 0) > (b.position ?? 1) ? 1 : -1)
		.map((c: Channel, i: number) => ({ id: c.id.toString(), position: i }))
}
