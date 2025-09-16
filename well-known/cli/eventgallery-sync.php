<?php
/**
 * @package    Joomla.Cli
 *
 * @copyright  Copyright (C) 2005 - 2014 Open Source Matters, Inc. All rights reserved.
 * @license    GNU General Public License version 2 or later; see LICENSE.txt
 */

// Set flag that this is a parent file.
const _JEXEC = 1;

error_reporting(E_ALL | E_NOTICE);
ini_set('display_errors', 1);

// Load system defines
if (file_exists(dirname(__DIR__) . '/defines.php'))
{
	require_once dirname(__DIR__) . '/defines.php';
}

if (!defined('_JDEFINES'))
{
	define('JPATH_BASE', dirname(__DIR__));
	require_once JPATH_BASE . '/includes/defines.php';
}

require_once JPATH_LIBRARIES . '/import.legacy.php';
require_once JPATH_LIBRARIES . '/cms.php';

// Load the configuration
require_once JPATH_CONFIGURATION . '/configuration.php';

require_once JPATH_ROOT . '/components/com_eventgallery/vendor/autoload.php';

/**
 * Job to sync the file system with the database
 *
 * @package  Joomla.Cli
 * @since    2.5
 */
class EventgallerySync extends JApplicationCli
{

	/** @noinspection PhpMissingParentConstructorInspection */
	public function __construct(JInputCli $input = null, JRegistry $config = null, JEventDispatcher $dispatcher = null)
	{
		if (array_key_exists('REQUEST_METHOD', $_SERVER))
		{
			die('CLI only. Do not call this from the browser.');
		}
	}
	/**
	 * Entry point for the script
	 *
	 * @return  void
	 *
	 * @since   2.5
	 */
	public function doExecute()
	{
		define('JPATH_COMPONENT_ADMINISTRATOR', JPATH_ADMINISTRATOR . '/components/com_eventgallery');
		define('JPATH_COMPONENT_SITE', JPATH_SITE . '/components/com_eventgallery');
		$language = JFactory::getLanguage();
		$language->load('com_eventgallery' , JPATH_COMPONENT_ADMINISTRATOR, $language->getTag(), true);

		//JLoader::registerPrefix('Eventgallery', JPATH_COMPONENT_ADMINISTRATOR);
		JLoader::registerPrefix('Eventgallery', JPATH_COMPONENT_SITE);

        $params = JComponentHelper::getParams('com_eventgallery');
        $use_htacces_to_protect_original_files = $params->get('use_htacces_to_protect_original_files', 1) == 1;

        require_once(JPATH_COMPONENT_ADMINISTRATOR.'/models/sync.php');
		$syncModel = JModelLegacy::getInstance('EventgalleryModelSync', '', array('ignore_request' => true));

		echo "\n\n=== Adding new Folders === \n\n";

		/**
         * @var EventgalleryLibraryManagerFolder $folderMgr
		 * @var EventgalleryLibraryFactoryFile $fileFactory
         */
        $folderMgr = EventgalleryLibraryManagerFolder::getInstance();
		$fileFactory = EventgalleryLibraryFactoryFile::getInstance();
		
        $addResults = $folderMgr->addNewFolders();
        foreach($addResults as $addResult) {
            /**
             * @var EventgalleryLibraryFolderAddresult $addResult
             */
            if ($addResult->getError() != null) {
                echo "ERROR: " . $addResult->getError() . "\n";
            } else {
                echo "Added: " . $addResult->getFolderName() . "\n";
            }
        }

        $folders = $syncModel->getFolders();

        echo "\n\n=== Synchronizing " . count($folders) . " folders ===\n\n";

        foreach($folders as $folder) {

        	$result = $syncModel->syncFolder($folder, null, $use_htacces_to_protect_original_files);

			if (isset($result['files'])) {
				$files = $result['files'];

				echo "Sync $folder with " . count($files) . " files\n\n";
				/**
				 * @var EventgalleryLibraryFile $file
				 */
				foreach ($files as $filename) {
					echo "    (Memory usage: ".memory_get_usage().") $folder - $filename \n";
					$file = $fileFactory->getFile($folder, $filename);
					$file->syncFile();
				}
			}

			echo "\n\n";
        }

		echo "Sync finished.";
	
	}
}

JApplicationCli::getInstance('EventgallerySync')->execute();
