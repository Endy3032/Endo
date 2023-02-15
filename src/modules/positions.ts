import { Channel, ChannelTypes, Collection, ModifyGuildChannelPositions } from "discordeno"

type Channels = Collection<bigint, Channel>

export function modifyChannelPositions(channels: Channels, channel: Channel): ModifyGuildChannelPositions[] {
	const sorted = channels.array().filter(c => {
		if ([ChannelTypes.GuildVoice, ChannelTypes.GuildStageVoice].includes(channel.type)) {
			return [ChannelTypes.GuildVoice, ChannelTypes.GuildStageVoice].includes(c.type)
		} else return c.type === channel.type
	})
	sorted.push(channel)

	return sorted
		.sort((a: Channel, b: Channel) => {
			if ((a.position ?? 0) > (b.position ?? 1)) return 1
			else if (a.position === b.position) return 0
			else return -1
		})
		.map((c: Channel, i: number) => ({ id: c.id.toString(), position: i }))
}
