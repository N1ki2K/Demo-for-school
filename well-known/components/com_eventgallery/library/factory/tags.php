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

class EventgalleryLibraryFactoryTags extends EventgalleryLibraryFactoryFactory
{
    protected $_tags;

    /**
     * Searches and caches the tags for a folder
     *
     * @param $id
     * @return EventgalleryLibraryImagetype
     */
    public function getTagsForFolderId($id) {
        $tags = null;
        if (isset($this->_tags[$id])) {
            $tags = $this->_tags[$id];
        } else {
            $helperTags = new JHelperTags();
            $tags = $helperTags->getItemTags('com_eventgallery.event', $id);
            $this->_tags[$id] = $tags;
        }

        return $this->_tags[$id];
    }

    public static function clear() {

        /**
         * @var EventgalleryLibraryFactoryTags $tagsFactory
         */
        $tagsFactory = self::getInstance();
        $tagsFactory->_tags = null;

        parent::clear();
    }
}


