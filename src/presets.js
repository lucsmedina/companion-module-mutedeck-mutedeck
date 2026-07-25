import { combineRgb } from '@companion-module/base'

import { Icons } from './icons.js'

const WHITE = combineRgb(255, 255, 255)
const BLACK = combineRgb(0, 0, 0)
const RED = combineRgb(200, 0, 0)
const GREEN = combineRgb(0, 150, 60)
const GREY = combineRgb(80, 80, 80)
const DARKRED = combineRgb(90, 0, 0)
const DARK = combineRgb(30, 30, 30)

/** Icon-only button style. The live icon feedback drives the final look. */
function iconButton(png64, bgcolor = BLACK) {
	return {
		text: '',
		size: '18',
		color: WHITE,
		bgcolor,
		png64,
		show_topbar: false,
	}
}

/**
 * A toggle button driven entirely by its live icon feedback: drag it onto a
 * page and it works, updates its icon/colour with MuteDeck state, and greys
 * out when MuteDeck is not connected.
 */
function liveToggle(name, actionId, feedbackId, defaultIcon) {
	return {
		type: 'simple',
		name,
		style: iconButton(defaultIcon),
		steps: [{ down: [{ actionId, options: { state: 'toggle' } }], up: [] }],
		feedbacks: [{ feedbackId, options: {} }],
	}
}

export function UpdatePresets(self) {
	const structure = [
		{
			id: 'buttons',
			name: 'MuteDeck buttons',
			description:
				'Complete, ready-to-use buttons with the MuteDeck icons. Drag one onto your page and it just works: live state colours, and greyed out while MuteDeck is not connected.',
			definitions: ['mute', 'video', 'share', 'record', 'leave', 'status', 'ptt', 'front', 'custom', 'status'],
		},
	]

	const presets = {
		mute: liveToggle('Microphone toggle', 'toggle_mute', 'mic_icon', Icons.mic_unmuted),
		video: liveToggle('Camera toggle', 'toggle_video', 'camera_icon', Icons.video_off),
		share: liveToggle('Screen share toggle', 'toggle_share', 'share_icon', Icons.share_off),
		record: liveToggle('Recording toggle', 'toggle_record', 'record_icon', Icons.record_off),
		leave: {
			type: 'simple',
			name: 'Leave meeting',
			style: iconButton(Icons.leave, DARKRED),
			steps: [{ down: [{ actionId: 'leave_meeting', options: {} }], up: [] }],
			feedbacks: [
				{
					feedbackId: 'mutedeck_connected',
					options: {},
					isInverted: true,
					style: { bgcolor: DARK, png64: Icons.leave_disabled },
				},
			],
		},
		status: {
			type: 'simple',
			name: 'MuteDeck status',
			style: {
				text: 'MuteDeck\\n$(mutedeck:connected_label)',
				size: '14',
				color: WHITE,
				bgcolor: DARKRED,
				png64: Icons.logo,
				pngalignment: 'center:top',
				alignment: 'center:bottom',
				show_topbar: false,
			},
			steps: [{ down: [], up: [] }],
			feedbacks: [
				{
					feedbackId: 'mutedeck_connected',
					options: {},
					style: { bgcolor: GREEN },
				},
			],
		},
		ptt: {
			type: 'simple',
			name: 'Push-to-talk (hold to unmute)',
			style: { ...iconButton(Icons.mic_muted, DARKRED), text: 'PTT', size: '14', alignment: 'center:bottom' },
			steps: [
				{
					down: [{ actionId: 'toggle_mute', options: { state: 'off' } }],
					up: [{ actionId: 'toggle_mute', options: { state: 'on' } }],
				},
			],
			feedbacks: [
				{
					feedbackId: 'mic_status',
					options: { which: 'inactive' },
					style: { bgcolor: GREEN, png64: Icons.mic_unmuted },
				},
			],
		},
		front: {
			type: 'simple',
			name: 'Bring call app to front',
			style: iconButton(Icons.front),
			steps: [{ down: [{ actionId: 'bring_to_front', options: {} }], up: [] }],
			feedbacks: [
				{
					feedbackId: 'mutedeck_connected',
					options: {},
					isInverted: true,
					style: { bgcolor: DARK, png64: Icons.front_disabled },
				},
			],
		},
		custom: {
			type: 'simple',
			name: 'Custom action',
			style: iconButton(Icons.custom),
			steps: [{ down: [{ actionId: 'custom_action', options: { name: '' } }], up: [] }],
			feedbacks: [
				{
					feedbackId: 'mutedeck_connected',
					options: {},
					isInverted: true,
					style: { bgcolor: DARK, color: GREY },
				},
			],
		},
	}

	self.setPresetDefinitions(structure, presets)
}
