<?php
/**
 * @package     Sven.Bluege
 * @subpackage  com_eventgallery
 *
 * @copyright   Copyright (C) 2005 - 2013 Sven Bluege All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */
defined('_JEXEC') or die;

jimport( 'joomla.application.component.view');


class EventgalleryViewWatermarkpreview extends JViewLegacy
{

    function display($tpl=null)
    {
        $app = JFactory::getApplication();
        $mode = $app->input->getString('mode', 'landscape');
        if ($mode == 'landscape') {
            $image_file = JPATH_SITE . '/media/com_eventgallery/backend/img/watermark-small-landscape.jpg';
        } else {
            $image_file = JPATH_SITE . '/media/com_eventgallery/backend/img/watermark-small-portrait.jpg';
        }

        $im_original = imagecreatefromjpeg($image_file);

        /**
         * @var EventgalleryLibraryFactoryWatermark $watermarkFactory
         * @var EventgalleryLibraryWatermark $watermark
         */
        $watermarkFactory = EventgalleryLibraryFactoryWatermark::getInstance();

        $watermark = $watermarkFactory->getWatermarkById($app->input->getInt('id'));
        if (null != $watermark) {
            $watermark->addWatermark($im_original, true);
        }

        header("Content-Type: image/jpeg");

        imagejpeg($im_original);
        
        die();
    }
}
