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

class EventgalleryLibraryCommonSecurity
{
    /**
     * write content to a given path and filename
     *
     * @param string $path
     * @param string $filename
     * @param $content
     */
    private static function writeToFile($path, $filename, $content) {
        if ($path[strlen($path)-1] == DIRECTORY_SEPARATOR) {
            $path = substr($path, 0, strlen($path)-1);
        }

        $filepath = $path . DIRECTORY_SEPARATOR . $filename;

        JFile::write($filepath , $content);
    }

    /**
     * add the necessary protection files for a folder to prevent direct access through the web server
     *
     * @param string $path
     */
    public static function protectFolder($path) {
        self::writeToFile($path, '.htaccess', COM_EVENTGALLERY_IMAGE_PROTECTION_HTACCESS);
        self::writeToFile($path, 'web.config', COM_EVENTGALLERY_IMAGE_PROTECTION_WEB_CONFIG);
    }

    /**
     * write the index.html file for the given folder.
     *
     * @param $path
     */
    public static function writeIndexHtmlFile($path) {
        self::writeToFile($path, 'index.html', COM_EVENTGALLERY_IMAGE_PROTECTION_INDEX_HTML);
    }

    /**
     * checks if the file is a file which is used to protect a folder. Example: .htaccess or index.html
     *
     * @param string $filename
     * @return bool
     */
    public static function isProtectionFile($filename) {

        if ($filename == '.htaccess' || $filename == 'web.config' || $filename == 'index.html') {
            return true;
        }

        return false;
    }
}
