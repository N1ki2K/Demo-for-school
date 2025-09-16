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
 * Base class for Managers implementing the Singleton pattern
 *
 * Class EventgalleryLibraryManagerManager
 */
class EventgalleryLibraryManagerManager
{

    /**
     * @var array
     */
    private static $_instances = array();

    /**
     * @return EventgalleryLibraryManagerManager
     */
    final public static function getInstance() {


        $calledClassName = get_called_class();

        if (! isset (self::$_instances[$calledClassName])) {
            self::$_instances[$calledClassName] = new $calledClassName();
        }

        return self::$_instances[$calledClassName];
    }

    /**
     * resets the cached instances. this method is necessary to run multiple unit tests
     */
    final public static function clear() {
        self::$_instances = array();
    }
}
