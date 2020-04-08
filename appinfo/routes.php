<?php
declare(strict_types=1);
/**
 * Calendar App
 *
 * @author Georg Ehrke
 * @copyright 2018 Georg Ehrke <oc.list@georgehrke.com>
 * @author Thomas Müller
 * @copyright 2016 Thomas Müller <thomas.mueller@tmit.eu>
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
return [
	'routes' => [
		// User views
		['name' => 'view#index', 'url' => '/', 'verb' => 'GET'],
		['name' => 'view#index', 'url' => '/{view}/{timeRange}', 'verb' => 'GET', 'requirements' => ['view' => 'timeGridDay|timeGridWeek|dayGridMonth|timeline|journal'], 'postfix' => 'view.timerange'],
		['name' => 'view#index', 'url' => '/{view}/{timeRange}/new/{mode}/{isAllDay}/{dtStart}/{dtEnd}', 'verb' => 'GET', 'requirements' => ['view' => 'timeGridDay|timeGridWeek|dayGridMonth|timeline|journal'], 'postfix' => 'view.timerange.new'],
		['name' => 'view#index', 'url' => '/{view}/{timeRange}/edit/{mode}/{objectId}/{recurrenceId}', 'verb' => 'GET', 'requirements' => ['view' => 'timeGridDay|timeGridWeek|dayGridMonth|timeline|journal'], 'postfix' => 'view.timerange.edit'],
		// Autocompletion
		['name' => 'contact#searchAttendee', 'url' => '/v1/autocompletion/attendee', 'verb' => 'POST'],
		['name' => 'contact#searchLocation', 'url' => '/v1/autocompletion/location', 'verb' => 'POST'],
		['name' => 'contact#searchPhoto', 'url' => '/v1/autocompletion/photo', 'verb' => 'POST'],
		// Settings
		['name' => 'settings#setConfig', 'url' => '/v1/config/{key}', 'verb' => 'POST'],
	]
];
