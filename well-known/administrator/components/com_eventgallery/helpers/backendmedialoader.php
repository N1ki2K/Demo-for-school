<?php

/**
 * @package     Sven.Bluege
 * @subpackage  com_eventgallery
 *
 * @copyright   Copyright (C) 2005 - 2013 Sven Bluege All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

class EventgalleryHelpersBackendmedialoader
{

    static $loaded = false;

    public static function load()
    {

        if (self::$loaded) {
            return;
        }

        self::$loaded = true;

        include_once JPATH_ROOT . '/administrator/components/com_eventgallery/version.php';

        $document = JFactory::getDocument();
       
        JHtml::_('behavior.formvalidation');

        
        $CSSs = Array();
        $JSs = Array();

        JHtml::_('jquery.framework');

        $JSs[] = 'backend/js/vendor/async/async.min.js';
        $JSs[] = 'common/js/jquery/namespace.js';
        $JSs[] = 'common/js/EventgalleryTools.js';
        $JSs[] = 'backend/js/EventgalleryScalePriceEditor.js';
        $JSs[] = 'backend/js/EventgalleryPicasa.js';
        $JSs[] = 'backend/js/EventgalleryFileEdit.js';
        $JSs[] = 'backend/js/EventgalleryOrderEdit.js';
        $JSs[] = 'backend/js/EventgalleryBehavior.js';

        $CSSs[] = 'backend/css/eventgallery.css';

        $JSs = array_merge($JSs, Array(                
        ));

        foreach($CSSs as $css) {
            $script = JUri::root() . 'media/com_eventgallery/'.$css.'?v=' . EVENTGALLERY_VERSION;
            $document->addStyleSheet($script);
        }

        foreach($JSs as $js) {
            $script = JUri::root() . 'media/com_eventgallery/'.$js.'?v=' . EVENTGALLERY_VERSION;
            $document->addScript($script);
        }


    }

}

	
	
