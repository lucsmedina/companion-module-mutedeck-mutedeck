import { InstanceBase, InstanceStatus } from '@companion-module/base'

import { MuteDeckConnection } from './api.js'
import { GetConfigFields } from './config.js'
import { UpdateActions } from './actions.js'
import { UpdateFeedbacks } from './feedbacks.js'
import { UpdateVariableDefinitions, UpdateVariableValues } from './variables.js'
import { UpdatePresets } from './presets.js'
import { UpgradeScripts } from './upgrades.js'
import { STATUS_FIELDS, emptyStatus } from './state.js'

/**
 * @typedef {Object} ModuleConfig
 * @property {string} host
 * @property {string} port
 */

class MuteDeckInstance extends InstanceBase {
	constructor(internal) {
		super(internal)

		/** Current MuteDeck state, mirrored from `update-status` messages. */
		this.state = { connected: false, ...emptyStatus() }
		/** Custom actions discovered from MuteDeck, used to populate the action dropdown. */
		this.customActions = []
		/** @type {MuteDeckConnection | null} */
		this.connection = null
	}

	async init(config) {
		this.config = config
		this.state = { connected: false, ...emptyStatus() }

		this.updateActions()
		this.updateFeedbacks()
		this.updatePresets()
		this.updateVariableDefinitions()
		UpdateVariableValues(this)

		this.updateStatus(InstanceStatus.Connecting)
		this.connection = new MuteDeckConnection(this)
		this.connection.connect()
	}

	async destroy() {
		this.connection?.destroy()
		this.connection = null
	}

	async configUpdated(config) {
		this.config = config
		// Reconnect using the new host/port.
		this.connection?.destroy()
		this.connection = new MuteDeckConnection(this)
		this.connection.connect()
	}

	getConfigFields() {
		return GetConfigFields()
	}

	updateActions() {
		UpdateActions(this)
	}

	updateFeedbacks() {
		UpdateFeedbacks(this)
	}

	updatePresets() {
		UpdatePresets(this)
	}

	updateVariableDefinitions() {
		UpdateVariableDefinitions(this)
	}

	// --- Callbacks from the MuteDeck connection ---

	/** Called when the WebSocket connects or disconnects. */
	onConnectionChange(connected) {
		this.state.connected = connected
		if (!connected) {
			// Clear the per-capability states so feedbacks/variables reflect "unknown".
			this.state = { ...this.state, ...emptyStatus() }
		}
		UpdateVariableValues(this)
		this.checkAllFeedbacks()
	}

	/** Called with each `update-status` message from MuteDeck. */
	onStatusUpdate(msg) {
		for (const field of STATUS_FIELDS) {
			if (msg[field] !== undefined) {
				this.state[field] = msg[field]
			}
		}
		UpdateVariableValues(this)
		this.checkAllFeedbacks()
	}

	/** Called with the list of user-defined custom actions from MuteDeck. */
	onCustomActions(list) {
		this.customActions = list
		// Re-build actions so the custom-action dropdown shows the discovered names.
		this.updateActions()
	}
}

export default MuteDeckInstance
export { UpgradeScripts }
