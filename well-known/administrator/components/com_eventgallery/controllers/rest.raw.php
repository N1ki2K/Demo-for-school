<?php
/**
 * @package     Sven.Bluege
 * @subpackage  com_eventgallery
 *
 * @copyright   Copyright (C) 2005 - 2013 Sven Bluege All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

jimport( 'joomla.application.component.controllerform' );

require_once(__DIR__.'/../controller.php');

class EventgalleryControllerRest extends JControllerForm
{


    public function __construct($config = array())
    {

        parent::__construct($config);
    }

    public function getModel($name = 'Rest', $prefix = 'EventgalleryModel', $config = array('ignore_request' => true))
    {
        $model = parent::getModel($name, $prefix, $config);
        return $model;
    }


    /**
     * returns all folders as JSON object
     *
     * @param bool $cachable
     * @param array $urlparams
     */
    public function folders($cachable = false, $urlparams = array())
    {
        $document = JFactory::getDocument();
        $document->setMimeEncoding('application/json');

        $data = [];

        /**
         * @var EventgalleryLibraryFactoryFolder $folderFactory
         */
        $folderFactory = EventgalleryLibraryFactoryFolder::getInstance();

        $folders = $folderFactory->getAllFolders();
        foreach($folders as $folder) {
            /**
             * @var EventgalleryLibraryFolder $folder
             */

            $data []= [
                "id"=>$folder->getId(),
                "folder"=>$folder->getFolderName(),
                "name"=>$folder->getDisplayName(),
                "published" => $folder->isPublished()];
        }

        echo json_encode($data, JSON_PRETTY_PRINT);
    }

    /**
     * returns all folders as JSON object
     *
     * @param bool $cachable
     * @param array $urlparams
     */
    public function files($cachable = false, $urlparams = array())
    {

        $app = JFactory::getApplication();
        $foldername = $app->input->getString('folder');
        if ($foldername == null) {
            return;
        }

        $document = JFactory::getDocument();
        $document->setMimeEncoding('application/json');

        $data = [];

        /**
         * @var EventgalleryLibraryFactoryFolder $folderFactory
         */
        $folderFactory = EventgalleryLibraryFactoryFolder::getInstance();


        /**
         * @var EventgalleryLibraryFolder $folder
         */
        $folder = $folderFactory->getFolder($foldername);
        if ($folder == null) {
            return;
        }

        foreach($folder->getFiles() as $file) {
            /**
             * @var EventgalleryLibraryFile $file
             */
            $data []= [
                "id"=>$file->getId(),
                "folder"=>$file->getFolderName(),
                "file"=>$file->getFileName(),
                "thumb"=>$file->getThumbUrl(250),
                "published" => $folder->isPublished(),
            ];
        }

        echo json_encode($data, JSON_PRETTY_PRINT);
    }
}
