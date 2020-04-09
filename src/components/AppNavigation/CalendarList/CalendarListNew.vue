<!--
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
		class="app-navigation-entry-new-calendar"
		:class="{'app-navigation-entry-new-calendar--open': isOpen}"
		:title="$t('journals', '+ New Journal')"
		:menu-open.sync="isOpen"
		menu-icon="icon-add"
		@click.prevent.stop="toggleDialog">
		<template slot="actions">
			<ActionButton
				v-if="showCreateJournalLabel"
				icon="icon-new-calendar"
				@click.prevent.stop="openCreateJournalInput">
				{{ $t('journals', 'New Journal') }}
			</ActionButton>
			<ActionInput
				v-if="showCreateJournalInput"
				icon="icon-new-calendar"
				@submit.prevent.stop="createNewJournal" />
			<ActionText
				v-if="showCreateJournalSaving"
				icon="icon-loading-small">
				<!-- eslint-disable-next-line no-irregular-whitespace -->
				{{ $t('journals', 'Creating Journal …') }}
			</ActionText>

			<ActionButton
				v-if="showCreateCalendarJournalLabel"
				icon="icon-new-calendar-with-journal"
				@click.prevent.stop="openCreateCalendarJournalInput">
				{{ $t('journals', 'New calendar with task list') }}
			</ActionButton>
			<ActionInput
				v-if="showCreateCalendarJournalInput"
				icon="icon-new-calendar-with-journal"
				@submit.prevent.stop="createNewCalendarJournal" />
			<ActionText
				v-if="showCreateCalendarJournalSaving"
				icon="icon-loading-small">
				<!-- eslint-disable-next-line no-irregular-whitespace -->
				{{ $t('journals', 'Creating Journal …') }}
			</ActionText>
		</template>
	</AppNavigationItem>
</template>

<script>
import ActionButton from '@nextcloud/vue/dist/Components/ActionButton'
import ActionInput from '@nextcloud/vue/dist/Components/ActionInput'
import ActionText from '@nextcloud/vue/dist/Components/ActionText'
import AppNavigationItem from '@nextcloud/vue/dist/Components/AppNavigationItem'

import { uidToHexColor } from '../../../utils/color.js'

export default {
	name: 'CalendarListNew',
	components: {
		ActionButton,
		ActionInput,
		ActionText,
		AppNavigationItem,
	},
	data: function() {
		return {
			// Open state
			isOpen: false,
			// New Journal
			showCreateJournalLabel: true,
			showCreateJournalInput: false,
			showCreateJournalSaving: false,
			// New calendar with journals
			showCreateCalendarJournalLabel: true,
			showCreateCalendarJournalInput: false,
			showCreateCalendarJournalSaving: false,
		}
	},
	watch: {
		isOpen() {
			if (this.isOpen) {
				return
			}

			this.closeMenu()
		},
	},
	methods: {
		/**
		 * Opens the Actions menu when clicking on the main item label
		 */
		toggleDialog() {
			this.isOpen = !this.isOpen
		},
		/**
		 * Opens the create calendar input
		 */
		openCreateJournalInput() {
			this.showCreateJournalLabel = false
			this.showCreateJournalInput = true
			this.showCreateJournalSaving = false

			this.showCreateCalendarJournalLabel = true
			this.showCreateCalendarJournalInput = false
		},
		/**
		 * Opens the create calendar with task list input
		 */
		openCreateCalendarJournalInput() {
			this.showCreateCalendarJournalLabel = false
			this.showCreateCalendarJournalInput = true
			this.showCreateCalendarJournalSaving = false

			this.showCreateJournalLabel = true
			this.showCreateJournalInput = false
		},
		/**
		 * Creates a new calendar
		 *
		 * @param {Event} event The submit event
		 */
		async createNewJournal(event) {
			this.showCreateJournalInput = false
			this.showCreateJournalSaving = true

			const displayName = event.target.querySelector('input[type=text]').value

			try {
				await this.$store.dispatch('appendCalendar', {
					displayName,
					color: uidToHexColor(displayName),
					components: ['VJOURNAL'],
				})
			} catch (error) {
				console.debug(error)
				this.$toast.error(this.$t('journals', 'An error occurred, unable to create the calendar.'))
			} finally {
				this.showCreateJournalSaving = false
				this.showCreateJournalLabel = true
				this.isOpen = false
				this.closeMenu()
			}
		},
		/**
		 * Creates a new calendar with task list
		 *
		 * @param {Event} event The submit event
		 */
		async createNewCalendarJournal(event) {
			this.showCreateCalendarJournalInput = false
			this.showCreateCalendarJournalSaving = true

			const displayName = event.target.querySelector('input[type=text]').value

			try {
				await this.$store.dispatch('appendCalendar', {
					displayName,
					color: uidToHexColor(displayName),
					components: ['VEVENT', 'VJOURNAL'],
				})
			} catch (error) {
				console.debug(error)
				this.$toast.error(this.$t('journals', 'An error occurred, unable to create the calendar.'))
			} finally {
				this.showCreateCalendarJournalSaving = false
				this.showCreateCalendarJournalLabel = true
				this.isOpen = false
				this.closeMenu()
			}
		},
		/**
		 * This resets the actions on close of menu
		 */
		closeMenu() {
			this.showCreateJournalLabel = true
			this.showCreateJournalInput = false
			this.showCreateJournalSaving = false
			this.showCreateCalendarJournalLabel = true
			this.showCreateCalendarJournalInput = false
			this.showCreateCalendarJournalSaving = false
		},
	},
}
</script>
