<?php

/**
 * @package     Sven.Bluege
 * @subpackage  com_eventgallery
 *
 * @copyright   Copyright (C) 2005 - 2013 Sven Bluege All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;



class EventgalleryHelpersMedialoader
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
        $app = JFactory::getApplication();

        //JHtml::_('behavior.framework', true);
        JHtml::_('behavior.formvalidation');

        $params = JComponentHelper::getParams('com_eventgallery');
        
        $doDebug = $params->get('debug',0)==1;
        $doManualDebug = $app->input->getString('debug', '') == 'true';
		$loadResponsiveCSS = $params->get('load_responsive_css', 0)==1;
		
        $CSSs = Array();
        $JSs = Array();

        JHtml::_('jquery.framework');

        $JSs[] = 'common/js/jquery/namespace.js';

        if ($loadResponsiveCSS === true) {
            $CSSs[] = 'frontend/dist/responsive.css';
        }

        // load script and styles in debug mode or compressed
        if ($doDebug || $doManualDebug) {

            $CSSs[] = 'frontend/dist/eventgallery-debug.css';
            if ($loadResponsiveCSS === true) {
                $CSSs[] = 'frontend/dist/responsive-debug.css';
            }
            $JSs[] = 'frontend/dist/eventgallery-debug.js';

        } else {
            $CSSs[] = 'frontend/dist/eventgallery.css';
            if ($loadResponsiveCSS === true) {
                $CSSs[] = 'frontend/dist/responsive.css';
            }
            $JSs[] = 'frontend/dist/eventgallery.js';
        }

        foreach($CSSs as $css) {
            $script = JUri::root(true) . '/media/com_eventgallery/'.$css.'?v=' . EVENTGALLERY_VERSION;
            $document->addStyleSheet($script);
        }

        foreach($JSs as $js) {
            $script = JUri::root(true) . '/media/com_eventgallery/'.$js.'?v=' . EVENTGALLERY_VERSION;
            $document->addScript($script);
        }


        /*
         * Let's add a global configuration object for the color box slideshow.
         */
        $slideshowConfiguration = Array();

        $slideshowConfiguration['slideshow']      = $params->get('use_lightbox_slideshow', 0) == 1 ? true : false;
        $slideshowConfiguration['slideshowAuto']  = $params->get('use_lightbox_slideshow_autoplay', 0) == 1 ? true : false;
		$slideshowConfiguration['slideshowSpeed'] = $params->get('lightbox_slideshow_speed', 3000);
		$slideshowConfiguration['slideshowStart'] = JText::_('COM_EVENTGALLERY_LIGHTBOX_SLIDESHOW_START');
		$slideshowConfiguration['slideshowStop']  = JText::_('COM_EVENTGALLERY_LIGHTBOX_SLIDESHOW_STOP');
        $slideshowConfiguration['slideshowCurrent']  = JText::_('COM_EVENTGALLERY_LIGHTBOX_SLIDESHOW_CURRENT');
        $slideshowConfiguration['slideshowRightClickProtection']  = $params->get('lightbox_prevent_right_click', 0) == 1 ? true : false;

        $document->addScriptDeclaration("EventGallerySlideShowConfiguration=" . json_encode($slideshowConfiguration) . ";");

        $lightboxConfiguration = Array();
        $lightboxConfiguration['navigationFadeDelay'] = $params->get('lightbox_navgation_fade_delay', 0);
        $lightboxConfiguration['isSwipeSupportEnabled'] = $params->get('lightbox_enable_swipe', 1) == 1 ? true : false;
        $document->addScriptDeclaration("EventGalleryLightboxConfiguration=" . json_encode($lightboxConfiguration) . ";");

        $cartConfiguration = Array();
        $cartConfiguration['add2carturl'] = JRoute::_('index.php?option=com_eventgallery&view=singleimage&layout=imagesetselection&format=raw', false);
        $document->addScriptDeclaration("EventGalleryCartConfiguration=" . json_encode($cartConfiguration) . ";");
    }

}

	
	
