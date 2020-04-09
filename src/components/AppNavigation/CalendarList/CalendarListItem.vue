<!--
  - Nextcloud - Journals
  -
  - @author Johannes Szeibert
  -
  - This is a modified version from Nextcloud - Calendar
  - original by:
  -
  - @copyright Copyright (c) 2019 Georg Ehrke <oc.list@georgehrke.com>
  - @author Georg Ehrke <oc.list@georgehrke.com>
  -
  - @license GNU AGPL version 3 or any later version
  -
  - This program is free software: you can redistribute it and/or modify
  - it under the terms of the GNU Affero General Public License as
  - published by the Free Software Foundation, either version 3 of the
  - License, or (at your option) any later version.
  -
  - This program is distributed in the hope that it will be useful,
  - but WITHOUT ANY WARRANTY; without even the implied warranty of
  - MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
  - GNU Affero General Public License for more details.
  -
  - You should have received a copy of the GNU Affero General Public License
  - along with this program. If not, see <http://www.gnu.org/licenses/>.
  -
  -->

<template>
	<AppNavigationItem
		v-click-outside="closeShareMenu"
		:loading="calendar.loading"
		:title="calendar.displayName || $t('journals', 'Untitled calendar')"
		:class="{deleted: !!deleteTimeout, disabled: !calendar.enabled, 'open-sharing': shareMenuOpen}"
		@click.prevent.stop="toggleEnabled">
		<AppNavigationIconBullet
			v-if="calendar.enabled"
			slot="icon"
			:color="calendar.color"
			@click.prevent.stop="toggleEnabled" />
		<AppNavigationDisabledCalendarIconBullet
			v-if="!calendar.enabled"
			slot="icon"
			@click.prevent.stop="toggleEnabled" />

		<template v-if="!deleteTimeout" slot="counter">
			<Actions v-if="supportsJournals" @click="setDefaultCalendar">
				<ActionButton :icon="starIconClass" />
			</Actions>
			<Actions v-if="showSharingIcon" :disabled="!supportsJournals">
				<ActionButton :icon="sharingIconClass" @click="toggleShareMenu" />
			</Actions>
			<Avatar v-if="isSharedWithMe && loadedOwnerPrincipal" :user="ownerUserId" :display-name="ownerDisplayname" />
			<div v-if="isSharedWithMe && !loadedOwnerPrincipal" class="icon icon-loading" />
		</template>

		<template v-if="!deleteTimeout && supportsOnlyJournals" slot="actions">
			<ActionButton
				v-if="showRenameLabel"
				icon="icon-rename"
				@click.prevent.stop="openRenameInput">
				{{ $t('journals', 'Edit name') }}
			</ActionButton>
			<ActionInput
				v-if="showRenameInput"
				icon="icon-rename"
				:value="calendar.displayName"
				@submit.prevent.stop="saveRenameInput" />
			<ActionText
				v-if="showRenameSaving"
				icon="icon-loading-small">
				<!-- eslint-disable-next-line no-irregular-whitespace -->
				{{ $t('journals', 'Saving name …') }}
			</ActionText>
			<ActionButton
				v-if="showColorLabel"
				icon="icon-rename"
				@click.prevent.stop="openColorInput">
				{{ $t('journals', 'Edit color') }}
			</ActionButton>
			<ActionInput
				v-if="showColorInput"
				icon="icon-rename"
				:value="calendar.color"
				type="color"
				@submit.prevent.stop="saveColorInput" />
			<ActionText
				v-if="showColorSaving"
				icon="icon-loading-small">
				<!-- eslint-disable-next-line no-irregular-whitespace -->
				{{ $t('journals', 'Saving color …') }}
			</ActionText>
			<ActionButton
				icon="icon-clippy"
				@click.stop.prevent="copyLink">
				{{ $t('journals', 'Copy private link') }}
			</ActionButton>
			<ActionLink
				icon="icon-download"
				target="_blank"
				:href="downloadUrl">
				{{ $t('journals', 'Download') }}
			</ActionLink>
			<ActionButton
				v-if="calendar.isSharedWithMe"
				icon="icon-delete"
				@click.prevent.stop="deleteCalendar">
				{{ $t('journals', 'Unshare from me') }}
			</ActionButton>
			<ActionButton
				v-if="!calendar.isSharedWithMe"
				icon="icon-delete"
				@click.prevent.stop="deleteCalendar">
				{{ $t('journals', 'Delete') }}
			</ActionButton>
		</template>

		<template v-if="!!deleteTimeout && supportsJournals" slot="actions">
			<ActionButton
				v-if="calendar.isSharedWithMe"
				icon="icon-history"
				@click.prevent.stop="cancelDeleteCalendar">
				{{ $n('journals', 'Unsharing the calendar in {countdown} second', 'Unsharing the calendar in {countdown} seconds', countdown, { countdown }) }}
			</ActionButton>
			<ActionButton
				v-if="!calendar.isSharedWithMe"
				icon="icon-history"
				@click.prevent.stop="cancelDeleteCalendar">
				{{ $n('journals', 'Deleting the calendar in {countdown} second', 'Deleting the calendar in {countdown} seconds', countdown, { countdown }) }}
			</ActionButton>
		</template>

		<template v-if="!supportsJournals && !isSharedWithMe" slot="actions">
			<ActionButton
				icon="icon-add"
				@click.prevent.stop="addJournalSupport">
				{{ $t('journals', 'Add to Journals') }}
			</ActionButton>
		</template>

		<template v-if="!deleteTimeout">
			<div v-show="shareMenuOpen" class="sharing-section">
				<CalendarListItemSharingSearch v-if="calendar.canBeShared" :calendar="calendar" />
				<CalendarListItemSharingShareItem v-for="sharee in calendar.shares"
					v-show="shareMenuOpen"
					:key="sharee.uri"
					:sharee="sharee"
					:calendar="calendar" />
			</div>
		</template>
	</AppNavigationItem>
