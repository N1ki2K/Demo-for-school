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
require_once 'Resizeimage.php';

class EventgalleryControllerDownload extends EventgalleryControllerResizeimage
{
    public function display($cachable = false, $urlparams = array())
    {
        /**
         * @var JApplicationSite $app
         * @var \Joomla\Registry\Registry $registry
         */
        $app = JFactory::getApplication();
        $params = $app->getParams();
        $allowDownloadOfOriginalImage = $params->get('download_original_images', 0) == 1;

        $str_folder = $app->input->getString('folder', null);
        $str_file = $app->input->getString('file', null);
        $is_sharing_download = $app->input->getBool('is_for_sharing', false);

        /**
         * @var EventgalleryLibraryFactoryFile $fileFactory
         */
        $fileFactory = EventgalleryLibraryFactoryFile::getInstance();

        $file = $fileFactory->getFile($str_folder, $str_file);

        if (!is_object($file) || !$file->isPublished()) {
            throw new Exception(JText::_('COM_EVENTGALLERY_SINGLEIMAGE_NO_PUBLISHED_MESSAGE'), 404);
        }

        $folder = $file->getFolder();

        // Check of the user has the permission to grab the image
        if (!$folder->isPublished() || !$folder->isVisible()) {
            throw new Exception(JText::_('COM_EVENTGALLERY_EVENT_NO_PUBLISHED_MESSAGE'), 404);
        }

        // deny downloads if the social sharing option is disabled
        if (    $params->get('use_social_sharing_button', 0)==0  ) {
            $allowDownloadOfOriginalImage = false;
        } 
                
        // allow the download if at least one sharing type is enabled both global and for the event
        if (        
                ($params->get('use_social_sharing_facebook', 0)==1 && $folder->getAttribs()->get('use_social_sharing_facebook', 1)==1)
            ||  ($params->get('use_social_sharing_google', 0)==1 && $folder->getAttribs()->get('use_social_sharing_google', 1)==1)
            ||  ($params->get('use_social_sharing_twitter', 0)==1 && $folder->getAttribs()->get('use_social_sharing_twitter', 1)==1)
            ||  ($params->get('use_social_sharing_pinterest', 0)==1 && $folder->getAttribs()->get('use_social_sharing_pinterest', 1)==1)
            ||  ($params->get('use_social_sharing_email', 0)==1 && $folder->getAttribs()->get('use_social_sharing_email', 1)==1)
            ||  ($params->get('use_social_sharing_download', 0)==1 && $folder->getAttribs()->get('use_social_sharing_download', 1)==1)
            
            ) {
        	// nothing to do there since the sharing options are fine.
        } else {
            $allowDownloadOfOriginalImage = false;
        }





        if ($file->getFolder()->getFolderType()->getId() == EventgalleryLibraryFolderS3::ID) {
            $this->downloadS3Image($allowDownloadOfOriginalImage, $is_sharing_download, $file);
        } else {
            $this->downloadLocalImage($allowDownloadOfOriginalImage, $is_sharing_download, $file);
        }

    }

    /**
     * @param $allowDownloadOfOriginalImage
     * @param $is_sharing_download
     * @param EventgalleryLibraryFile $file
     */
    private function downloadLocalImage($allowDownloadOfOriginalImage, $is_sharing_download, $file) {

        $basename = COM_EVENTGALLERY_IMAGE_FOLDER_PATH . $file->getFolderName() . '/';

        if ( $allowDownloadOfOriginalImage ) {

            // try the path to a possible original file
            $filename = $basename. COM_EVENTGALLERY_IMAGE_ORIGINAL_SUBFOLDER .'/'.$file->getFileName();

            if (!file_exists($filename)) {
                $filename = $basename . $file->getFileName();
            }

            $mime = ($mime = getimagesize($filename)) ? $mime['mime'] : $mime;
            $size = filesize($filename);
            $fp   = fopen($filename, "rb");
            if (!($mime && $size && $fp)) {
                // Error.
                return;
            }


            header("Content-type: " . $mime);
            header("Content-Length: " . $size);
            if (!$is_sharing_download) {
                header("Content-Disposition: attachment; filename=" . $file->getFileName());
            }
            header('Content-Transfer-Encoding: binary');
            header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
            fpassthru($fp);
            fclose($fp);
            die();
        } else {
            if (!$is_sharing_download) {
                header("Content-Disposition: attachment; filename=" . $file->getFileName());
            }
            header('Content-Transfer-Encoding: binary');
            header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
            $this->renderThumbnail($file->getFolderName(), $file->getFileName(), COM_EVENTGALLERY_IMAGE_ORIGINAL_MAX_WIDTH);
            die();
        }
    }

