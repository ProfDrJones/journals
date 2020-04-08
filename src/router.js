/**
 * Nextcloud - Journals
 *
 * @author Johannes Szeibert
 *
 * This is a modified version from Nextcloud - Calendar
 * original by:
 *
 * @copyright Copyright (c) 2019 Georg Ehrke
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

import Vue from 'vue'
import Router from 'vue-router'
import { getRootUrl, generateUrl } from '@nextcloud/router'

import Calendar from './views/Calendar'
import EditSidebar from './views/EditSidebar'
import Timeline from './views/Timeline'
import Journal from './views/Journal'
import { getInitialView } from './utils/router.js'

Vue.use(Router)

const webRootWithIndexPHP = getRootUrl() + '/index.php'
const doesURLContainIndexPHP = window.location.pathname.startsWith(webRootWithIndexPHP)
const base = generateUrl('apps/journals', {}, {
	noRewrite: doesURLContainIndexPHP,
})

const router = new Router({
	mode: 'history',
	base,
	routes: [

		{
			path: '/timeline/:firstDay',
			component: Timeline,
			name: 'TimelineView',
		},

		{
			path: '/journal/:firstDay',
			component: Journal,
			name: 'JournalView',
		},
		/**
		 * This route is the root-view that does not contain any parameters so far.
		 * Users usually access it by clicking the calendar-icon in the navigation bar.
		 *
		 * It automatically redirects you to the calendar view, showing the current month
		 * in the user's preferred view.
		 */
		{
			path: '/',
			redirect: `/${getInitialView()}/now`,
		},
		{
			path: '/edit/:object',
			redirect: `/${getInitialView()}/now/edit/sidebar/:object/next`,
		},
		/**
		 * This is the main route that contains the current view and viewed day
		 * It has to be last, so that other routes starting with /p/, etc. match first
		 *
		 *
		 *
		 */
		{
			path: '/:view/:firstDay',
			component: Calendar,
			name: 'CalendarView',
			children: [
				{
					path: '/:view/:firstDay/edit/sidebar/:object/:recurrenceId',
					name: 'EditSidebarView',
					component: EditSidebar,
				},
				{
					path: '/:view/:firstDay/new/sidebar/:allDay/:dtstart/:dtend',
					name: 'NewSidebarView',
					component: EditSidebar,
				},
			],
		},
	],
})

export default router
