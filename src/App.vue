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
	<Content app-name="calendar">
		<AppNavigation>
			<!-- Date Picker, View Buttons, Today Button -->
			<AppNavigationHeader />
			<!-- Calendar / Subscription List -->
			<CalendarList
				:loading-calendars="loadingCalendars" />
			<!-- Settings and import -->
			<Settings
				:loading-calendars="loadingCalendars" />
		</AppNavigation>
		<RouterView />
		<RouterView name="sideBar" />
	</Content>
</template>

<script>
import AppNavigation from '@nextcloud/vue/dist/Components/AppNavigation'
import Content from '@nextcloud/vue/dist/Components/Content'
import debounce from 'debounce'
import { uidToHexColor } from './utils/color.js'
import client from './services/caldavService.js'
import {
	dateFactory,
	getUnixTimestampFromDate,
	getYYYYMMDDFromFirstdayParam,
} from './utils/date.js'
import AppNavigationHeader from './components/AppNavigation/AppNavigationHeader.vue'
import CalendarList from './components/AppNavigation/CalendarList.vue'
import Settings from './components/AppNavigation/Settings.vue'
import getTimezoneManager from './services/timezoneDataProviderService'
import eventSource from './fullcalendar/eventSource'
import {
	mapGetters,
	mapState,
} from 'vuex'
import loadMomentLocalization from './utils/moment.js'
import { loadState } from '@nextcloud/initial-state'

export default {
	name: 'App',
	components: {
		Settings,
		CalendarList,
		AppNavigation,
		AppNavigationHeader,
		Content,
	},
	data() {
		return {
			loadingCalendars: true,
		}
	},
	computed: {
		...mapGetters({
			timezoneId: 'getResolvedTimezone',
		}),
		...mapState({
			timezone: state => state.settings.timezone,
			modificationCount: state => state.calendarObjects.modificationCount,
		}),
		eventSources() {
			return this.$store.getters.enabledCalendars.map(eventSource(this.$store))
		},
		defaultDate() {
			return getYYYYMMDDFromFirstdayParam(this.$route.params.firstDay)
		},
	},
	beforeRouteUpdate(to, from, next) {
		this.saveNewView(to.params.view)
		next()
		next()
	},
	created() {
		this.timeFrameCacheExpiryJob = setInterval(() => {
			const timestamp = (getUnixTimestampFromDate(dateFactory()) - 60 * 10)
			const timeRanges = this.$store.getters.getAllTimeRangesOlderThan(timestamp)

			for (const timeRange of timeRanges) {
				this.$store.commit('removeTimeRange', {
					timeRangeId: timeRange.id,
				})
				this.$store.commit('deleteFetchedTimeRangeFromCalendar', {
					calendar: {
						id: timeRange.calendarId,
					},
					fetchedTimeRangeId: timeRange.id,
				})
			}
		}, 1000 * 60)

		this.updateTodayJob = setInterval(() => {
			const newDate = getYYYYMMDDFromFirstdayParam('now')

			if (this.updateTodayJobPreviousDate === null) {
				this.updateTodayJobPreviousDate = newDate
				return
			}

			if (this.updateTodayJobPreviousDate !== newDate) {
				this.updateTodayJobPreviousDate = newDate
			}
		}, 1000)
	},
	async beforeMount() {
		this.$store.commit('loadSettingsFromServer', {
			appVersion: loadState('journals', 'app_version'),
			firstRun: loadState('journals', 'first_run'),
			timezone: loadState('journals', 'timezone'),
		})
		this.$store.dispatch('initializeCalendarJsConfig')

		await client.connect({ enableCalDAV: true })
		await this.$store.dispatch('fetchCurrentUserPrincipal')
		const calendars = await this.$store.dispatch('getCalendars')
		const owners = []
		calendars.forEach((calendar) => {
			if (owners.indexOf(calendar.owner) === -1) {
				owners.push(calendar.owner)
			}
		})
		owners.forEach((owner) => {
			this.$store.dispatch('fetchPrincipalByUrl', {
				url: owner,
			})
		})

		const writeableCalendarIndex = calendars.findIndex((calendar) => {
			return !calendar.readOnly
		})

		// No writeable calendars? Create a new one!
		if (writeableCalendarIndex === -1) {
			this.loadingCalendars = true
			await this.$store.dispatch('appendCalendar', {
				displayName: this.$t('journals', 'Personal'),
				color: uidToHexColor(this.$t('journals', 'Personal')),
				order: 0,
			})
		}

		this.loadingCalendars = false

	},
	async mounted() {
		if (this.timezone === 'automatic' && this.timezoneId === 'UTC') {
			const { toastElement }
				= this.$toast.warning(this.$t('journals', 'The automatic timezone detection determined your timezone to be UTC.\nThis is most likely the result of security measures of your web browser.\nPlease set your timezone manually in the calendar settings.'), { timeout: 60 })

			toastElement.classList.add('toast-calendar-multiline')
		}
		if (getTimezoneManager().getTimezoneForId(this.timezoneId) === null) {
			const { toastElement }
				= this.$toast.warning(this.$t('journals', 'Your configured timezone ({timezoneId}) was not found. Falling back to UTC.\nPlease change your timezone in the settings and report this issue.', { timezoneId: this.timezoneId }), { timeout: 60 })

			toastElement.classList.add('toast-calendar-multiline')
		}

		this.loadMomentLocale()
	},
	methods: {
		saveNewView: debounce(function(initialView) {
			this.$store.dispatch('setInitialView', { initialView })
		}, 5000),
		/**
		 * Loads the locale data for moment.js
		 *
		 * @returns {Promise<void>}
		 */
		async loadMomentLocale() {
			const momentLocale = await loadMomentLocalization()
			this.$store.commit('setMomentLocale', momentLocale)
		},
	},
}
</script>
