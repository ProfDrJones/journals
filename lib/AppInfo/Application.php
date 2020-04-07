<?php
declare(strict_types=1);
/**
 * Nextcloud - Journals
 *
 * @author Johannes Szeibert
 *
 * This is a modified version from Nextcloud - Calendar
 * original by:
 *
 * @author Georg Ehrke
 * @copyright 2019 Georg Ehrke <oc.list@georgehrke.com>
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
namespace OCA\Journals\AppInfo;

use OCP\AppFramework\App;

/**
 * Class Application
 *
 * @package OCA\Journals\AppInfo
 */
class Application extends App {

	/**
	 * @param array $params
	 */
	public function __construct(array $params=[]) {
		parent::__construct('journals', $params);
	}
}
