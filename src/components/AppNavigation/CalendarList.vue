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
	<transition-group
		id="calendars-list"
		name="list"
		tag="ul">
		<CalendarListItemLoadingPlaceholder v-if="loadingCalendars" :key="loadingKeyCalendars" />
		<AppNavigationCaption :key="journalsCaptionKey" :title="journalTitle" />
		<CalendarListItem
			v-for="calendar in journalCalendars"
			:key="calendar.id"
			:calendar="calendar" />
		<CalendarListNew
			v-if="!loadingCalendars"
			:key="newCalendarKey"
			:disabled="loadingCalendars" />
		<AppNavigationCaption :key="nonJournalsCaptionKey" :title="nonJournalsTitle" />
		<CalendarListItem
			v-for="calendar in nonJournalCalendars"
			:key="calendar.id"
			:calendar="calendar" />
	</transition-group>
</template>

<script>
import {
	mapGetters,
} from 'vuex'
import AppNavigationCaption from '@nextcloud/vue/dist/Components/AppNavigationCaption'
import CalendarListNew from './CalendarList/CalendarListNew.vue'
import CalendarListItem from './CalendarList/CalendarListItem.vue'
import CalendarListItemLoadingPlaceholder from './CalendarList/CalendarListItemLoadingPlaceholder.vue'

export default {
	name: 'CalendarList',
	components: {
		AppNavigationCaption,
		CalendarListNew,
		CalendarListItem,
		CalendarListItemLoadingPlaceholder,
	},
	props: {
		isPublic: {
			type: Boolean,
			required: true,
		},
		loadingCalendars: {
			type: Boolean,
			default: false,
		},
	},
	computed: {
		...mapGetters({
			allCalendars: 'sortedCalendarsSubscriptions',
			journalCalendars: 'sortedJournalCalendars',
			nonJournalCalendars: 'sortedNonJournalCalendars',
			subscriptions: 'sortedSubscriptions',
		}),
		newCalendarKey() {
			return this._uid + '-new-calendar'
		},
		loadingKeyCalendars() {
			return this._uid + '-loading-placeholder-calendars'
		},
		journalsCaptionKey() {
			return this._uid + '-journalCaption'
		},
		nonJournalsCaptionKey() {
			return this._uid + '-nonJournalCaption'
		},
		journalsTitle() {
			return this.$t('journals', 'Journals')
		},
		nonJournalsTitle() {
			return this.$t('journals', 'Other Calendars')
		},
	},
}
</script>
