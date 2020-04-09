<!--
  - @copyright Copyright (c) 2020 Georg Ehrke <oc.list@georgehrke.com>
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
	<AppContent>
		<template v-slot:primary-actions style="max-height: none !important">
			<PropertyTitleTimePicker
				:start-date="startDate"
				:start-timezone="startTimezone"
				:is-all-day="isAllDay" />
		</template>

		<div v-if="displayDetails">
			<PropertyCalendarPicker
				:calendars="calendars"
				:calendar="selectedCalendar"
				:is-read-only="isReadOnly"
				@selectCalendar="changeCalendar" />
		</div>
		<SaveButtons
			class="app-sidebar-tab__buttons"
			:can-create-recurrence-exception="canCreateRecurrenceException"
			:is-new="isNew"
			:force-this-and-all-future="forceThisAndAllFuture"
			@saveThisOnly="saveAndLeave(false)"
			@saveThisAndAllFuture="saveAndLeave(true)" />
	</AppContent>
</template>

<script>
import AppContent from '@nextcloud/vue/dist/Components/AppContent'
import PropertyTitleTimePicker from '../components/Editor/Properties/PropertyTitleTimePicker'
import PropertyCalendarPicker from '../components/Editor/Properties/PropertyCalendarPicker'
import SaveButtons from '../components/Editor/SaveButtons.vue'
import EditorMixin from '../mixins/EditorMixin'

export default {
	name: 'Journal',
	components: {
		AppContent,
		PropertyTitleTimePicker,
		PropertyCalendarPicker,
		SaveButtons,
	},
	mixins: [
		EditorMixin,
	],
}
</script>