    /**
     * @param $allowDownloadOfOriginalImage
     * @param $is_sharing_download
     * @param EventgalleryLibraryFileS3 $file
     */
    private function downloadS3Image($allowDownloadOfOriginalImage, $is_sharing_download, $file) {

        $basename = COM_EVENTGALLERY_IMAGE_FOLDER_PATH . $file->getFolderName() . '/';
        $s3client = EventgalleryLibraryCommonS3client::getInstance();

        $tempFileName =  tempnam('', '');

        if ( $allowDownloadOfOriginalImage ) {
            $s3client->getObjectToFile(
                $s3client->getBucketForOriginalImages(),
                $file->getFolderName() . "/" . $file->getFileName(),
                $tempFileName
            );
        } else {
            $s3client->getObjectToFile(
                $s3client->getBucketForThumbnails(),
                $file->calculateS3Key(COM_EVENTGALLERY_IMAGE_ORIGINAL_MAX_WIDTH),
                $tempFileName
            );
        }
            $mime = ($mime = getimagesize($tempFileName)) ? $mime['mime'] : $mime;
            $size = filesize($tempFileName);
            $fp   = fopen($tempFileName, "rb");
            if (!($mime && $size && $fp)) {
                // Error.
                return;
            }


            header("Content-type: " . $mime);
            header("Content-Length: " . $size);
            if (!$is_sharing_download) {
                header("Content-Disposition: attachment; filename=" . $file->getFileName());
            }
            header('Content-Transfer-Encoding: binary');
            header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
            if (!$is_sharing_download) {
                header("Content-Disposition: attachment; filename=" . $file->getFileName());
            }
            fpassthru($fp);
            fclose($fp);

        unlink($tempFileName);
        die();
    }

    /**
     * allow to download small thumbnails in case a user did a order
     *
     * @throws Exception
     */
    public function mailthumb() {
        $app = JFactory::getApplication();

        $str_orderid = $this->input->getString('orderid', null);
        $str_lineitemid = $this->input->getString('lineitemid', null);
        $str_token = $this->input->getString('token', null);


        /**
         * @var EventgalleryLibraryFactoryOrder $orderFactory
         */
        $orderFactory = EventgalleryLibraryFactoryOrder::getInstance();
        $order = $orderFactory->getOrderById($str_orderid);
        if ($order == null) {
            throw new Exception("Invalid Request.");
        }

        if ($order->getToken() != $str_token) {
            throw new Exception("Invalid Request.");
        }

        $lineitem = $order->getLineItem($str_lineitemid);
        if ($lineitem == null) {
            throw new Exception("Invalid Request.");
        }

        if (strcmp($str_token, $order->getToken())!=0) {
            throw new Exception("Invalid Request.");
        }

        $file = $lineitem->getFile();

        if ($file->getFolder()->getFolderType()->getId() == EventgalleryLibraryFolderLocal::ID) {
            $this->renderThumbnail($file->getFolderName(), $file->getFileName(), 104, false);
        } else {
            $app->redirect($file->getThumbUrl(104, 104));
        }
    }

