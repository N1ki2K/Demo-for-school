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

jimport( 'joomla.application.component.modellist' );

class EventgalleryModelCache extends JModelList
{

    protected $folders;

    private function human_filesize($bytes, $decimals = 2) {
        $sz = 'BKMGTP';
        $factor = (int)floor((strlen($bytes) - 1) / 3);
        return sprintf("%.{$decimals}f", $bytes / pow(1024, $factor)) . @$sz[$factor];
    }


    private function countFilesInFolder($path) {
        $count = 0; 
        $size = 0;

        if (!file_exists($path)) {
            return Array("count" =>0, "size" => 0);
        }
    
        if (substr($path, -strlen(DIRECTORY_SEPARATOR)) !== DIRECTORY_SEPARATOR) {
            $path .= DIRECTORY_SEPARATOR;
        }

        if ($handle = opendir($path)) {
            while (($file = readdir($handle)) !== false){
                if (!in_array($file, array('.', '..')) && !is_dir($path.$file)) 
                    $count++;
                    $size += filesize($path.$file);
            }
        }
        
        return array("count" => $count, "size" => $this->human_filesize($size));
    }

    private function getFolderInformation($path) {

        $result = array(); 

        if (!file_exists($path)) {
            return $result;
        }

        $cdir = scandir($path); 

        foreach ($cdir as $key => $value) 
        { 
            if (!in_array($value,array(".",".."))) 
            { 
                if (is_dir($path . DIRECTORY_SEPARATOR . $value)) 
                { 
                    $result[$value] = $this->countFilesInFolder($path . DIRECTORY_SEPARATOR . $value); 
                } 
            } 
        } 

        return $result;
    }

    public function getFolders()
    {
        if (isset($this->folders)) {
            return $this->folders;
        }

        $folders = Array();
        
        $folders['images'] = $this->getFolderInformation(COM_EVENTGALLERY_IMAGE_CACHE_PATH);
        $folders['picasa'] = $this->countFilesInFolder(COM_EVENTGALLERY_PICASA_CACHE_PATH);
        $folders['flickr'] = $this->countFilesInFolder(COM_EVENTGALLERY_FLICKR_CACHE_PATH);
        $folders['general'] = $this->countFilesInFolder(COM_EVENTGALLERY_GENERAL_CACHE_PATH);

        $this->folders = $folders;

        return $this->folders;
    }

    public function clearImageCacheFolder($folder) {
        $this->rrmdir(COM_EVENTGALLERY_IMAGE_CACHE_PATH.DIRECTORY_SEPARATOR.$folder);
    }

    public function clearPicasaCacheFolder() {
        $this->rrmdir(COM_EVENTGALLERY_PICASA_CACHE_PATH);
    }

    public function clearFlickrCacheFolder() {
        $this->rrmdir(COM_EVENTGALLERY_FLICKR_CACHE_PATH);
    }

    public function clearGeneralCacheFolder() {
        $this->rrmdir(COM_EVENTGALLERY_GENERAL_CACHE_PATH);
    }


    function rrmdir($dir) {
        if (!file_exists($dir)) {
            return;
        }
        foreach(glob($dir . '/*') as $file) {
            if(is_dir($file))
                $this->rrmdir($file);
            else
                unlink($file);
        }
        rmdir($dir);
    }

}
