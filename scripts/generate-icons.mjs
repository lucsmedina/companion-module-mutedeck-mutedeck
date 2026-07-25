/**
 * Generates src/icons.js from the Stream Deck plugin's icon set, so the
 * Companion module shows the same MuteDeck icons without a runtime dependency
 * on the plugin directory. Re-run after changing icons:
 *
 *   node scripts/generate-icons.mjs
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const imgs = path.join(root, 'streamdeck-plugin-nodejs', 'com.mutedeck.plugin.sdPlugin', 'imgs')

// name in icons.js -> path relative to the plugin imgs dir (@2x = 160px, crisp on all surfaces)
const ICONS = {
	mic_muted: 'actions/togglemute/muted@2x.png',
	mic_unmuted: 'actions/togglemute/unmuted@2x.png',
	mic_disabled: 'actions/togglemute/microphone-disabled@2x.png',
	video_on: 'actions/togglevideo/video-started@2x.png',
	video_off: 'actions/togglevideo/video-stopped@2x.png',
	video_disabled: 'actions/togglevideo/video-disabled@2x.png',
	share_on: 'actions/togglesharing/sharing-started@2x.png',
	share_off: 'actions/togglesharing/sharing-stopped@2x.png',
	share_disabled: 'actions/togglesharing/sharing-disabled@2x.png',
	record_on: 'actions/togglerecording/recording-started@2x.png',
	record_off: 'actions/togglerecording/recording-stopped@2x.png',
	record_disabled: 'actions/togglerecording/recording-disabled@2x.png',
	leave: 'actions/leavemeeting/leave-meeting@2x.png',
	leave_disabled: 'actions/leavemeeting/leave-meeting-disabled@2x.png',
	front: 'actions/bring-to-front/bring-to-front@2x.png',
	front_disabled: 'actions/bring-to-front/bring-to-front-disabled@2x.png',
	custom: 'actions/custom-action/custom-action@2x.png',
	logo: 'plugin/category@2x.png',
}

let out = `/**
 * MuteDeck button icons as base64 PNGs (white glyphs on transparent, 160px).
 * GENERATED FILE - do not edit. Regenerate with: node scripts/generate-icons.mjs
 */
export const Icons = {
`
for (const [name, rel] of Object.entries(ICONS)) {
	const file = path.join(imgs, rel)
	const b64 = fs.readFileSync(file).toString('base64')
	out += `\t${name}:\n\t\t'${b64}',\n`
}
out += `}\n`

fs.writeFileSync(path.join(root, 'src', 'icons.js'), out)
console.log(`Wrote src/icons.js with ${Object.keys(ICONS).length} icons.`)
