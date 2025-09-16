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

class EventgalleryLibraryFoldertype extends EventgalleryLibraryDatabaseObject
{
    /**
     * @var int
     */
    protected $_foldertype_id = NULL;

    /**
     * @var EventgalleryTableFoldertype
     */
    protected $_foldertype = NULL;

    /**
     * @param object object
     */
    public function __construct($object)
    {
        if (!is_object($object)) {
            throw new InvalidArgumentException("Can't initialize a Folder Type without an object");
        }

        $this->_foldertype = $object;
        $this->_foldertype_id = $object->id;

        parent::__construct();
    }

    /**
     * @return int
     */
    public function getId() {
        return $this->_foldertype->id;
    }

    /**
     * @return bool
     */
    public function isPublished() {
        return $this->_foldertype->published==1;
    }

    /**
     * @return bool
     */
    public function isDefault() {
        return $this->_foldertype->default==1;
    }

    /**
     * @return string
     */
    public function getName() {
        return $this->_foldertype->name;
    }

    /**
     * @return string
     */
    public function getDisplayName() {
        return $this->_foldertype->displayname;
    }

    /**
    * @return string the name of the class to handle this kind of folders
    */
    public function getFolderHandlerClassname() {
        return $this->_foldertype->folderhandlerclassname;
    }

}