    /**
     * This method is used to enable the download of files.
     *
     * @throws Exception
     */
    public function order() {

        $app = JFactory::getApplication();

        $str_orderid = $this->input->getString('orderid', null);
        $str_lineitemid = $this->input->getString('lineitemid', null);
        $str_token = $this->input->getString('token', null);


        /**
         * @var EventgalleryLibraryFactoryOrder $orderFactory
         */
        $orderFactory = EventgalleryLibraryFactoryOrder::getInstance();
        $order = $orderFactory->getOrderById($str_orderid);
        if ($order == null) {
            throw new Exception("Invalid Request.");
        }

        if ($order->getToken() != $str_token) {
            throw new Exception("Invalid Request.");
        }

        $lineitem = $order->getLineItem($str_lineitemid);
        if ($lineitem == null) {
            throw new Exception("Invalid Request.");
        }

        if (strcmp($str_token, $order->getToken())!=0) {
            throw new Exception("Invalid Request.");
        }

        $file = $lineitem->getFile();

        if ($file->getFolder()->getFolderType()->getId() == EventgalleryLibraryFolderLocal::ID) {
            $this->handleLocalOrderDownload($file, $order, $lineitem);
        } elseif ($file->getFolder()->getFolderType()->getId() == EventgalleryLibraryFolderS3::ID) {
            $this->handleS3OrderDownload($file, $order, $lineitem);
        } else {
            $app->redirect($file->getOriginalImageUrl());
        }

    }

    /**
     * Allows to download the order as a zip file. It simply calls the order links for each image and adds the result to the zip file
     *
     * @throws Exception
     */
    public function zip() {
        $str_orderid = $this->input->getString('orderid', null);
        $str_token = $this->input->getString('token', null);


        /**
         * @var EventgalleryLibraryFactoryOrder $orderFactory
         */
        $orderFactory = EventgalleryLibraryFactoryOrder::getInstance();
        $order = $orderFactory->getOrderById($str_orderid);
        if ($order == null) {
            throw new Exception("Invalid Request.");
        }

        if ($order->getToken() != $str_token) {
            throw new Exception("Invalid Request.");
        }


        $zip = new ZipArchive();
        $config   = JFactory::getConfig();

        $tmpZipFilename = tempnam($config->get('tmp_path'), 'eg');


        if ($zip->open($tmpZipFilename, ZipArchive::CREATE)!==TRUE) {
            exit("cannot open <$tmpZipFilename>\n");
        }

        foreach($order->getLineItems() as $lineitem) {


            /**
             * @var EventgalleryLibraryImagelineitem $lineitem
             */

            if ($lineitem->getImageType()->isDigital()) {
                $file = $lineitem->getFile();

                $context = stream_context_create(
                    array(
                        'http' => array(
                            'follow_location' => true
                        )
                    )
                );

                $url = str_replace("/administrator", "", JRoute::_("index.php?option=com_eventgallery&view=download&task=order&orderid=" . $order->getId() . "&lineitemid=" . $lineitem->getId() . "&token=" . $order->getToken(), false, -1));
                $download_file = file_get_contents($url, null, $context);

                if ($download_file !== false) {

                    $fileuri = $file->getFolderName() . '/' . $file->getFileName();

                    if ($file->getFolder()->getFolderType()->getId() == EventgalleryLibraryFolderPicasa::ID) {
                        if (in_array('Content-Type: image/jpeg', $http_response_header)) {
                            $fileuri .= '.jpg';
                        }
                    }

                    $zip->addFromString($fileuri, $download_file);
                }
                unset($download_file);

            }

        }

        $zip->close();



        $size = filesize($tmpZipFilename);
        $fp   = fopen($tmpZipFilename, "rb");
        if (!($size && $fp)) {
            echo "Can't read zip file";
            return;
        }

        ob_clean();
        ob_end_flush();

        header("Pragma: public");
        header("Expires: 0");
        header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
        header("Cache-Control: public");
        header("Content-Description: File Transfer");
        header("Content-type: application/octet-stream");
        header("Content-Disposition: attachment; filename=" . $order->getDocumentNumber(). '.zip');
        header("Content-Transfer-Encoding: binary");
        header("Content-Length: ".$size);

        fpassthru($fp);
        fclose($fp);
        unlink($tmpZipFilename);
        die();

    }


