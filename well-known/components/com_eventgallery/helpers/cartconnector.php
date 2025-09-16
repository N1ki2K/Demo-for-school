<?php
/**
 * @package     Sven.Bluege
 * @subpackage  com_eventgallery
 *
 * @copyright   Copyright (C) 2005 - 2013 Sven Bluege All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */
defined('_JEXEC') or die;

/**
 * transforms a link pattern into a real link.
 */
class EventgalleryHelpersCartconnector
{

    public static function getLink($folder, $file)
    {
        /**
         * @var JSite $app
         */
        $app = JFactory::getApplication();
        $params = $app->getParams();

        $linkPattern = $params->get('cart_connector_link', '');

        $dotPos = strrpos($file, '.');
        $fileBase = $file;
        // if there is a dot and the dot has at least 4 trailing chars like .jpeg or .jpg but not foo.bar_picasa_image
        if ($dotPos > 0 && strlen($file) - $dotPos < 6) {
            $fileBase = substr($file, 0, $dotPos);
        }

        $linkPattern = str_replace('${folder}', $folder, $linkPattern);
        $linkPattern = str_replace('${file}', $file, $linkPattern);
        $linkPattern = str_replace('${fileBase}', $fileBase, $linkPattern);

        return $linkPattern;
    }
}
