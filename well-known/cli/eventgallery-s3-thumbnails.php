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
class EventgalleryS3Thumbnails extends JApplicationCli
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
		echo "  ================================================="."\n";
		echo "  S3 Thumbnail Creator\n\n";
		echo "  This script calculates the thumbnails for your S3 images if the"."\n";
		echo "  ETag values do not match the current thumbnail or if the thumbnail"."\n";
		echo "  is missing at all. "."\n";
		echo "  "."\n\n";
		echo "  Command line options\n\n";
		echo "  refreshetags=[true|false]\n";
		echo "      You can get the ETag data from S3 and write them to the database by"."\n";
		echo "      adding -refreshetags=true to the command line to avoid calculating them"."\n";
		echo "      twice. Default is true.\n\n";
		echo "  calcthumbnails=[true|false]\n";
		echo "      use this to perform the thumbnail calculation. Default: false";
		echo "  "."\n";
		echo "  ================================================="."\n\n\n";

		$saveETagOfThumbnailsToDatabase = true;
		$calculateMissingThumbnails = false;

		print_r($_SERVER['argv']);

		foreach ($_SERVER['argv'] as $arg) {
			$e=explode("=",$arg);
			if (count($e)==2) {
				if (strcasecmp('refreshetags',$e[0]) == 0 && !boolval($e[1])) {
					$saveETagOfThumbnailsToDatabase = false;
				}
				if (strcasecmp('calcthumbnails',$e[0]) == 0 && boolval($e[1])) {
					$calculateMissingThumbnails = true;
				}
			}
		}

		define('JPATH_COMPONENT_ADMINISTRATOR', JPATH_ADMINISTRATOR . '/components/com_eventgallery');
		define('JPATH_COMPONENT_SITE', JPATH_SITE . '/components/com_eventgallery');
		$language = JFactory::getLanguage();
		$language->load('com_eventgallery' , JPATH_COMPONENT_ADMINISTRATOR, $language->getTag(), true);

		JLoader::registerPrefix('Eventgallery', JPATH_COMPONENT_SITE);

        require_once(JPATH_COMPONENT_ADMINISTRATOR.'/models/s3.php');
		$s3Model = JModelLegacy::getInstance('EventgalleryModelS3', '', array('ignore_request' => true));

		/**

		 * @var EventgalleryLibraryFactoryFile $fileFactory
		 * @var EventgalleryLibraryFileS3 $fileObject
		 * @var EventgalleryModelS3 $s3Model
         */

		$fileFactory = EventgalleryLibraryFactoryFile::getInstance();
		
        $folders = $s3Model->getFolders();

        echo "\n\n=== Doing thumbnail creation for " . count($folders) . " folders ===\n\n";

        foreach($folders as $folder) {

        	$files = $s3Model->getFilesToSync($folder, $saveETagOfThumbnailsToDatabase);
			echo "Folder \"$folder\" needs thumbnails for " . count($files) . " files\n\n";

			if ($calculateMissingThumbnails) {
				foreach ($files as $file) {
					echo "    (Memory usage: " . memory_get_usage() . ") $folder - $file \n";
					$fileObject = $fileFactory->getFile($folder, $file);
					$fileObject->createThumbnails();
				}
			}

			echo "\n";
        }

		echo "Thumbnail creation finished.";
	
	}
}

JApplicationCli::getInstance('EventgalleryS3Thumbnails')->execute();
