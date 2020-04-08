/**
 * Nextcloud - Journals
 * 
 * @author Johannes Szeibert
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU AFFERO GENERAL PUBLIC LICENSE
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU AFFERO GENERAL PUBLIC LICENSE for more details.
 *
 * You should have received a copy of the GNU Affero General Public
 * License along with this library.  If not, see <http://www.gnu.org/licenses/>.
 *
 */
 
import { getDateFromDateTimeValue } from '../utils/date.js'
import { getHexForColorName } from '../utils/color.js'
import {
	getDefaultRecurrenceRuleObject,
	mapRecurrenceRuleValueToRecurrenceRuleObject,
} from './recurrenceRule.js'

/**
 * Creates a complete calendar-object-instance-object based on given props
 *
 * @param {Object} props The props already provided
 * @returns {Object}
 */
const getDefaultJournalObject = (props = {}) => Object.assign({}, {
	// The real journal-component coming from calendar-js
	journalComponent: null,
	// Title of the journal
	title: null,
	// Start date of the journal
	startDate: null,
	// Timezone of the start date
	startTimezoneId: null,
	// Indicator whether or not journal is all-day
	isAllDay: false,
	// Whether or not the user is allowed to toggle the all-day checkbox
	canModifyAllDay: true,
	// description of the journal
	description: null,
	// Access class of the journal (PUBLIC, PRIVATE, CONFIDENTIAL)
	accessClass: null,
	// Status of the journal (CONFIRMED, TENTATIVE, CANCELLED)
	status: null,
	// The recurrence rule of this journal. We only support one recurrence-rule
	recurrenceRule: getDefaultRecurrenceRuleObject(),
	// Whether or not this journal has multiple recurrence-rules
	hasMultipleRRules: false,
	// Whether or not this is the master item
	isMasterItem: false,
	// Whether or not this is a recurrence-exception
	isRecurrenceException: false,
	// Whether or not the applied modifications require to update this and all future
	forceThisAndAllFuture: false,
	// Whether or not it's possible to create a recurrence-exception for this journal
	canCreateRecurrenceException: false,
	// Attendees of this journal
	attendees: [],
	// Organizer of the journal
	organizer: null,
	// Custom color of the journal
	customColor: null,
	// Categories
	categories: [],
}, props)

/**
 *
 * @param {JournalComponent} journalComponent The calendar-js journalComponent
 * @returns {Object}
 */
const mapJournalComponentToJournalObject = (journalComponent) => {
	const journalObject = getDefaultJournalObject({
		journalComponent,
		title: journalComponent.title,
		isAllDay: journalComponent.isAllDay(),
		canModifyAllDay: journalComponent.canModifyAllDay(),
		description: journalComponent.description,
		accessClass: journalComponent.accessClass,
		status: journalComponent.status,
		categories: Array.from(journalComponent.getCategoryIterator()),
		isMasterItem: journalComponent.isMasterItem(),
		isRecurrenceException: journalComponent.isRecurrenceException(),
		canCreateRecurrenceException: journalComponent.canCreateRecurrenceExceptions(),
	})

	journalObject.startDate = getDateFromDateTimeValue(journalComponent.startDate)
	journalObject.startTimezoneId = journalComponent.startDate.timezoneId
	journalObject.endTimezoneId = journalComponent.endDate.timezoneId

	/**
	 * Extract organizer if there is any
	 */
	if (journalComponent.organizer) {
		const organizerProperty = journalComponent.getFirstProperty('ORGANIZER')
		journalObject.organizer = {
			commonName: organizerProperty.commonName,
			uri: organizerProperty.email,
			attendeeProperty: organizerProperty,
		}
	}

	/**
	 * Extract attendees
	 */
	for (const attendee of journalComponent.getAttendeeIterator()) {
		journalObject.attendees.push(mapAttendeePropertyToAttendeeObject(attendee))
	}

	/**
	 * Extract recurrence-rule
	 */
	const recurrenceRuleIterator = journalComponent.getPropertyIterator('RRULE')
	const recurrenceRuleFirstIteration = recurrenceRuleIterator.next()

	const firstRecurrenceRule = recurrenceRuleFirstIteration.value
	if (firstRecurrenceRule) {
		journalObject.recurrenceRule = mapRecurrenceRuleValueToRecurrenceRuleObject(firstRecurrenceRule.getFirstValue(), journalComponent.startDate)
		journalObject.hasMultipleRRules = !recurrenceRuleIterator.next().done
	}

	/**
	 * Convert the CSS 3 color name to a hex color
	 */
	if (journalComponent.hasProperty('COLOR')) {
		const hexColor = getHexForColorName(journalComponent.getFirstPropertyFirstValue('COLOR'))
		if (hexColor !== null) {
			journalObject.customColor = hexColor
		}
	}

	return journalObject
}

export {
	getDefaultJournalObject,
	mapJournalComponentToJournalObject,
}
