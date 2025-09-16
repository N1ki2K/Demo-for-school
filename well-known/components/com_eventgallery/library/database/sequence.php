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
 * Class EventgalleryLibraryDatabaseSequence
 *
 * handles a sequence
 */

class EventgalleryLibraryDatabaseSequence
{
    public static function generateNewId() {
        $db = JFactory::getDbo();
        $query = $db->getQuery(true);
        $query->insert("#__eventgallery_sequence");
        $query->columns('value');
        $query->values('0');
        $db->setQuery($query);
        $db->execute();
        return $db->insertid();
    }

}
