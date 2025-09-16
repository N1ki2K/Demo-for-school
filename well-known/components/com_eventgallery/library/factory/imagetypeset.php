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

class EventgalleryLibraryFactoryImagetypeset extends EventgalleryLibraryFactoryFactory
{
    /**
     * Determines a Image Type Set by ID
     *
     * @param int $id
     * @return EventgalleryLibraryImagetypeset
     */
    public function getImagetypesetById($id = -1) {

        $db = $this->db;
        $query = $db->getQuery(true);

        $query->select('its.*');
        $query->from('#__eventgallery_imagetypeset as its');
        if ($id != -1) {
            $query->where('its.id=' . $db->quote($id));
        }
        $query->order('its.default DESC');
        $db->setQuery($query);

        return new EventgalleryLibraryImagetypeset($db->loadObject());
    }

    /**
     * Determine the image types associated with the given image type set id.
     *
     * @param $id
     * @param bool $publishedOnly
     * @return array
     */
    public function getImagetypes($id, $publishedOnly = false) {

        /**
         * @var EventgalleryLibraryFactoryImagetype $imagetypeMgr
         */
        $imagetypeMgr = EventgalleryLibraryFactoryImagetype::getInstance();

        $db = $this->db;
        $query = $db->getQuery(true);

        $query->select('t.*');
        $query->from(
            '#__eventgallery_imagetypeset_imagetype_assignment tsta left join #__eventgallery_imagetype t on tsta.imagetypeid=t.id'
        );
        $query->where('tsta.imagetypesetid=' . $db->quote($id));
        if ($publishedOnly) {
            $query->where('published=1');
        }

        $query->order('tsta.ordering');
        $db->setQuery($query);
        $dbtypes = $db->loadObjectList();
        $types = array();

        foreach ($dbtypes as $dbtype) {
            $types[$dbtype->id] = $imagetypeMgr->getImagetypeById($dbtype->id);
        }

        return $types;
    }

    public function getDefaultImagetype($id) {

        /**
         * @var EventgalleryLibraryFactoryImagetype $imagetypeMgr
         */
        $imagetypeMgr = EventgalleryLibraryFactoryImagetype::getInstance();

        $db = $this->db;
        $query = $db->getQuery(true);

        $query->select('t.*, tsta.default as defaultimagetype');
        $query->from(
            '#__eventgallery_imagetypeset_imagetype_assignment tsta left join #__eventgallery_imagetype t on tsta.imagetypeid=t.id'
        );
        $query->where('tsta.imagetypesetid=' . $db->quote($id));
        $query->order('tsta.ordering');
        $db->setQuery($query);
        $dbtypes = $db->loadObjectList();


        foreach ($dbtypes as $dbtype) {
            if ($dbtype->defaultimagetype==1) {
                return $imagetypeMgr->getImagetypeById($dbtype->id);
            }
        }

        if (isset($dbtypes[0])) {
            return $imagetypeMgr->getImagetypeById($dbtypes[0]->id);
        }

        return null;
    }

    protected $_imagetypesets;
    protected $_imagetypesets_published;


    /**
     * Return all imagetypesets
     *
     * @param $publishedOnly
     * @return array
     */
    public function getImageTypeSets($publishedOnly) {
        if ($this->_imagetypesets == null) {

            $db = $this->db;
            $query = $db->getQuery(true);
            $query->select('*');
            $query->from('#__eventgallery_imagetypeset');
            $query->order($db->quoteName('default') . ' DESC');
            $query->order('ordering');
            $db->setQuery($query);
            $items = $db->loadObjectList();

            $this->_imagetypesets = array();
            $this->_imagetypesets_published = array();

            foreach ($items as $item) {
                /**
                 * @var EventgalleryLibraryImagetypeset $itemObject
                 */
                $itemObject = new EventgalleryLibraryImagetypeset($item);
                if ($itemObject->isPublished()) {
                    $this->_imagetypesets_published[$itemObject->getId()] = $itemObject;
                }
                $this->_imagetypesets[$itemObject->getId()] = $itemObject;
            }
        }
        if ($publishedOnly) {
            return $this->_imagetypesets_published;
        } else {
            return $this->_imagetypesets;
        }
    }

    /**
     * Returns the default image type set
     *
     * @param bool $publishedOnly returns only  published imagetypeset
     * @return EventgalleryLibraryImagetypeset
     */
    public function getDefaultImageTypeSet($publishedOnly) {
        $sets = array_values($this->getImageTypeSets($publishedOnly));
        if (isset($sets[0])) {
            return $sets[0];
        }
        return null;

    }


    public function getImageTypeSet($id) {
        $sets = $this->getImageTypeSets(false);
        if (isset($sets[$id]))
        {
            return $sets[$id];
        }
        return $this->getDefaultImageTypeSet(true);
    }
}


