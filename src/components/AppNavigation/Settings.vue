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
			<ActionCheckbox
				:is-disabled="loadingCalendars"
				class="settings-fieldset-interior-item"
				:checked="defaultJournalEntryAllDay"
				:disabled="savingDefaultJournalEntryAllDay"
				@update:checked="toggleDefaultJournalEntryAllDayEnabled">
				{{ $t('journals', 'Default Journal Entries as AllDay') }}
			</ActionCheckbox>
			<SettingsDefaultJournalSelect :is-disabled="loadingCalendars" />
			<SettingsTimezoneSelect :is-disabled="loadingCalendars" />
		</ul>
	</AppNavigationSettings>
</template>

<script>
import ActionCheckbox from '@nextcloud/vue/dist/Components/ActionCheckbox'
import AppNavigationSettings from '@nextcloud/vue/dist/Components/AppNavigationSettings'

import SettingsDefaultJournalSelect from './Settings/SettingsDefaultJournalSelect.vue'
import SettingsTimezoneSelect from './Settings/SettingsTimezoneSelect.vue'

import {
	mapState,
} from 'vuex'

export default {
	name: 'Settings',
	components: {
		ActionCheckbox,
		AppNavigationSettings,
		SettingsDefaultJournalSelect,
		SettingsTimezoneSelect,
	},
	props: {
		loadingCalendars: {
			type: Boolean,
			default: false,
		},
	},
	data: function() {
		return {
			savingDefaultJournalEntryAllDay: false,
		}
	},
	computed: {
		...mapState({
			defaultJournalEntryAllDay: state => !state.settings.defaultJournalEntryAllDay,
		}),
	},
	methods: {

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
