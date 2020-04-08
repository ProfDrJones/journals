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
	<AppSidebar title="title">
		<!-- Full calendar -->
		<FullCalendar
			ref="fullCalendar"
			default-view="listWeek"
			:force-event-duration="true"
			:header="false"
			:height="windowResize"
			:week-numbers="true"
			:weekends="true"
			:event-sources="eventSources"
			:event-order="eventOrder"
			:plugins="plugins"
			:default-date="defaultDate"
			:locales="locales"
			:locale="fullCalendarLocale"
			:first-day="firstDay"
			:selectable="true"
			:select-mirror="true"
			:lazy-fetching="false"
			:nav-links="true"
			:now-indicator="true"
			:progressive-event-rendering="true"
			:unselect-auto="false"
			:week-numbers-within-days="true"
			@eventResize="eventResize" />
	</AppSidebar>
</template>

<script>
import AppSidebar from '@nextcloud/vue/dist/Components/AppSidebar'
import FullCalendar from '@fullcalendar/vue'
import '@fullcalendar/core/main.css'
import listPlugin from '@fullcalendar/list'
import debounce from 'debounce'
import VTimezoneNamedTimezone from '../fullcalendar/vtimezoneNamedTimezoneImpl'
import { getLocale } from '@nextcloud/l10n'
import {
	getYYYYMMDDFromFirstdayParam,
} from '../utils/date.js'
import eventResize from '../fullcalendar/eventResize'
import windowResize from '../fullcalendar/windowResize.js'
import eventOrder from '../fullcalendar/eventOrder'
import eventSource from '../fullcalendar/eventSource'

export default {
	name: 'CalendarSidebar',
	components: {
		AppSidebar,
		FullCalendar,
	},
	data() {
		return {
			loadingEvents: true,
			fullCalendarLocale: 'en',
			locales: [],
			firstDay: 0,
		}
	},
	computed: {
		eventSources() {
			return this.$store.getters.enabledCalendars.map(eventSource(this.$store))
		},
		plugins() {
			return [
				listPlugin,
				VTimezoneNamedTimezone,
			]
		},
		eventOrder() {
			return ['start', '-duration', 'allDay', eventOrder]
		},
		defaultDate() {
			return getYYYYMMDDFromFirstdayParam(this.$route.params.firstDay)
		},
	},

	beforeRouteUpdate(to, from, next) {
		if (to.params.firstDay !== from.params.firstDay) {
			const calendarApi = this.$refs.fullCalendar.getApi()
			calendarApi.gotoDate(getYYYYMMDDFromFirstdayParam(to.params.firstDay))
		}
		next()
		next()
	},
	watch: {
		modificationCount: debounce(function() {
			const calendarApi = this.$refs.fullCalendar.getApi()
			calendarApi.refetchEvents()
		}, 50),
	},
	methods: {
		eventResize(...args) {
			return eventResize(this.$store)(...args)
		},
		windowResize(...args) {
			return windowResize(window, document.querySelector('#header'))(...args)
		},
		/**
		 * Loads the locale data for full-calendar
		 *
		 * @returns {Promise<void>}
		 */
		async loadFullCalendarLocale() {
			let locale = getLocale().replace('_', '-').toLowerCase()
			try {
				// try to load the default locale first
				const fcLocale = await import('@fullcalendar/core/locales/' + locale)
				this.locales.push(fcLocale)
				// We have to update firstDay manually till https://github.com/fullcalendar/fullcalendar-vue/issues/36 is fixed
				this.firstDay = fcLocale.week.dow
				this.fullCalendarLocale = locale
			} catch (e) {
				try {
					locale = locale.split('-')[0]
					const fcLocale = await import('@fullcalendar/core/locales/' + locale)
					this.locales.push(fcLocale)
					// We have to update firstDay manually till https://github.com/fullcalendar/fullcalendar-vue/issues/36 is fixed
					this.firstDay = fcLocale.week.dow
					this.fullCalendarLocale = locale
				} catch (e) {
					console.debug('falling back to english locale')
				}
			}
		},
	},
}
</script>
