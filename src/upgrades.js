/**
 * Upgrade scripts migrate connection configs/actions/feedbacks when the module
 * changes shape between versions.
 *
 * Important: once a release ships, an upgrade script can never be removed or
 * reordered — only appended to. There are none yet for the initial release.
 *
 * @type {import('@companion-module/base').CompanionStaticUpgradeScript<import('./main.js').ModuleConfig>[]}
 */
export const UpgradeScripts = []
