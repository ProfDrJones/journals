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
		key="calendars-list"
		name="list"
		tag="ul">
		<AppNavigationItem
			:key="categoryCaptionKey"
			:title="categoryTitle"
			:allow-collapse="true"
			:open="false">
			<li />
		</AppNavigationItem>
		<AppNavigationItem
			:key="journalsCaptionKey"
			:title="journalsTitle"
			:allow-collapse="true"
			:open="true">
			<CalendarListItem
				v-for="calendar in journalCalendars"
				:key="calendar.id"
				:calendar="calendar" />
			<CalendarListNew
				v-if="!loadingCalendars"
				:key="newCalendarKey"
				:disabled="loadingCalendars" />
			<CalendarListItemLoadingPlaceholder v-if="loadingCalendars" :key="loadingKeyJournals" />
		</AppNavigationItem>
		<AppNavigationItem
			:key="nonJournalsCaptionKey"
			:title="nonJournalsTitle"
			:allow-collapse="true"
			:open="true">
			<CalendarListItem
				v-for="calendar in nonJournalCalendars"
				:key="calendar.id"
				:calendar="calendar" />
			<CalendarListItemLoadingPlaceholder v-if="loadingCalendars" :key="loadingKeyCalendars" />
		</AppNavigationItem>
	</transition-group>
</template>

<script>
import {
	mapGetters,
} from 'vuex'
import AppNavigationItem from '@nextcloud/vue/dist/Components/AppNavigationItem'
import CalendarListNew from './CalendarList/CalendarListNew.vue'
import CalendarListItem from './CalendarList/CalendarListItem.vue'
import CalendarListItemLoadingPlaceholder from './CalendarList/CalendarListItemLoadingPlaceholder.vue'

export default {
	name: 'CalendarList',
	components: {
		AppNavigationItem,
		CalendarListNew,
		CalendarListItem,
		CalendarListItemLoadingPlaceholder,
	},
	props: {
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
		loadingKeyJournals() {
			return this._uid + '-loading-placeholder-journals'
		},
		loadingKeyCalendars() {
			return this._uid + '-loading-placeholder-calendars'
		},
		categoryTitle() {
			return this.$t('journals', 'Categories')
		},
		categoryCaptionKey() {
			return this._uid + '-categoryCaption'
		},
		journalsTitle() {
			return this.$t('journals', 'Journals')
		},
		journalsCaptionKey() {
			return this._uid + '-journalCaption'
		},
		nonJournalsTitle() {
			return this.$t('journals', 'Other Calendars')
		},
		nonJournalsCaptionKey() {
			return this._uid + '-nonJournalCaption'
		},
	},
}
</script>
