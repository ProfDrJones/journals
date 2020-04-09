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
namespace OCA\Journals\Controller;

use OCP\App\IAppManager;
use OCP\AppFramework\Controller;
use OCP\AppFramework\Http\TemplateResponse;
use OCP\IConfig;
use OCP\IInitialStateService;
use OCP\IRequest;

/**
 * Class ViewController
 *
 * @package OCA\Journals\Controller
 */
class ViewController extends Controller {

	/**
	 * @var IConfig
	 */
	private $config;

	/**
	 * @var string
	 */
	private $userId;

	/**
	 * @var IInitialStateService
	 */
	private $initialStateService;

	/**
	 * @var IAppManager
	 */
	private $appManager;

	/**
	 * @param string $appName
	 * @param IRequest $request an instance of the request
	 * @param IConfig $config
	 * @param IInitialStateService $initialStateService
	 * @param IAppManager $appManager
	 * @param string $userId
	 */
	public function __construct(string $appName,
								IRequest $request,
								IConfig $config,
								IInitialStateService $initialStateService,
								IAppManager $appManager,
								?string $userId) {
		parent::__construct($appName, $request);
		$this->config = $config;
		$this->userId = $userId;
		$this->initialStateService = $initialStateService;
		$this->appManager = $appManager;
	}

	/**
	 * Load the main calendar page
	 *
	 * @NoAdminRequired
	 * @NoCSRFRequired
	 *
	 * @return TemplateResponse
	 */
	public function index():TemplateResponse {
		$defaultInitialView = $this->config->getAppValue($this->appName, 'currentView', 'timeline');
		$defaultTimezone = $this->config->getAppValue($this->appName, 'timezone', 'automatic');

		$appVersion = $this->config->getAppValue($this->appName, 'installed_version');
		$firstRun = $this->config->getUserValue($this->userId, $this->appName, 'firstRun', 'yes') === 'yes';
		$initialView = $this->config->getUserValue($this->userId, $this->appName, 'currentView', $defaultInitialView);
		$defaultJournal = $this->config->getUserValue($this->userId, $this->appName, 'defaultJournal', 'none');
		$defaultJournalEntryAllDay = $this->config->getUserValue($this->userId, $this->appName, 'defaultJournalEntryAllDay', 'yes') === 'yes';
		$timezone = $this->config->getUserValue($this->userId, $this->appName, 'timezone', $defaultTimezone);

		$this->initialStateService->provideInitialState($this->appName, 'app_version', $appVersion);
		$this->initialStateService->provideInitialState($this->appName, 'first_run', $firstRun);
		$this->initialStateService->provideInitialState($this->appName, 'initial_view', $initialView);
		$this->initialStateService->provideInitialState($this->appName, 'defaultJournal', $defaultJournal);
		$this->initialStateService->provideInitialState($this->appName, 'defaultJournalEntryAllDay', $defaultJournalEntryAllDay);
		$this->initialStateService->provideInitialState($this->appName, 'timezone', $timezone);

		return new TemplateResponse($this->appName, 'main');
	}
}
