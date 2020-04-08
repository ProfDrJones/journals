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
 * License along with this library.  If not, see <http://www.gnu.org/g/>.
 *
 */
namespace OCA\Journals\Controller;

use OCP\AppFramework\Controller;
use OCP\AppFramework\Http\JSONResponse;
use OCP\AppFramework\Http;
use OCP\IConfig;
use OCP\IRequest;

/**
 * Class SettingsController
 *
 * @package OCA\Journals\Controller
 */
class SettingsController extends Controller {

	/** @var IConfig */
	private $config;

	/** @var string */
	private $userId;

	/**
	 * SettingsController constructor.
	 *
	 * @param string $appName
	 * @param IRequest $request
	 * @param IConfig $config
	 * @param string $userId
	 */
	public function __construct(string $appName,
								IRequest $request,
								IConfig $config,
								string $userId) {
		parent::__construct($appName, $request);
		$this->config = $config;
		$this->userId = $userId;
	}

	/**
	 * set a configuration item
	 *
	 * @NoAdminRequired
	 *
	 * @param string $key The config key to set
	 * @param mixed $value The value to set for given config key
	 * @return JSONResponse
	 */
	public function setConfig(string $key,
							  string $value):JSONResponse {
		switch ($key) {
			case 'view':
				return $this->setView($value);
			case 'defaultJournal':
				return $this->setDefaultJournal($value);
			case 'defaultJournalEntryAllDay':
				return $this->setDefaultJournalEntryAllDay($value);
			case 'timezone':
				return $this->setTimezone($value);
			case 'firstRun':
				return $this->setFirstRun();
			default:
				return new JSONResponse([], Http::STATUS_BAD_REQUEST);
		}
	}


	/**
	 * set a new view
	 *
	 * @param string $view Selected view by user
	 * @return JSONResponse
	 */
	private function setView(string $view):JSONResponse {
		if (!\in_array($view, ['timeGridDay', 'timeGridWeek', 'dayGridMonth'])) {
			return new JSONResponse([], Http::STATUS_UNPROCESSABLE_ENTITY);
		}

		try {
			$this->config->setUserValue(
				$this->userId,
				$this->appName,
				'currentView',
				$view
			);
		} catch(\Exception $e) {
			return new JSONResponse([], Http::STATUS_INTERNAL_SERVER_ERROR);
		}

		return new JSONResponse();
	}

	/**
	 * remember that first run routines executed
	 *
	 * @return JSONResponse
	 */
	private function setFirstRun():JSONResponse {
		try {
			$this->config->setUserValue(
				$this->userId,
				$this->appName,
				'firstRun',
				'no'
			);
		} catch(\Exception $e) {
			return new JSONResponse([], Http::STATUS_INTERNAL_SERVER_ERROR);
		}

		return new JSONResponse();
	}

	/**
	 * sets display timezone for user
	 *
	 * @param string $value User-selected option for timezone to display events in
	 * @return JSONResponse
	 */
	private function setTimezone(string $value):JSONResponse {
		try {
			$this->config->setUserValue(
				$this->userId,
				$this->appName,
				'timezone',
				$value
			);
		} catch(\Exception $e) {
			return new JSONResponse([], Http::STATUS_INTERNAL_SERVER_ERROR);
		}

		return new JSONResponse();
	}

	/**
	 * sets display timezone for user
	 *
	 * @param string $value User-selected option for timezone to display events in
	 * @return JSONResponse
	 */
	private function setDefaultJournal(string $value):JSONResponse {
		try {
			$this->config->setUserValue(
				$this->userId,
				$this->appName,
				'defaultJournal',
				$value
			);
		} catch(\Exception $e) {
			return new JSONResponse([], Http::STATUS_INTERNAL_SERVER_ERROR);
		}

		return new JSONResponse();
	}

	/**
	 * sets display timezone for user
	 *
	 * @param string $value User-selected option for timezone to display events in
	 * @return JSONResponse
	 */
	private function setDefaultJournalEntryAllDay(string $value):JSONResponse {
		try {
			$this->config->setUserValue(
				$this->userId,
				$this->appName,
				'defaultJournalEntryAllDay',
				$value
			);
		} catch(\Exception $e) {
			return new JSONResponse([], Http::STATUS_INTERNAL_SERVER_ERROR);
		}

		return new JSONResponse();
	}
}
