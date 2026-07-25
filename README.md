# companion-module-mutedeck

A [Bitfocus Companion](https://bitfocus.io/companion) module for controlling and monitoring the [MuteDeck](https://mutedeck.com) desktop application.

Mute/unmute, toggle your camera, share, record, leave the meeting, push-to-talk, and trigger custom actions across Zoom, Microsoft Teams, Webex, Google Meet, Discord and more — with button feedback that reflects your live status.

See [`companion/HELP.md`](companion/HELP.md) for full usage, actions, feedbacks, variables and presets.

## How it works

MuteDeck exposes a local WebSocket API (default `ws://localhost:3492`). This module connects to it, sends action messages, and listens for `update-status` messages to drive feedbacks and variables. The MuteDeck desktop app must be installed and running.

## Development

This module is built against `@companion-module/base` 2.x and requires Companion 4.3 or newer. It is plain ESM JavaScript — no build step required.

```sh
yarn install        # or: npm install
yarn package        # build a distributable package (.tgz) with companion-module-build
```

To load it as a developer module, point Companion's _Developer modules path_ (launcher → cog → Advanced/Developer settings) at the folder that contains this repository, then enable developer modules. The connection appears as **MuteDeck** on the Connections page.

### Project layout

| Path                      | Purpose                                                  |
| ------------------------- | -------------------------------------------------------- |
| `companion/manifest.json` | Module metadata for Companion.                           |
| `companion/HELP.md`       | In-app help shown to users.                              |
| `src/main.js`             | Instance class (entrypoint) and MuteDeck event handling. |
| `src/api.js`              | WebSocket connection + reconnection to MuteDeck.         |
| `src/actions.js`          | Action definitions.                                      |
| `src/feedbacks.js`        | Boolean feedback definitions.                            |
| `src/variables.js`        | Variable definitions and values.                         |
| `src/presets.js`          | Ready-made button presets.                               |
| `src/state.js`            | Shared state constants and label helpers.                |
| `src/config.js`           | Connection configuration fields.                         |
| `src/upgrades.js`         | Upgrade scripts (append-only).                           |

### Continuous integration

Two GitHub Actions workflows keep packaging reproducible:

- **CI** (`.github/workflows/ci.yml`) runs on every push to `main` and on pull requests: `npm ci`, a Prettier format check, the module validation (`npm run check`), and `companion-module-build`. The packaged `.tgz` is uploaded as a build artifact.
- **Release** (`.github/workflows/release.yml`) runs when a `v*` tag is pushed: it verifies the tag matches the `package.json` version, validates, packages, and attaches the `.tgz` to a GitHub Release.

Both pin Node 22 and install from the committed `package-lock.json` (`npm ci`), so the package is built the same way every time.

### Cutting a release

1. Bump `version` in **both** `package.json` and `companion/manifest.json` (they must match — CI enforces this).
2. Commit, then tag and push:
   ```sh
   git tag v1.0.1
   git push origin main --tags
   ```
3. The Release workflow builds and publishes the `.tgz` on the GitHub Release.
4. To list it in the Companion store, submit the tag at <https://developer.bitfocus.io> (My Connections → your module → Submit Version).

## License

MIT
