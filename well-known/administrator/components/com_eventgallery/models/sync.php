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

class EventgalleryModelSync extends JModelList
{

    /**
     * adds new folders to the databases
     * @return array with EventgalleryLibraryFolderAddresult object
     */
    public function findNewFolders() {
        /**
         * @var EventgalleryLibraryManagerFolder $folderMgr
         */
        $folderMgr = EventgalleryLibraryManagerFolder::getInstance();
        return $folderMgr->findNewFolders();

    }

    /*
    * returns the folders
    */
    public function getFolders() {
        $db = JFactory::getDbo();
        $query = $db->getQuery(true);
        $query->select('folder')
            ->from('#__eventgallery_folder')
            ->where('foldertypeid=0 OR foldertypeid=3')
            ->order('ordering desc');
        $db->setQuery($query);
        $result = $db->loadColumn(0);

        return $result;
    }

    public function syncFile($folder, $file) {
        /**
         * @var EventgalleryLibraryFactoryFile $fileFactory
         * @var EventgalleryLibraryFile $fileObject
         */
        $fileFactory = EventgalleryLibraryFactoryFile::getInstance();
        $fileObject = $fileFactory->getFile($folder, $file);
        $syncResult = $fileObject->syncFile();

        $result = "";
        if ($syncResult == EventgalleryLibraryManagerFolder::$SYNC_STATUS_NOSYNC) {
            $result = "nosync";
        }

        if ($syncResult == EventgalleryLibraryManagerFolder::$SYNC_STATUS_SYNC)  {
            $result = "sync";
        }

        if ($syncResult == EventgalleryLibraryManagerFolder::$SYNC_STATUS_DELTED)  {
            $result = "deleted";
        }

        return $result;
    }

    /*
    * syncs a folder and returns the status
    */
    public function syncFolder($folder, $foldertype, $use_htacces_to_protect_original_files) {

        /**
         * @var EventgalleryLibraryFactoryFolder $folderFactory
         * @var EventgalleryLibraryFolder $folderClass
         */
        $folderFactory = EventgalleryLibraryFactoryFolder::getInstance();
        $folderObject = $folderFactory->getFolder($folder);

        if ($folderObject == null) {
            /**
             * @var $folderMgr EventgalleryLibraryManagerFolder
             */
            $folderMgr = EventgalleryLibraryManagerFolder::getInstance();
            $folderMgr->addNewFolder($folder, $foldertype);
            $folderObject = $folderFactory->getFolder($folder);
        }

        $folderClass = $folderObject->getFolderType()->getFolderHandlerClassname();
        $syncResult = $folderClass::syncFolder($folder, $use_htacces_to_protect_original_files);


        $result = ["status"=>"", "files" => isset($syncResult['files'])?$syncResult['files']:array()];

        if ($syncResult['status'] == EventgalleryLibraryManagerFolder::$SYNC_STATUS_NOSYNC) {
            $result['status'] = "nosync";
        }

        if ($syncResult['status'] == EventgalleryLibraryManagerFolder::$SYNC_STATUS_SYNC)  {
            $result['status'] = "sync";
        }

        if ($syncResult['status'] == EventgalleryLibraryManagerFolder::$SYNC_STATUS_DELTED)  {
            $result['status'] = "deleted";
        }

        return $result;
    }
}
