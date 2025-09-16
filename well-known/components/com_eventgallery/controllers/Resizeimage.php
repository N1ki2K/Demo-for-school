<?php
/**
 * @package     Sven.Bluege
 * @subpackage  com_eventgallery
 *
 * @copyright   Copyright (C) 2005 - 2013 Sven Bluege All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */
defined('_JEXEC') or die;

jimport('joomla.application.component.view');
require_once JPATH_ROOT.'/components/com_eventgallery/config.php';

class EventgalleryControllerResizeimage extends JControllerLegacy {

    public function display($cachable = false, $urlparams = array()) {
        $file = $this->input->getString('file');
        $folder = $this->input->getString('folder');

        $width = $this->input->getInt('width', -1);

        $mode = $this->input->getString('mode', 'nocrop');

        /**
         * @var EventgalleryLibraryFactoryFile $fileFactory
         */
        $fileFactory = EventgalleryLibraryFactoryFile::getInstance();
        $fileObj = $fileFactory->getFile($folder, $file);
        $folderObj = $fileObj->getFolder();

        $user = JFactory::getUser();
        if (!$user->authorise('core.manage', 'com_eventgallery')){
            if (!$fileObj->isMainImage()) {
                if (!$folderObj->isVisible() || !$folderObj->isAccessible()) {
                    $url = JUri::root().'' . COM_EVENTGALLERY_IMAGE_NO_ACCESS;
                    header("HTTP/1.1 302 Found");
                    header("Location: $url");
                    header('Content-Type: text/plain');
                    header('Connection: close');
                    flush();
                    die();
                }
            }
        }


        $this->renderThumbnail($folder, $file, $width, $mode);
    }


    /**
     * This method calculates the image and delivers it to the client.
     *
     * @param $folder
     * @param $file
     * @param $width
     * @param $height
     * @param $mode
     * @param $doFindMatingSize defined if we try to find a size in the list of possible images sized
     * @param $doCache
     * @param $doWatermarking
     * @param $doSharping
     *
     */
    public function renderThumbnail($folder, $file, $width = -1, $mode = 'nocrop', $doFindMatingSize = true, $doCache = true, $doWatermarking = true, $doSharping = true) {
        /**
         * @var JApplicationSite $app
         */
        $app = JFactory::getApplication();
        $params = JComponentHelper::getParams('com_eventgallery');

        $image_thumb_file = EventgalleryLibraryCommonImageprocessor::calculateCacheThumbnailName($width, $mode, $doFindMatingSize, $file, $folder);
        //$last_modified = gmdate('D, d M Y H:i:s T', filemtime ($image_file));
        $last_modified = gmdate('D, d M Y H:i:s T', mktime(0, 0, 0, 1, 1, 2100));
        #echo "<br>".$image_thumb_file."<br>";

        $debug = false;

        if ($debug || !file_exists($image_thumb_file)) {

            /**
             * @var EventgalleryLibraryFactoryFolder $folderFactory
             * @var EventgalleryLibraryFolder $folder
             */
            $folderFactory = EventgalleryLibraryFactoryFolder::getInstance();
            $folderObject = $folderFactory->getFolder($folder);
            $watermark = $folderObject->getWatermark();
            // load default watermark
            if (null == $watermark || !$watermark->isPublished()) {
                /**
                 * @var EventgalleryLibraryFactoryWatermark $watermarkFactory
                 * @var EventgalleryLibraryWatermark $watermark
                 */
                $watermarkFactory = EventgalleryLibraryFactoryWatermark::getInstance();
                $watermark = $watermarkFactory->getDefaultWatermark();
            }

            $image_file = COM_EVENTGALLERY_IMAGE_FOLDER_PATH . $folder . DIRECTORY_SEPARATOR . $file;

            $imageProcessor = new EventgalleryLibraryCommonImageprocessor();
            $imageProcessor->loadImage($image_file);
            $imageProcessor->setTargetImageSize($width, -1, $mode, $doFindMatingSize);
            $imageProcessor->processImage(
                $params->get('use_autorotate', 1)==1,
                $doWatermarking,
                $watermark,
                $doSharping && $params->get('use_sharpening',1),
                $params->get('use_sharpening_for_originalsize', 1) == 1,
                $params->get('image_sharpenMatrix','[[-1,-1,-1],[-1,16,-1],[-1,-1,-1]]')
            );
            $imageProcessor->saveThumbnail($image_thumb_file, $params->get('image_quality',85));
            $imageProcessor->copyICCProfile($image_file, $image_thumb_file);
        }

        $mime = ($mime = getimagesize($image_thumb_file)) ? $mime['mime'] : $mime;
        $size = filesize($image_thumb_file);
        $fp   = fopen($image_thumb_file, "rb");
        if (!($mime && $size && $fp)) {
            die("Error: can't read file from cache. Make sure permissions are set correctly for the cache folder.");
        }

        //if (!$debug) {
        header("Content-Type: " . $mime);
        header("Content-Length: " . $size);
        header("Last-Modified: $last_modified");
        //}

        fpassthru($fp);

        fclose($fp);
        if (!$doCache) {
            unlink($image_thumb_file);
        }

        die();
    }


    
    


}


