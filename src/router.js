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
import Timeline from './views/Timeline'
import Journal from './views/Journal'
import CalendarSidebar from './views/CalendarSidebar'
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
			name: 'TimelineView',
			components: {
				default: Timeline,
				sideBar: CalendarSidebar,
			},
		},
		{
			path: '/journal/:firstDay',
			name: 'JournalView',
			components: {
				default: Journal,
				sideBar: CalendarSidebar,
			},
		},
		{
			path: '/calendar/:firstDay',
			name: 'CalendarView',
			components: {
				default: Calendar,
			},
		},

		{
			path: '/',
			redirect: `/${getInitialView()}/now`,
		},
	],
})

export default router
