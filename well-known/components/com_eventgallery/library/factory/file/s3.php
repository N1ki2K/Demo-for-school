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

class EventgalleryLibraryFactoryFileS3 extends EventgalleryLibraryFactoryFileLocal
{

    protected $_folders = Array();

    /**
     * Returns a file
     *
     * @param $foldername string
     * @param $filename string
     * @return EventgalleryLibraryFileS3
     */
    public function getFile($foldername, $filename) {

        return new EventgalleryLibraryFileS3($this->getFileDBData($foldername, $filename));

    }


}