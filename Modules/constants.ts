import { BitwisePermissionFlags as Permissions } from "discordeno"

export const timezone = "+00:00"

export const colors = [
	0x5865F2,
	0x57F287,
	0xFEE75C,
	0xEB459E,
	0xED4245,
	0xF47B67,
	0xF8A532,
	0x48B784,
	0x45DDC0,
	0x99AAB5,
	0x23272A,
	0xB7C2CE,
	0x4187ED,
	0x36393F,
	0x3E70DD,
	0x4F5D7F,
	0x7289DA,
	0x4E5D94,
	0x9C84EF,
	0xF47FFF,
	0xFFFFFF,
	0x9684ec,
	0x583694,
	0x37393e,
	0x5866ef,
	0x3da560,
	0xf9a62b,
	0xf37668,
	0x49ddc1,
	0x4f5d7e,
	0x09b0f2,
	0x2f3136,
	0xec4145,
	0xfe73f6,
	0x000000,
]

export const DenoInspectConfig = {
	colors: true,
	compact: false,
	depth: 8,
	iterableLimit: 300,
	strAbbreviateSize: 1000,
}

export const BotPerms = Permissions.MANAGE_GUILD
	+ Permissions.MANAGE_ROLES
	+ Permissions.MANAGE_CHANNELS
	+ Permissions.KICK_MEMBERS
	+ Permissions.BAN_MEMBERS
	+ Permissions.MANAGE_WEBHOOKS
	+ Permissions.VIEW_CHANNEL
	+ Permissions.MODERATE_MEMBERS
	+ Permissions.SEND_MESSAGES
	+ Permissions.CREATE_PUBLIC_THREADS
	+ Permissions.CREATE_PRIVATE_THREADS
	+ Permissions.SEND_MESSAGES_IN_THREADS
	+ Permissions.MANAGE_MESSAGES
	+ Permissions.MANAGE_THREADS
	+ Permissions.EMBED_LINKS
	+ Permissions.ATTACH_FILES
	+ Permissions.USE_EXTERNAL_EMOJIS
	+ Permissions.ADD_REACTIONS
