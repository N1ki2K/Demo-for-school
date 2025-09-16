<?php
/**
 * @package     Sven.Bluege
 * @subpackage  com_eventgallery
 *
 * @copyright   Copyright (C) 2005 - 2013 Sven Bluege All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */
defined('_JEXEC') or die;
require_once JPATH_ROOT.'/components/com_eventgallery/config.php';

class EventgalleryHelpersSizeset
{

    public $availableSizes
        = Array(
            48, 104, 160, 288, 320, 400, 512, 640, 720, 800, 1024, 1280, 1440, COM_EVENTGALLERY_IMAGE_ORIGINAL_MAX_WIDTH
        );

    public function getMatchingSize($size)
    {
        $finalSize = $this->availableSizes[count($this->availableSizes) - 1];
        foreach ($this->availableSizes as $option) {
            if ($option >= $size) {
                return $option;
            }
        }
        return $finalSize;
    }
}
