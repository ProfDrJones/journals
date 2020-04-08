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
	<AppNavigationSettings>
		<ul class="settings-fieldset-interior">
			<li>
				<label for="defaultJournal">
					{{ $t('journals', 'Default Journal') }}
				</label>
				<select id="defaultJournal" v-model="defaultJournal">
					<option v-for="journal in availableJournals"
						:key="journal.id"
						:value="journal.id">
						{{ journal.displayName }}
					</option>
				</select>
			</li>

			<ActionCheckbox
				:is-disabled="loadingCalendars"
				class="settings-fieldset-interior-item"
				:checked="defaultJournalEntryAllDay"
				:disabled="savingDefaultJournalEntryAllDay"
				@update:checked="toggleDefaultJournalEntryAllDayEnabled">
				{{ $t('journals', 'Default Journal Entries as AllDay') }}
			</ActionCheckbox>
		</ul>
	</AppNavigationSettings>
</template>

<script>
import ActionCheckbox from '@nextcloud/vue/dist/Components/ActionCheckbox'
import AppNavigationSettings from '@nextcloud/vue/dist/Components/AppNavigationSettings'

import {
	mapState,
} from 'vuex'

export default {
	name: 'Settings',
	components: {
		ActionCheckbox,
		AppNavigationSettings,
	},
	props: {
		loadingCalendars: {
			type: Boolean,
			default: false,
		},
	},
	data: function() {
		return {
			savingDefaultJournal: false,
			savingDefaultJournalEntryAllDay: false,
			availableJournals: null,
		}
	},
	computed: {
		...mapState({
			defaultJournal: state => state.settings.defaultJournal,
			defaultJournalEntryAllDay: state => !state.settings.defaultJournalEntryAllDay,
		}),
	},
	methods: {
		/**
		 * Updates the setting for slot duration
		 *
		 * @param {Object} option The new selected value
		 */
		async changeDefaultJournal(option) {
			if (!option) {
				return
			}
			// change to loading status
			this.savingDefaultJournal = true
			try {
				await this.$store.dispatch('setDefaultJournal', {
					defaultJournal: option.value,
				})
				this.savingDefaultJournal = false
			} catch (error) {
				console.error(error)
				this.$toast.error(this.$t('journals', 'New setting was not saved successfully.'))
				this.savingDefaultJournal = false
			}
		},

		/**
		 * Toggles the setting for "Default Journal Entries as AllDay"
		 */
		async toggleDefaultJournalEntryAllDayEnabled() {
			// change to loading status
			this.savingDefaultJournalEntryAllDay = true
			try {
				await this.$store.dispatch('toggleDefaultJournalEntryAllDayEnabled')
				this.savingDefaultJournalEntryAllDay = false
			} catch (error) {
				console.error(error)
				this.$toast.error(this.$t('journals', 'New setting was not saved successfully.'))
				this.savingDefaultJournalEntryAllDay = false
			}
		},
	},
}
</script>