</template>

<script>
import Avatar from '@nextcloud/vue/dist/Components/Avatar'
import Actions from '@nextcloud/vue/dist/Components/Actions'
import ActionButton from '@nextcloud/vue/dist/Components/ActionButton'
import ActionInput from '@nextcloud/vue/dist/Components/ActionInput'
import ActionLink from '@nextcloud/vue/dist/Components/ActionLink'
import ActionText from '@nextcloud/vue/dist/Components/ActionText'
import AppNavigationIconBullet from '@nextcloud/vue/dist/Components/AppNavigationIconBullet'
import AppNavigationItem from '@nextcloud/vue/dist/Components/AppNavigationItem'
import ClickOutside from 'vue-click-outside'
import {
	generateRemoteUrl,
} from '@nextcloud/router'

import AppNavigationDisabledCalendarIconBullet from './AppNavigationDisabledCalendarIconBullet.vue'
import CalendarListItemSharingSearch from './CalendarListItemSharingSearch.vue'
import CalendarListItemSharingShareItem from './CalendarListItemSharingShareItem.vue'

export default {
	name: 'CalendarListItem',
	components: {
		Avatar,
		Actions,
		ActionButton,
		ActionInput,
		ActionLink,
		ActionText,
		AppNavigationDisabledCalendarIconBullet,
		AppNavigationIconBullet,
		AppNavigationItem,
		CalendarListItemSharingSearch,
		CalendarListItemSharingShareItem,
	},
	directives: {
		ClickOutside,
	},
	props: {
		calendar: {
			type: Object,
			required: true,
		},
	},
	data: function() {
		return {
			// Rename action
			showRenameLabel: true,
			showRenameInput: false,
			showRenameSaving: false,
			// Color action
			showColorLabel: true,
			showColorInput: false,
			showColorSaving: false,
			// share menu
			shareMenuOpen: false,
			// Deleting
			deleteInterval: null,
			deleteTimeout: null,
			countdown: 7,
		}
	},
	computed: {
		/**
		 * Download url of the calendar
		 *
		 * @returns {String}
		 */
		downloadUrl() {
			return this.calendar.url + '?export'
		},
		/**
		 * Whether or not to display the sharing icon.
		 * It will only be displayed when the calendar is either sharable or publishable
		 *
		 * @returns {Boolean}
		 */
		showSharingIcon() {
			return (this.addJournalSupport && this.calendar.canBeShared) || this.isPublished || this.isShared
		},
		/**
		 * The sharing icon class.
		 * This figures out what icon to display.
		 *
		 * The anchor icon when the calendar is published
		 * The sharing icon with high opacity when the calendar is shared
		 * The sharing icon with low opacity when the calendar is neither shared nor published
		 *
		 * @returns {String}
		 */
		sharingIconClass() {
			if (this.isPublished) {
				return 'icon-public'
			}
			if (this.isShared) {
				return 'icon-shared'
			}
			return 'icon-share'
		},

		starIconClass() {
			if (this.calendar.id === 'DDiary') {
				return 'icon-stared'
			}
			return 'icon-star'
		},

		/**
		 * Whether or not the calendar is either shared or published
		 * This is used to figure out whether or not to display the Shared label
		 *
		 * @returns {Boolean}
		 */
		isSharedOrPublished() {
			return this.isShared || this.isPublished
		},
		/**
		 * Is the calendar shared?
		 *
		 * @returns {Boolean}
		 */
		isShared() {
			return !!this.calendar.shares.length
		},
		/**
		 * Is the calendar shared with me?
		 *
		 * @returns {Boolean}
		 */
		isSharedWithMe() {
			return this.calendar.isSharedWithMe
		},
		/**
		 * Is the calendar published
		 *
		 * @returns {Boolean}
		 */
		isPublished() {
			return !!this.calendar.publishURL
		},
		/**
		 * Does the calendar support VJOURNAL
		 *
		 * @returns {Boolean}
		 */
		supportsJournals() {
			return this.calendar.supportsJournals
		},
		/**
		 * Is the calendar a pure Journal Calendar
		 *
		 * @returns {Boolean}
		 */
		supportsOnlyJournals() {
			return this.calendar.supportsOnlyJournals
		},

		isDefault() {
			return true
		},

		/**
		 * TODO: this should use principals and principal.userId
		 *
		 * @returns {String}
		 */
		owner() {
			if (this.calendar.owner.indexOf('principal:principals/users/') === '0') {
				console.debug(this.calendar.owner.substr(27))
				return this.calendar.owner.substr(27)
			}

			return ''
		},
		/**
		 * Whether or not the information about the owner principal was loaded
		 *
		 * @returns {Boolean}
		 */
		loadedOwnerPrincipal() {
			return this.$store.getters.getPrincipalByUrl(this.calendar.owner) !== undefined
		},
		ownerUserId() {
			const principal = this.$store.getters.getPrincipalByUrl(this.calendar.owner)
			if (principal) {
				return principal.userId
			}

			return ''
		},
		ownerDisplayname() {
			const principal = this.$store.getters.getPrincipalByUrl(this.calendar.owner)
			if (principal) {
				return principal.displayname
			}

			return ''
		},
	},
	methods: {
		/**
		 * Toggles the enabled state of this calendar
		 */
		toggleEnabled() {
			this.$store.dispatch('toggleCalendarEnabled', { calendar: this.calendar })
				.catch((error) => {
					this.$toast.error(this.$t('journals', 'An error occurred, unable to change visibility of the calendar.'))
					console.error(error)
				})
		},
		/**
		 * Deletes or unshares the calendar
		 */
		deleteCalendar() {
			this.deleteInterval = setInterval(() => {
				this.countdown--

				if (this.countdown < 0) {
					this.countdown = 0
				}
			}, 1000)
			this.deleteTimeout = setTimeout(async() => {
				try {
					await this.$store.dispatch('deleteCalendar', { calendar: this.calendar })
				} catch (error) {
					this.$toast.error(this.$t('journals', 'An error occurred, unable to delete the calendar.'))
					console.error(error)
				} finally {
					clearInterval(this.deleteInterval)
					this.deleteTimeout = null
					this.deleteInterval = null
					this.countdown = 7
				}
			}, 7000)
		},
		/**
		 * Cancels the deletion of a calendar
		 */
		cancelDeleteCalendar() {
			clearTimeout(this.deleteTimeout)
			clearInterval(this.deleteInterval)
			this.deleteTimeout = null
			this.deleteInterval = null
			this.countdown = 7
		},
		/**
		 * Closes the share menu
		 * This is used with v-click-outside
		 *
		 * @param {Event} event The javascript click event
		 */
		closeShareMenu(event) {
			if (!event.isTrusted) {
				return
			}

			if (this.$el.contains(event.target)) {
				this.shareMenuOpen = true
				return
			}

			if (event.composedPath && event.composedPath().includes(this.$el)) {
				this.shareMenuOpen = true
				return
			}

			this.shareMenuOpen = false
		},
		/**
		 * Toggles the visibility of the share menu
		 */
		toggleShareMenu() {
			this.shareMenuOpen = !this.shareMenuOpen
			console.debug('toggled share menu')
		},

		/**
		 * Selects the calendar as default for Journals
		 */
		setDefaultCalendar() {
			console.debug('toggled default Journal')
		},

		/**
		 * Adds VJOURNAL Support to an existing calendar
		 */
		addJournalSupport() {
			console.debug('toggled addJournalSupport')
		},
		/**
		 * Copies the private calendar link
		 * to be used with clients like Thunderbird
		 */
		async copyLink() {
			const rootUrl = generateRemoteUrl('dav')
			const url = new URL(this.calendar.url, rootUrl)

			// TODO - use menuOpen to keep it open instead of toast

			try {
				await this.$copyText(url)
				this.$toast.success(this.$t('journals', 'Calendar link copied to clipboard.'))
			} catch (error) {
				console.debug(error)
				this.$toast.error(this.$t('journals', 'Calendar link could not be copied to clipboard.'))
			}
		},
		/**
		 * Opens the input-field to rename the calendar
		 */
		openRenameInput() {
			// Hide label and show input
			this.showRenameLabel = false
			this.showRenameInput = true
			this.showRenameSaving = false
			// Reset color input if necessary
			this.showColorLabel = true
			this.showColorInput = false
			this.showColorSaving = false
		},
		/**
		 * Saves the modified name of a calendar
		 *
		 * @param {Event} event The submit event
		 */
		async saveRenameInput(event) {
			this.showRenameInput = false
			this.showRenameSaving = true

			const newName = event.target.querySelector('input[type=text]').value
			try {
				await this.$store.dispatch('renameCalendar', {
					calendar: this.calendar,
					newName,
				})
				this.showRenameLabel = true
				this.showRenameInput = false
				this.showRenameSaving = false
			} catch (error) {
				this.$toast(this.$t('journals', 'An error occurred, unable to rename the calendar.'))
				console.error(error)

				this.showRenameLabel = false
				this.showRenameInput = true
				this.showRenameSaving = false
			}
		},
		/**
		 * Opens the color-picker
		 */
		openColorInput() {
			// Hide label and show input
			this.showColorLabel = false
			this.showColorInput = true
			this.showColorSaving = false
			// Reset rename input if necessary
			this.showRenameLabel = true
			this.showRenameInput = false
			this.showRenameSaving = false
		},
		/**
		 * Saves the modified color of a calendar
		 *
		 * @param {Event} event The submit event
		 */
		async saveColorInput(event) {
			this.showColorInput = false
			this.showColorSaving = true

			const newColor = event.target.querySelector('input[type=color]').value
			try {
				await this.$store.dispatch('changeCalendarColor', {
					calendar: this.calendar,
					newColor,
				})
				this.showColorLabel = true
				this.showColorInput = false
				this.showColorSaving = false
			} catch (error) {
				this.$toast(this.$t('journals', 'An error occurred, unable to change the calendar\'s color.'))
				console.error(error)

				this.showColorLabel = false
				this.showColorInput = true
				this.showColorSaving = false
			}
		},
	},
}
</script>
