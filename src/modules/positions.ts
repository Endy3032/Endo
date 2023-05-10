import { Channel, ChannelTypes, ModifyGuildChannelPositions } from "discordeno"

export function modifyChannelPositions(channels: Channel[], channel: Channel): ModifyGuildChannelPositions[] {
	const sorted = channels.filter(c => {
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
