# MuteDeck

Control and monitor the [MuteDeck](https://mutedeck.com) desktop application from Bitfocus Companion.

MuteDeck checks and controls your status across Zoom, Microsoft Teams, Webex, Google Meet, StreamYard, Riverside.fm, Discord and many other apps. When it does not recognise your conferencing app, it falls back to controlling the system mute, so the controls keep working everywhere.

## Quick start

1. Make sure the **MuteDeck desktop app** is running (download from <https://mutedeck.com>). The default connection settings (localhost, port 3492) work out of the box.
2. Open the **Presets** tab, find **MuteDeck buttons**, and drag the buttons you want onto your page.

That's it. The preset buttons use the MuteDeck icons, update live with your call state (red when muted or recording, green when your camera or screen share is on), and grey out whenever MuteDeck is not running — so you can always see at a glance whether the connection is up. The **MuteDeck status** preset gives you a dedicated Connected/Offline indicator button.

## Requirements

- The **MuteDeck desktop app** must be installed and running on the machine you want to control.
- This module talks to MuteDeck over its local WebSocket API (default `ws://localhost:3492`).

## Configuration

| Field             | Description                                                    |
| ----------------- | -------------------------------------------------------------- |
| **MuteDeck host** | Hostname or IP where MuteDeck is running. Usually `localhost`. |
| **MuteDeck port** | MuteDeck WebSocket port. Default `3492`.                       |

The connection status is also shown on the Connections page. If it shows a connection failure, make sure MuteDeck is running and the host/port match.

## Presets

- **MuteDeck buttons** — complete ready-to-use buttons: microphone, camera, screen share, recording, leave meeting, and a connection status indicator.
- **MuteDeck extras** — push-to-talk (unmutes while held), bring the call app to the front, and a custom action button.

## Actions

| Action                     | Description                                                                                           |
| -------------------------- | ----------------------------------------------------------------------------------------------------- |
| Microphone: mute / unmute  | Toggle, force mute, or force unmute.                                                                  |
| Camera: start / stop       | Toggle, turn on, or turn off your camera.                                                             |
| Screen share: start / stop | Toggle, start, or stop sharing.                                                                       |
| Recording: start / stop    | Toggle, start, or stop recording.                                                                     |
| Leave meeting              | Leave the current meeting.                                                                            |
| Bring call app to front    | Bring the active conferencing app to the foreground.                                                  |
| Trigger custom action      | Run a custom action defined in MuteDeck. Pick a discovered action from the dropdown or type its name. |
| Refresh custom action list | Re-fetch the list of custom actions from MuteDeck.                                                    |

## Feedbacks

**Live icon feedbacks** (used by the presets, zero configuration): show the matching MuteDeck icon and colour for the current microphone, camera, screen share, or recording state, and grey the button out while not connected to MuteDeck.

**Boolean feedbacks** for building your own styles:

- **Microphone state** — muted / unmuted / no microphone
- **Camera state** — on / off / disabled
- **Screen share state** — on / off / disabled
- **Recording state** — on / off / disabled
- **Call state** — in a call / not in a call / disabled
- **MuteDeck connection** — connected or not

## Variables

State variables (e.g. `$(mutedeck:mute_status)`) and friendly label variables (e.g. `$(mutedeck:mute_label)`) are available for microphone, camera, share, recording and call, plus `$(mutedeck:connected)` and `$(mutedeck:connected_label)` (Connected / Offline).
