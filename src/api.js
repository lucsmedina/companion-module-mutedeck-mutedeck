import WebSocket from 'ws'
import { InstanceStatus } from '@companion-module/base'

/**
 * Source identifier sent to MuteDeck on every message. MuteDeck's WebSocket
 * server (client/api/websocketserver.cpp) drops messages from unknown sources,
 * so this must be one of its accepted plugin values: 'streamdeck-plugin' or
 * 'plugin'. The `identifier` sent with `identify` names this client in
 * MuteDeck's logs.
 */
export const SOURCE = 'plugin'
export const IDENTIFIER = 'Bitfocus Companion'

const RECONNECT_INTERVAL_MS = 3000

/**
 * Manages the WebSocket connection to the local MuteDeck application.
 *
 * MuteDeck exposes a WebSocket server (default ws://localhost:3492) that:
 *  - accepts JSON action messages ({ source, action, state?, name? }), and
 *  - pushes `update-status` messages describing the current call/mute/video/etc state.
 *
 * The class owns reconnection and forwards parsed events back to the instance.
 */
export class MuteDeckConnection {
	constructor(instance) {
		this.instance = instance
		this.ws = null
		this.connected = false
		this.shouldReconnect = true
		this.reconnectTimer = null
	}

	get url() {
		const host = (this.instance.config.host || 'localhost').trim()
		const port = this.instance.config.port || 3492
		return `ws://${host}:${port}`
	}

	connect() {
		this.shouldReconnect = true
		this.clearReconnectTimer()

		const url = this.url
		this.instance.updateStatus(InstanceStatus.Connecting)
		this.instance.log('debug', `Connecting to MuteDeck at ${url}`)

		try {
			this.ws = new WebSocket(url)
		} catch (e) {
			this.instance.log('error', `Failed to open WebSocket: ${e.message}`)
			this.scheduleReconnect()
			return
		}

		this.ws.on('open', () => this.handleOpen())
		this.ws.on('message', (data) => this.handleMessage(data))
		this.ws.on('close', () => this.handleClose())
		this.ws.on('error', (err) => this.handleError(err))
	}

	handleOpen() {
		this.connected = true
		this.instance.updateStatus(InstanceStatus.Ok)
		this.instance.log('info', 'Connected to MuteDeck')

		// Announce ourselves (registers this client for status pushes), then
		// ask for the list of user-defined custom actions.
		this.send({ source: SOURCE, action: 'identify', identifier: IDENTIFIER })
		this.requestCustomActions()

		this.instance.onConnectionChange(true)
	}

	handleClose() {
		const wasConnected = this.connected
		this.connected = false
		if (wasConnected) {
			this.instance.log('info', 'Disconnected from MuteDeck')
		}
		this.instance.onConnectionChange(false)
		this.instance.updateStatus(InstanceStatus.ConnectionFailure, 'Not connected to MuteDeck')
		this.scheduleReconnect()
	}

	handleError(err) {
		// `close` always follows and drives the reconnect, so just log here.
		this.instance.log('debug', `MuteDeck WebSocket error: ${err?.message ?? err}`)
	}

	handleMessage(data) {
		let msg
		try {
			msg = JSON.parse(data.toString())
		} catch {
			this.instance.log('warn', 'Received a non-JSON message from MuteDeck')
			return
		}

		switch (msg.action) {
			case 'update-status':
				this.instance.onStatusUpdate(msg)
				break
			case 'list-custom-actions':
				this.instance.onCustomActions(Array.isArray(msg.custom_actions) ? msg.custom_actions : [])
				break
			default:
				break
		}
	}

	/** Send a raw object to MuteDeck. Returns true if it was written to the socket. */
	send(obj) {
		if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
			this.instance.log('warn', 'Cannot send to MuteDeck: not connected')
			return false
		}
		this.ws.send(JSON.stringify(obj))
		return true
	}

	/** Send a standard MuteDeck action, e.g. sendAction('toggle_mute', { state: 'on' }). */
	sendAction(action, extra = {}) {
		return this.send({ source: SOURCE, action, ...extra })
	}

	requestCustomActions() {
		this.send({ source: SOURCE, action: 'list-custom-actions' })
	}

	scheduleReconnect() {
		if (!this.shouldReconnect || this.reconnectTimer) return
		this.reconnectTimer = setTimeout(() => {
			this.reconnectTimer = null
			this.connect()
		}, RECONNECT_INTERVAL_MS)
	}

	clearReconnectTimer() {
		if (this.reconnectTimer) {
			clearTimeout(this.reconnectTimer)
			this.reconnectTimer = null
		}
	}

	destroy() {
		this.shouldReconnect = false
		this.clearReconnectTimer()
		if (this.ws) {
			try {
				this.ws.removeAllListeners()
				this.ws.close()
			} catch {
				// ignore errors while tearing down
			}
			this.ws = null
		}
		this.connected = false
	}
}
