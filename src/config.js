import { Regex } from '@companion-module/base'

/**
 * Configuration fields shown in the Companion connection settings UI.
 */
export function GetConfigFields() {
	return [
		{
			type: 'static-text',
			id: 'info',
			width: 12,
			label: 'About this module',
			value:
				'Controls and monitors the MuteDeck desktop application running on this machine (or another machine on your network). ' +
				'MuteDeck must be installed and running. Get it from https://mutedeck.com.',
		},
		{
			type: 'textinput',
			id: 'host',
			label: 'MuteDeck host',
			width: 8,
			default: 'localhost',
			tooltip: 'Hostname or IP where MuteDeck is running. Usually localhost.',
			regex: Regex.HOSTNAME,
		},
		{
			type: 'textinput',
			id: 'port',
			label: 'MuteDeck port',
			width: 4,
			default: '3492',
			tooltip: 'MuteDeck WebSocket port (default 3492).',
			regex: Regex.PORT,
		},
	]
}
