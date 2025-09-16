<?php

/**
 * @package     Sven.Bluege
 * @subpackage  com_eventgallery
 *
 * @copyright   Copyright (C) 2005 - 2013 Sven Bluege All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

// Check to ensure this file is included in Joomla!
defined('_JEXEC') or die();

jimport( 'joomla.application.component.modellist' );
require __DIR__ . '/sync.php';

class EventgalleryModelS3 extends JModelList
{
    private $s3;
    const ORIGINAL_ETAG = 'originaletag';

    public function __construct(array $config)
    {

        $this->s3 = EventgalleryLibraryCommonS3client::getInstance();
        parent::__construct($config);
    }

    /*
    *  returns an array containing the foldernames
     * @return array
    */
    public function getFolders() {
        $db = JFactory::getDbo();
        $query = $db->getQuery(true);
        $query->select('folder')
            ->from('#__eventgallery_folder')
            ->where('foldertypeid=3');
        $db->setQuery($query);
        $result = $db->loadColumn(0);

        return $result;
    }

    /**
     * get all filenames which need new thumbnails
     *
     * @param $foldername
     * @return array
     */
    public function getFilesToSync($foldername, $saveETagOfThumbnailsToDatabase = false) {
        /**
         * @var EventgalleryLibraryFactoryFolder $folderFactory
         * @var EventgalleryLibraryFolderS3 $folder
         */
        $folderFactory = EventgalleryLibraryFactoryFolder::getInstance();
        $folder = $folderFactory->getFolder($foldername);
        return $folder->getFilesToSync($saveETagOfThumbnailsToDatabase);

    }

    /**
     * create a thumbnail for the given file
     *
     * @param $folder
     * @param $file
     * @return array
     */
    public function createThumbnails($folder, $file) {

        /**
         * @var EventgalleryLibraryFactoryFile $fileFactory
         * @var EventgalleryLibraryFileS3 $fileObject
         */
        $fileFactory = EventgalleryLibraryFactoryFile::getInstance();
        $fileObject = $fileFactory->getFile($folder, $file);
        return $fileObject->createThumbnails();
    }
}
