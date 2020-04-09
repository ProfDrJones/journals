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
	<PropertyCalendarPicker
		:calendars="calendars"
		:calendar="defaultJournal"
		:is-read-only="false"
		@selectCalendar="changeCalendar" />
</template>

<script>
import {
	mapState,
} from 'vuex'
import PropertyCalendarPicker from '../../Editor/Properties/PropertyCalendarPicker'

export default {
	name: 'SettingsDefaultJournalSelect',
	components: {
		PropertyCalendarPicker,
	},
	props: {
		isDisabled: {
			type: Boolean,
			required: true,
		},
	},
	computed: {
		...mapState({
			defaultJournal: state => state.settings.defaultJournal,
		}),

		/**
		 * Returns all calendars selectable by the user
		 *
		 * @returns {Object[]}
		 */
		calendars() {
			if (this.isReadOnly && this.calendarObject) {
				return [
					this.$store.getters.getCalendarById(this.calendarObject.calendarId),
				]
			}

			return this.$store.getters.sortedCalendars
		},
	},
	methods: {
		/**
		 * Changes the selected calendar
		 * Does not move the calendar-object yet, that's done in save
		 *
		 * @param {Object} selectedCalendar The new calendar selected by the user
		 */
		changeCalendar(selectedCalendar) {
			this.calendarId = selectedCalendar.id

			// If this is a new event that does not exist on the server yet,
			// override the internally stored calendarId. If we did not do this,
			// it would create the event in the default calendar first and move it
			// to the desired calendar as a second step.
			if (this.calendarObject && !this.calendarObject.existsOnServer) {
				this.calendarObject.calendarId = selectedCalendar.id
			}
		},
		/**
		 * Updates the setting for default Journal
		 *
		 * @param {Object} option The new selected value
		 */
		changeDefaultJournal(option) {
			if (!option) {
				return
			}
			const defaultJournal = option.value

			this.$store.dispatch('defaultJournal', { defaultJournal })
				.catch((error) => {
					console.error(error)
					this.$toast(this.$t('journals', 'New setting was not saved successfully.'))
				})
		},
	},
}
</script>
