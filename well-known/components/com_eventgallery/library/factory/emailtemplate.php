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

class EventgalleryLibraryFactoryEmailtemplate extends EventgalleryLibraryFactoryFactory
{
    /**
     * Determines an email template by ID
     *
     * @param $id
     * @return EventgalleryLibraryEmailtemplate
     */
    public function getEmailtemplateById($id) {

        $db = $this->db;
        $query = $db->getQuery(true);

        $query->select('*');
        $query->from('#__eventgallery_emailtemplate');
        $query->where('id=' . $db->quote($id));

        $db->setQuery($query);
        $dbobject = $db->loadObject();

        return new EventgalleryLibraryEmailtemplate($dbobject);
    }

    /**
     * Searches a emailtemplate by key
     *
     * @param $key
     * @param string $languagetag
     * @param bool $publishedOnly
     * @return EventgalleryLibraryEmailtemplate|null
     */
    public function getEmailtemplateByKey($key, $languagetag = '*', $publishedOnly = true) {
        $db = $this->db;
        $query = $db->getQuery(true);

        $query->select('*');
        $query->from('#__eventgallery_emailtemplate');
        $query->where($db->quoteName('key').'=' . $db->quote($key));
        $query->where('language=' . $db->quote($languagetag));
        if ($publishedOnly) {
            $query->where('published=1');
        }
        $query->order('ordering');

        $db->setQuery($query);
        $element = $db->loadObject();

        if ($element == null) {
            // start searching for the global language fallback
            if ($languagetag != '*') {
                return $this->getEmailtemplateByKey($key, '*', $publishedOnly);
            }
            return null;
        }

        return new EventgalleryLibraryEmailtemplate($element);
    }


}