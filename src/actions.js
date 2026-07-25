/**
 * Build the option that lets a toggle action force a specific target state.
 * MuteDeck accepts state = 'toggle' | 'on' | 'off'.
 */
function stateOption(onLabel, offLabel) {
	return {
		type: 'dropdown',
		id: 'state',
		label: 'Action',
		default: 'toggle',
		choices: [
			{ id: 'toggle', label: 'Toggle' },
			{ id: 'on', label: onLabel },
			{ id: 'off', label: offLabel },
		],
	}
}

export function UpdateActions(self) {
	// Always read the connection at press time: it does not exist yet while
	// the module is starting up, and is replaced after a config change.
	const send = (action, extra) => {
		if (!self.connection?.sendAction(action, extra)) {
			self.log('warn', `Ignored "${action}": not connected to MuteDeck`)
		}
	}

	// Choices for the custom-action picker, discovered live from MuteDeck.
	const customActionChoices = (self.customActions || []).map((a) => ({
		id: a.name,
		label: a.app_types?.length ? `${a.name} (${a.app_types.join(', ')})` : a.name,
	}))

	self.setActionDefinitions({
		toggle_mute: {
			name: 'Microphone: mute / unmute',
			options: [stateOption('Mute', 'Unmute')],
			callback: async (event) => {
				send('toggle_mute', { state: event.options.state })
			},
		},
		toggle_video: {
			name: 'Camera: start / stop',
			options: [stateOption('Turn on', 'Turn off')],
			callback: async (event) => {
				send('toggle_video', { state: event.options.state })
			},
		},
		toggle_share: {
			name: 'Screen share: start / stop',
			options: [stateOption('Start sharing', 'Stop sharing')],
			callback: async (event) => {
				send('toggle_share', { state: event.options.state })
			},
		},
		toggle_record: {
			name: 'Recording: start / stop',
			options: [stateOption('Start recording', 'Stop recording')],
			callback: async (event) => {
				send('toggle_record', { state: event.options.state })
			},
		},
		leave_meeting: {
			name: 'Leave meeting',
			options: [],
			callback: async () => {
				send('leave_meeting')
			},
		},
		bring_to_front: {
			name: 'Bring call app to front',
			options: [],
			callback: async () => {
				send('bring-to-front')
			},
		},
		custom_action: {
			name: 'Trigger custom action',
			description: 'Triggers a custom action defined in MuteDeck. Pick a discovered action or type its name.',
			options: [
				{
					type: 'dropdown',
					id: 'name',
					label: 'Custom action',
					default: customActionChoices[0]?.id ?? '',
					choices: customActionChoices,
					allowCustom: true,
					tooltip: 'The custom action name exactly as defined in MuteDeck.',
				},
			],
			callback: async (event) => {
				const name = String(event.options.name || '').trim()
				if (!name) {
					self.log('warn', 'Custom action triggered without a name')
					return
				}
				send('custom-action', { name })
			},
		},
		refresh_custom_actions: {
			name: 'Refresh custom action list',
			options: [],
			description: 'Re-fetch the list of custom actions from MuteDeck.',
			callback: async () => {
				self.connection?.requestCustomActions()
			},
		},
	})
}
