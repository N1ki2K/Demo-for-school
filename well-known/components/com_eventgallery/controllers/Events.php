<?php
/**
 * @package     Sven.Bluege
 * @subpackage  com_eventgallery
 *
 * @copyright   Copyright (C) 2005 - 2013 Sven Bluege All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */
defined('_JEXEC') or die;

class EventgalleryControllerEvents extends EventgalleryController
{
    
    public function display($cachable = false, $urlparams = array())
    {
        // the output is the same for all users in the same user group
        // people should use the progressive caching mode.
        $cachable = true;

        parent::display($cachable, $urlparams);
    }

}
