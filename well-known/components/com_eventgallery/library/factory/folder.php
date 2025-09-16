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

class EventgalleryLibraryFactoryFolder extends EventgalleryLibraryFactoryFactory
{
    protected $_folders;
    protected $_commentCount = NULL;
    protected $_allFolderDatabaseObject = NULL;

    /**
     * Returns a folder
     *
     * @param $foldername string|object
     * @return EventgalleryLibraryFolder
     */
    public function getFolder($foldername) {

        if (null == $foldername) {
            return null;
        }

        if (!is_string($foldername)) {
            throw new InvalidArgumentException("can get a folder by String only.");
        }

        return $this->getFolderFromDatabaseObject($foldername);
    }



    public function getAllFolders() {
        $allFolders = $this->getAllFoldersFromDatabase();
        foreach($allFolders as $folder) {
            $this->getFolderFromDatabaseObject($folder->folder);
        }
        return $this->_folders;
    }

    protected function getFolderFromDatabaseObject($foldername) {
        $allFolders = $this->getAllFoldersFromDatabase();


        if (!isset($this->_folders[$foldername])) {

            $databaseFolder = null;

            if (isset($allFolders[$foldername])) {
                $databaseFolder = $allFolders[$foldername];
            }

            if (isset($databaseFolder->folderhandlerclassname)) {
                $folderClass = $databaseFolder->folderhandlerclassname;
                /**
                 * @var EventgalleryLibraryFolder $folderClass
                 * */
                $this->_folders[$foldername] = new $folderClass($databaseFolder);
            } else {
                $this->_folders[$foldername] = null;
            }

        }

        return $this->_folders[$foldername];
    }

    protected function getAllFoldersFromDatabase() {
        if (NULL === $this->_allFolderDatabaseObject) {
            $db = JFactory::getDbo();
            $query = $db->getQuery(true);
            $query->select('f.*, ft.folderhandlerclassname');
            $query->from('#__eventgallery_folder f, #__eventgallery_foldertype ft');
            $query->where('f.foldertypeid=ft.id');

            $db->setQuery($query);
            $result = $db->loadObjectList();

            $this->_allFolderDatabaseObject = array();
            foreach($result as $databaseFolder) {
                $this->_allFolderDatabaseObject[$databaseFolder->folder] = $databaseFolder;
            }
        }

        return $this->_allFolderDatabaseObject;
    }


    public function getCommentCount($foldername)
    {
        if (!isset($this->_commentCount))
        {
            $db = JFactory::getDbo();
            $query = $db->getQuery(true)
                ->select('folder, count(1) AS '.$db->quoteName('commentCount'))
                ->from($db->quoteName('#__eventgallery_comment'))
                ->where('published=1')
                ->group('folder');
            $db->setQuery($query);
            $comments = $db->loadObjectList();
            $this->_commentCount = array();
            foreach($comments as $comment)
            {
                $this->_commentCount[$comment->folder] = $comment->commentCount;
            }
        }

        if (isset($this->_commentCount[$foldername])) {
            return $this->_commentCount[$foldername];
        }

        return 0;
    }

    public static function clear() {

        /**
         * @var EventgalleryLibraryFactoryFolder $folderFactory
         */
        $folderFactory = self::getInstance();
        $folderFactory->_folders = null;
        $folderFactory->_commentCount = null;
        $folderFactory->_allFolderDatabaseObject = null;


        parent::clear();
    }
}