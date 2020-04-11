/**
 * @copyright Copyright (c) 2019 Georg Ehrke
 *
 * @author Georg Ehrke <oc.list@georgehrke.com>
 *
 * @license GNU AGPL version 3 or any later version
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */
import HttpClient from '@nextcloud/axios'
import { getLinkToConfig } from '../utils/settings.js'
import detectTimezone from '../services/timezoneDetectionService'
import { setConfig } from 'calendar-js'

const state = {
	appVersion: null,
	eventLimit: null,
	firstRun: null,
	momentLocale: 'en',
	defaultJournal: null,
	defaultJournalEntryAllDay: null,
	timezone: null,
}

const mutations = {

	/**
	 * Updates the user's default Journal
	 *
	 * @param {Object} state The Vuex state
	 * @param {Object} data The destructuring object
	 * @param {String} data.calendarID The new JournalID
	 */
	setDefaultJournal(state, { calendarID }) {
		state.DefaultJournal = calendarID
	},

	/**
	 * Updates the user's setting for Journals Entries to be AllDay by default
	 *
	 * @param {Object} state The Vuex state
	 */
	toggleDefaultJournalEntryAllDayEnabled(state) {
		state.defaultJournalEntryAllDay = !state.defaultJournalEntryAllDay
	},

	/**
	 * Updates the user's timezone
	 *
	 * @param {Object} state The Vuex state
	 * @param {Object} data The destructuring object
	 * @param {String} data.timezoneId The new timezone
	 */
	setTimezone(state, { timezoneId }) {
		state.timezone = timezoneId
	},

	/**
	 * Initialize settings
	 *
	 * @param {Object} state The Vuex state
	 * @param {Object} settings The full settings object
	 */
	loadSettingsFromServer(state, settings) {
		console.debug('Initial settings:', settings)

		state.appVersion = settings.appVersion
		state.firstRun = settings.firstRun
		state.defaultJournal = settings.defaultJournal
		state.defaultJournalEntryAllDay = settings.defaultJournalEntryAllDay
		state.timezone = settings.timezone
	},

	/**
	 * Sets the name of the moment.js locale to be used
	 *
	 * @param {Object} state The Vuex state
	 * @param {String} locale The moment.js locale to be used
	 */
	setMomentLocale(state, locale) {
		state.momentLocale = locale
	},
}

const getters = {

	/**
	 * Gets the resolved timezone.
	 * If the timezone is set to automatic, it returns the user's current timezone
	 * Otherwise, it returns the Olsen timezone stored
	 *
	 * @param {Object} state The Vuex state
	 * @returns {String}
	 */
	getResolvedTimezone: (state) => state.timezone === 'automatic'
		? detectTimezone()
		: state.timezone,
}

const actions = {

	/**
	 * Updates the user's setting for Journal Entryies to be AllDay by default
	 *
	 * @param {Object} context The Vuex context
	 * @returns {Promise<void>}
	 */
	async toggleDefaultJournalEntryAllDayEnabled(context) {
		const newState = !context.state.defaultJournalEntryAllDay
		const value = newState ? 'yes' : 'no'

		await HttpClient.post(getLinkToConfig('defaultJournalEntryAllDay'), { value })
		context.commit('toggleDefaultJournalEntryAllDayEnabled')
	},

	/**
	 * Updates the view to be used as initial view when opening
	 * the calendar app again
	 *
	 * @param {Object} context The Vuex context
	 * @param {Object} data The destructuring object
	 * @param {String} data.initialView New view to be used as initial view
	 * @returns {Promise<void>}
	 */
	async setInitialView(context, { initialView }) {
		await HttpClient.post(getLinkToConfig('view'), {
			value: initialView,
		})
	},

	/**
	 * Updates the user's timezone
	 *
	 * @param {Object} context The Vuex context
	 * @param {Object} data The destructuring object
	 * @param {String} data.timezoneId The new timezone
	 * @returns {Promise<void>}
	 */
	async setTimezone(context, { timezoneId }) {
		if (context.state.timezone === timezoneId) {
			return
		}

		await HttpClient.post(getLinkToConfig('timezone'), {
			value: timezoneId,
		})
		context.commit('setTimezone', { timezoneId })
	},

	/**
	 * Updates the user's default Journal
	 *
	 * @param {Object} context The Vuex context
	 * @param {Object} data The destructuring object
	 * @param {String} data.timezoneId The new dalendarId
	 * @returns {Promise<void>}
	 */
	async setDefaultJournal(context, { value }) {
		if (context.state.defaultJournal === value) {
			return
		}

		await HttpClient.post(getLinkToConfig('defaultJournal'), { value })
		context.commit('setDefaultJournal', { value })
	},

	/**
	 * Initializes the calendar-js configuration
	 *
	 * @param {Object} vuex The Vuex destructuring object
	 * @param {Object} vuex.state The Vuex state
	 */
	initializeCalendarJsConfig({ state }) {
		setConfig('PRODID', `-//IDN nextcloud.com//Journals app ${state.appVersion}//EN`)
		setConfig('component-list-significant-change', [
			'SUMMARY',
			'LOCATION',
			'DESCRIPTION',
		])
	},
}

export default { state, mutations, getters, actions }
