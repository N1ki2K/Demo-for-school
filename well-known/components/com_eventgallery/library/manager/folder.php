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

class EventgalleryLibraryManagerFolder extends  EventgalleryLibraryManagerManager
{

    public static $SYNC_STATUS_NOSYNC = 0;
    public static $SYNC_STATUS_SYNC = 1;
    public static $SYNC_STATUS_DELTED = 2;

    private $_folders = null;

    /**
     * scans the main dir and adds new folders to the database
     * Does not add Files!
     *
     * @return array with EventgalleryLibraryFolderAddresult objects
     */
    public function findNewFolders() {

        $addResults = Array();

        /**
         * @var EventgalleryLibraryFactoryFoldertype $foldertypeFactory
         * @var EventgalleryLibraryFoldertype $folderType
         */
        $foldertypeFactory = EventgalleryLibraryFactoryFoldertype::getInstance();

        foreach($foldertypeFactory->getFolderTypes(true) as $folderType) {
            $folderClass = $folderType->getFolderHandlerClassname();
            /**
             * @var EventgalleryLibraryFolder $folderClass
             * */
            $addResults = array_merge($addResults, $folderClass::findNewFolders());
        }

        return $addResults;
    }

    public function addNewFolders() {
        $addResults = self::findNewFolders();
        foreach($addResults as $addResult) {
            /**
             * @var $addResult EventgalleryLibraryFolderAddresult
             */
            self::addNewFolder($addResult->foldername, $addResult->foldertype);
        }

        return $addResults;
    }

    public function addNewFolder($folder, $foldertype) {
        /**
         * @var EventgalleryLibraryFactoryFoldertype $foldertypeFactory
         * @var EventgalleryLibraryFoldertype $folderType
         */
        $foldertypeFactory = EventgalleryLibraryFactoryFoldertype::getInstance();

        foreach($foldertypeFactory->getFolderTypes(true) as $folderType) {
            $folderClass = $folderType->getFolderHandlerClassname();
            /**
             * @var EventgalleryLibraryFolder $folderClass
             * */
            if ($folderClass::ID == $foldertype) {
                $folderClass::addNewFolder($folder);
                /**
                 * @var $folderFactory EventgalleryLibraryFactoryFolder
                 */
                EventgalleryLibraryFactoryFolder::clear();
            }
        }


    }

    /**
     * transforms a foldername into its ID. Since the main id is the folder name we need this mapping.
     *
     * @param $foldername
     */
    public function getFolderId($foldername) {
        if (null == $this->_folders) {
            $db = JFactory::getDbo();

            $query = $db->getQuery(true);
            $query->select('id, folder')
                ->from('#__eventgallery_folder');

            $db->setQuery($query);
            $results = $db->loadObjectList();

            $this->_folders = array();

            foreach($results as $row) {
                $this->_folders[$row->folder] = $row->id;
            }
        }

        if (isset($this->_folders[$foldername])) {
            return $this->_folders[$foldername];
        }

        return null;

    }




}
