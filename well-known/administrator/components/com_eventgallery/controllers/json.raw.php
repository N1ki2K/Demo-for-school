<?php
/**
 * @package     Sven.Bluege
 * @subpackage  com_eventgallery
 *
 * @copyright   Copyright (C) 2005 - 2013 Sven Bluege All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

// no direct access
defined('_JEXEC') or die('Restricted access');

jimport( 'joomla.application.component.controlleradmin' );

class EventgalleryControllerJson extends JControllerAdmin
{

     /**
     * Proxy for getModel.
     * @param string $name
     * @param string $prefix
     * @param array $config
     * @return object
     */
    public function getModel($name = 'Json', $prefix ='EventgalleryModel', $config = array('ignore_request' => true))
    {
        $model = parent::getModel($name, $prefix, $config);
        return $model;
    }

    public function getFiles() {
        $app = JFactory::getApplication();
        $foldername = $app->input->getString('folder');
        if ($foldername == null || $foldername == '') {
            return false;
        }

        /**
        * @var EventgalleryLibraryFile $file
        */
         $files = $this->getModel()->getFiles($foldername);

        $result = [];
        foreach($files as $file) {
            $result[] = [
                "folder" => $file->getFolderName(),
                "file" => $file->getFileName(),
                "displayname" => $file->getFileTitle(),
                "description" => $file->getFileCaption(),
                "published" => $file->isPublished(),
                "thumbnail" => $file->getThumbUrl(250)
            ];
        }

        echo json_encode($result);

        return true;
    }

    public function getEvents() {

        /**
        * @var EventgalleryLibraryFolder $folder
         */
        $folders = $this->getModel()->getFolders();

        $result = [];
        foreach($folders as $folder) {
            $result[] = [
                "folder" => $folder->getFolderName(),
                "displayname" => $folder->getDisplayName(),
                "description" => $folder->getText(),
                "published" => $folder->isPublished(),
                "passwordprotected" => strlen($folder->getPassword())>0,
                "usergroups" => $folder->getUserGroupIds(),
                "foldertype" => $folder->getFolderType()->getDisplayName()
            ];
        }

        echo json_encode($result);

        return true;
	}

}