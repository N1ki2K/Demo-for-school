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

class EventgalleryLibraryFactoryWatermark extends EventgalleryLibraryFactoryFactory
{
    protected $_watermarks;
    protected $_watermarks_published;
    protected $_default_watermark;

    /**
     * Determines a Watermark by ID
     *
     * @param $id
     * @return EventgalleryLibraryWatermark
     */
    public function getWatermarkById($id) {

        $sets = $this->getWatermarks(false);
        if (isset($sets[$id]))
        {
            return $sets[$id];
        }

        return null;
    }

    /**
     * Return all watermarks
     *
     * @param $publishedOnly
     * @return array
     */
    public function getWatermarks($publishedOnly) {

        if ($this->_watermarks == null) {

            $db = $this->db;
            $query = $db->getQuery(true);
            $query->select('*');
            $query->from('#__eventgallery_watermark');
            $query->order('ordering');
            $db->setQuery($query);
            $items = $db->loadObjectList();

            $this->_watermarks = array();
            $this->_watermarks_published = array();

            foreach ($items as $item) {
                /**
                 * @var EventgalleryLibraryWatermark $itemObject
                 */
                $itemObject = new EventgalleryLibraryWatermark($item);
                if ($itemObject->isPublished()) {
                    $this->_watermarks_published[$itemObject->getId()] = $itemObject;
                }
                $this->_watermarks[$itemObject->getId()] = $itemObject;
            }
        }
        if ($publishedOnly) {
            return $this->_watermarks_published;
        } else {
            return $this->_watermarks;
        }
    }

    /**
     * returns the default watermark. Might be unpublished
     *
     * @return EventgalleryLibraryWatermark|null
     */
    public function getDefaultWatermark()
    {
        if ($this->_default_watermark == null) {

            $db = $this->db;
            $query = $db->getQuery(true);
            $query->select('*');
            $query->from('#__eventgallery_watermark');
            $query->where($query->quoteName('default').'=1');
            $query->order('ordering');
            $db->setQuery($query);
            $items = $db->loadObjectList();

            if (count($items) == 0) {
                return NULL;
            }

            $item = $items[0];
            $this->_default_watermark = $this->getWatermarkById($item->id);

        }

        return $this->_default_watermark;
    }

}
