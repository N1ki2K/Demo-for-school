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

/**
 * Simple Class so store the result if we try to add the folder to the database.
 *
 * Class EventgalleryLibraryFolderAddresult
 */
class EventgalleryLibraryFolderAddresult
{
    /**
     * @var String
     */
    public $error;

    /**
     * @var String
     */
    public $foldername;

    /**
     * @var int
     */
    public $foldertype;

    /**
     * @return mixed
     */
    public function getFoldertype()
    {
        return $this->foldertype;
    }

    /**
     * @param mixed $foldertype
     */
    public function setFoldertype($foldertype)
    {
        $this->foldertype = $foldertype;
    }

    /**
     * @return String
     */
    public function getError()
    {
        return $this->error;
    }

    /**
     * @param String $error
     */
    public function setError($error)
    {
        $this->error = $error;
    }

    /**
     * @return String
     */
    public function getFolderName()
    {
        return $this->foldername;
    }

    /**
     * @param String $folder
     */
    public function setFolderName($foldername)
    {
        $this->foldername = $foldername;
    }
}