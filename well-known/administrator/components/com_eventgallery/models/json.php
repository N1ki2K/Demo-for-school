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


/** @noinspection PhpUndefinedClassInspection */
class EventgalleryModelJson extends JModelLegacy
{

    /**
     * loads all folders we have and returns them as EventgalleryLibraryFactoryFolder in an array
     *
     * @return array
     */
    function getFolders() {
        $db = JFactory::getDbo();
        $query = $db->getQuery(true);
        $query->select('folder')->from('#__eventgallery_folder');
        $db->setQuery($query);
        $rows = $db->loadObjectList();
        $folders = [];

        /**
         * @var EventgalleryLibraryFactoryFolder $folderFactory
         */
        $folderFactory = EventgalleryLibraryFactoryFolder::getInstance();
        foreach($rows as $row) {
            $folders[] = $folderFactory->getFolder($row->folder);
        }
        return $folders;
    }

    /**
     * loads all files of an event and returns them as EventgalleryLibraryFactoryFile in an array
     *
     * @return array
     */
    function getFiles($foldername) {
        $db = JFactory::getDbo();
        $query = $db->getQuery(true);
        $query->select('folder, file')->from('#__eventgallery_file')->where('folder='.$db->quote($foldername));
        $db->setQuery($query);
        $rows = $db->loadObjectList();
        $files = [];

        /**
         * @var EventgalleryLibraryFactoryFile $fileFactory
         */
        $fileFactory = EventgalleryLibraryFactoryFile::getInstance();
        foreach($rows as $row) {
            $files[] = $fileFactory->getFile($row->folder, $row->file);
        }
        return $files;
    }
}
