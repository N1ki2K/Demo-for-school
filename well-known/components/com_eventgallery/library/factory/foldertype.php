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

class EventgalleryLibraryFactoryFoldertype extends EventgalleryLibraryFactoryFactory
{



    protected $_foldertype;
    protected $_foldertype_published;


    /**
     * Return all folder types
     *
     * @param $publishedOnly
     * @return array
     */
    public function getFolderTypes($publishedOnly) {
        if ($this->_foldertype == null) {

            $db = $this->db;
            $query = $db->getQuery(true);
            $query->select('*');
            $query->from('#__eventgallery_foldertype');
            $query->order($db->quoteName('default') . ' DESC');
            $query->order('ordering');
            $db->setQuery($query);
            $items = $db->loadObjectList();

            $this->_foldertype = array();
            $this->_foldertype_published = array();

            foreach ($items as $item) {
                /**
                 * @var EventgalleryLibraryFoldertype $itemObject
                 */
                $itemObject = new EventgalleryLibraryFoldertype($item);
                if ($itemObject->isPublished()) {
                    $this->_foldertype_published[$itemObject->getId()] = $itemObject;
                }
                $this->_foldertype[$itemObject->getId()] = $itemObject;
            }
        }
        if ($publishedOnly) {
            return $this->_foldertype_published;
        } else {
            return $this->_foldertype;
        }
    }

    /**
     * Returns the default folder type
     *
     * @param bool $publishedOnly returns only published folder type
     * @return EventgalleryLibraryFoldertype
     */
    public function getDefaultFolderType($publishedOnly) {
        $sets = array_values($this->getFolderTypes($publishedOnly));
        if (isset($sets[0])) {
            return $sets[0];
        }
        return null;

    }

    /**
     * Determines a Folder Type by a given ID
     *
     * @param $id
     * @return EventgalleryLibraryFoldertype
     */
    public function getFolderTypeById($id)
    {
        $sets = $this->getFolderTypes(false);
        if (isset($sets[$id]))
        {
            return $sets[$id];
        }
        return $this->getDefaultFolderType(true);

    }
}