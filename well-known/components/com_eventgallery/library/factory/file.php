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

class EventgalleryLibraryFactoryFile extends EventgalleryLibraryFactoryFactory
{

    protected $_folders = Array();

    /**
     * Returns a file
     *
     * @param $foldername string
     * @param $filename string
     * @return EventgalleryLibraryFile
     */
    public function getFile($foldername, $filename) {

        if (!is_string($foldername) || !is_string($filename)) {
            throw new InvalidArgumentException("Can't create a file object with an object. Use plain Strings instead.");
        }

        if (!isset($this->_folders[$foldername][$filename])) {

            /**
             * @var EventgalleryLibraryFactoryFolder $folderFactory
             */
            $folderFactory = EventgalleryLibraryFactoryFolder::getInstance();
            $folder = $folderFactory->getFolder($foldername);

            if ($folder == null) {
                $this->_folders[$foldername][$filename] = null;
            } else {
                $fileFactory = $folder->getFileFactory();
                $this->_folders[$foldername][$filename] = $fileFactory->getFile($foldername, $filename);
            }

        }

        return $this->_folders[$foldername][$filename];
    }


}