    /**
     * @param EventgalleryLibraryFile $file
     * @param EventgalleryLibraryOrder $order
     * @param EventgalleryLibraryImagelineitem $lineitem
     */
    private function handleS3OrderDownload($file, $order, $lineitem) {
        $s3client = EventgalleryLibraryCommonS3client::getInstance();
        $tempFileName = JPATH_CACHE . '/' . $file->getFileName();
        $s3client->getObjectToFile(
            $s3client->getBucketForOriginalImages(),
            $file->getFolderName() . "/" . $file->getFileName(),
            $tempFileName);

        $imageSize = intval($lineitem->getImageType()->getSize());
        if (is_int($imageSize) && $imageSize>0 ) {
            $imageProcessor = new EventgalleryLibraryCommonImageprocessor();
            $imageProcessor->loadImage($tempFileName);

            $image_thumb_file = tempnam('com_eventgallery', '');


            $size = $imageSize;

            $imageProcessor->setTargetImageSize($size, -1, 'nocrop');
            $imageProcessor->processImage(
                false,
                false,
                null,
                false,
                false,
                null
            );
            $imageProcessor->saveThumbnail($image_thumb_file, 90);
            $imageProcessor->copyICCProfile($tempFileName, $image_thumb_file);
            $filename = $image_thumb_file;
        } else {
            $filename = $tempFileName;
        }

        header("Content-Disposition: attachment; filename=" . $order->getDocumentNumber(). '-' . $lineitem->getId() . '-' . $file->getFileName());
        header('Content-Transfer-Encoding: binary');
        header('Cache-Control: must-revalidate, post-check=0, pre-check=0');

        $mime = ($mime = getimagesize($filename)) ? $mime['mime'] : $mime;
        $size = filesize($filename);
        $fp   = fopen($filename, "rb");
        if (!($mime && $size && $fp)) {
            // Error.
            return;
        }

        header("Content-type: " . $mime);
        header("Content-Length: " . $size);
        fpassthru($fp);
        fclose($fp);
        unlink($image_thumb_file);
        unlink($tempFileName);
        die();
    }

    /**
     * @param EventgalleryLibraryFile $file
     * @param EventgalleryLibraryOrder $order
     * @param EventgalleryLibraryImagelineitem $lineitem
     */
    private function handleLocalOrderDownload($file, $order, $lineitem) {
        $basename = COM_EVENTGALLERY_IMAGE_FOLDER_PATH . $file->getFolderName() . '/';

        $filename = $basename . $file->getFileName();

        $imageSize = intval($lineitem->getImageType()->getSize());

        header("Content-Disposition: attachment; filename=" . $order->getDocumentNumber(). '-' . $lineitem->getId() . '-' . $file->getFileName());
        header('Content-Transfer-Encoding: binary');
        header('Cache-Control: must-revalidate, post-check=0, pre-check=0');

        if (is_int($imageSize) && $imageSize>0 ) {
            $this->renderThumbnail($file->getFolderName(), $file->getFileName(), $imageSize , null, false, false, false, false);
            die();
        }

        // try the path to a possible original file
        $fullfilename = $basename.'/'. COM_EVENTGALLERY_IMAGE_ORIGINAL_SUBFOLDER .'/'.$file->getFileName();

        if (file_exists($fullfilename)) {
            $filename = $fullfilename;
        }

        $mime = ($mime = getimagesize($filename)) ? $mime['mime'] : $mime;
        $size = filesize($filename);
        $fp   = fopen($filename, "rb");
        if (!($mime && $size && $fp)) {
            // Error.
            return;
        }

        header("Content-type: " . $mime);
        header("Content-Length: " . $size);
        fpassthru($fp);
        fclose($fp);
        die();
    }



}
