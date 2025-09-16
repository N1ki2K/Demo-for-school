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
jimport('joomla.error.log');
require_once JPATH_ROOT.'/components/com_eventgallery/library/common/logger.php';

class EventgalleryLibraryFileS3 extends EventgalleryLibraryFile
{
    public $exif;
    private $expriationTime = '+10 minutes';
    private $params;

    /**
     * creates the lineitem object. $dblineitem is the database object of this line item
     *
     * @param object $object
     * @throws Exception
     */
    function __construct($object)
    {
        parent::__construct($object);

        $this->params = JComponentHelper::getParams('com_eventgallery');
        
        if (isset($this->_file->exif) ){
            $this->exif = json_decode($this->_file->exif);
        }
        else {
            $this->exif = new stdClass();
        }

        if ($this->_file->width <= 0) {
            $this->_file->width = 1000;
        }
        if ($this->_file->height <= 0) {
            $this->_file->height = 1000;
        }

    }

    public function getImageUrl($width=104,  $height=104, $fullsize, $larger=false) {
        $s3client = EventgalleryLibraryCommonS3client::getInstance();
        if ($fullsize) {
            return $s3client->getURL($s3client->getBucketForThumbnails(), $this->calculateS3Key(COM_EVENTGALLERY_IMAGE_ORIGINAL_MAX_WIDTH), true);
        } else {
            $width = $this->getSizeCode($width, $height);
            return $s3client->getURL($s3client->getBucketForThumbnails(), $this->calculateS3Key($width), true);
        }
    }

    public function getThumbUrl ($width=104, $height=104, $larger=true, $crop=false) {
        $s3client = EventgalleryLibraryCommonS3client::getInstance();
        $width = $this->getSizeCode($width, $height);
        return $s3client->getURL($s3client->getBucketForThumbnails(), $this->calculateS3Key($width), true);
    }

    public function getOriginalImageUrl() {

        return JUri::base().substr(JRoute::_('index.php?option=com_eventgallery&view=download&folder='.$this->getFolderName().'&file='.urlencode($this->getFileName()) ), strlen(JUri::base(true)) + 1);

    }

    public function getSharingImageUrl() {

        return JUri::base().substr(JRoute::_('index.php?option=com_eventgallery&is_for_sharing=true&view=download&folder='.$this->getFolderName().'&file='.urlencode($this->getFileName()) ), strlen(JUri::base(true)) + 1);

    }
    
    private function getSizeCode($width, $height) {


        $longSideSize = $width;

        if ($height>$width) {
            $longSideSize = $height;
        }

        if ($height == $width) {
            $ratio = $this->getWidth() / $this->getHeight();
            if ($ratio > 1) {
                // landscape
                $longSideSize = $width * $ratio;
            } else {
                //portait
                $longSideSize = $width / $ratio;
            }
        }

        $sizeSet = new EventgalleryHelpersSizeset();
        return $sizeSet->getMatchingSize($longSideSize);
    }

    public function getETag() {
        return $this->_file->s3_etag;
    }

    /**
     * returns an array(s3key => etag)
     *
     * @return array
     */
    public function getETagForThumbnails() {
        return json_decode($this->_file->s3_etag_thumbnails, true);
    }

    /**
     * increases the hit counter in the database
     */
    public function countHit() {
        /**
         * @var EventgalleryTableFile $table
         */
        $table = JTable::getInstance('File', 'EventgalleryTable');
        $table->hit($this->_file->id);
    }

    public function syncFile() {
        $db = JFactory::getDbo();
        $s3client = EventgalleryLibraryCommonS3client::getInstance();
        $key = $this->getFolderName() . "/" . $this->getFileName();


        $tempFileName = tempnam('', '');

        $s3file = $s3client->getObjectToFile($s3client->getBucketForOriginalImages(), $key, $tempFileName);

        $etag = $this->cleanETag($s3file['ETag']);

        EventgalleryLibraryFileLocal::updateMetadata($tempFileName, $this->getFolderName(),$this->getFileName());
        unset($s3file);
        gc_collect_cycles();
        if(is_file($tempFileName)) {
            //chown($tempFileName,666);
            unlink($tempFileName);
        }

        if ($etag != $this->getETag()) {
            // update the etag since it has changed.
            $query = $db->getQuery(true);
            $query->update('#__eventgallery_file')
                ->set('s3_etag=' . $db->quote($etag))
                ->set('s3_etag_thumbnails=""')
                ->where('id=' . $db->quote($this->getId()));
            $db->setQuery($query);
            $db->execute();
        }

        return EventgalleryLibraryManagerFolder::$SYNC_STATUS_SYNC;

    }

    public function createThumbnails() {
        $params = JComponentHelper::getParams('com_eventgallery');

        $lambdaURL = $params->get('storage_s3_resize_api_url', '');

        if (strlen($lambdaURL) > 0) {
            return $this->createThumbnailsRemote($params);
        } else {
            return $this->createThumbnailsLocal($params);
        }
    }

    /**
     * Create thumbnails using a remote API
     *
     * @param $params
     */
    public function createThumbnailsRemote($params) {

        $s3client = EventgalleryLibraryCommonS3client::getInstance();
        $sizeSet = new EventgalleryHelpersSizeset();
        $availableSizes = array_unique($sizeSet->availableSizes);

        $url = $params->get('storage_s3_resize_api_url');
        $apiKey = $params->get('storage_s3_resize_api_key');

        $data = [
            "bucketOriginals"  => $s3client->getBucketForOriginalImages(),
            "bucketThumbnails"  => $s3client->getBucketForThumbnails(),
            "autorotate" => $params->get('use_autorotate', 1) == 1,
            "sharpImage" => $params->get('use_sharpening',1) == 1,
            "sharpOriginalImage" => $params->get('use_sharpening_for_originalsize', 1) == 1,
            "doWatermark" => false,
            "watermark"  => [
                "src"  => "https://www.svenbluege.de/images/SvenBluege-Photography-Logo.png"
            ],
            "sizes" => $availableSizes,
            "folder" => $this->getFolderName(),
            "files" => [$this->getFileName()]
        ];

        $data_string = json_encode($data);


        $ch = curl_init($url);

        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
        curl_setopt($ch, CURLOPT_POSTFIELDS, $data_string);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array(
                'Content-Type: application/json',
                'Content-Length: ' . strlen($data_string),
                'x-api-key:' . $apiKey
                )
        );

        $result = curl_exec($ch);


        if ($result === false) {
            return ["ERROR" => curl_error($ch)];
        }

        curl_close($ch);

        $result = json_decode($result, true);

        $originalImageETag = $result['original'][$this->getFileName()];
        $thumbnailETags = $result['thumbnails'][$this->getFileName()];

        $this->saveETags($originalImageETag, $thumbnailETags);


        return [$availableSizes];
    }

    /**
     * Create Thumbnails using the local server and upload them to S3
     *
     * @param $params
     * @return array
     */
    public function createThumbnailsLocal($params) {


        JLog::addLogger(
            array(
                'text_file' => 'com_eventgallery_s3.log.php',
                'logger' => 'Eventgalleryformattedtext'
            ),
            JLog::ALL,
            'com_eventgallery'
        );

        $time_start = microtime(true);

        $s3client = EventgalleryLibraryCommonS3client::getInstance();
        $sizeSet = new EventgalleryHelpersSizeset();
        $availableSizes = array_unique($sizeSet->availableSizes);
        $doWatermarking = true;
        $doSharping = true;

        $folderObject = $this->getFolder();
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

        $tempFileName = JPATH_CACHE . '/' . $this->getFileName();
        $s3file = $s3client->getObjectToFile($s3client->getBucketForOriginalImages(), $this->getFolderName() . "/" . $this->getFileName(), $tempFileName);

        $originalFileETag = $this->cleanETag($s3file['ETag']);

        $imageProcessor = new EventgalleryLibraryCommonImageprocessor();
        $imageProcessor->loadImage($tempFileName);

        $thumbnailETags = array();



        foreach($availableSizes as $size) {


            $image_thumb_file = tempnam('com_eventgallery', '');


            $imageProcessor->setTargetImageSize($size, -1, 'nocrop');
            $imageProcessor->processImage(
                $params->get('use_autorotate', 1)==1,
                $doWatermarking,
                $watermark,
                $doSharping && $params->get('use_sharpening',1),
                $params->get('use_sharpening_for_originalsize', 1) == 1,
                $params->get('image_sharpenMatrix','[[-1,-1,-1],[-1,16,-1],[-1,-1,-1]]')
            );
            $imageProcessor->saveThumbnail($image_thumb_file, $params->get('image_quality',85));
            $imageProcessor->copyICCProfile($tempFileName, $image_thumb_file);


            $key = $this->calculateS3Key($size);

            $thumbnail = $s3client->putObjectFile($s3client->getBucketForThumbnails(),
                $key,
                $image_thumb_file,
                EventgalleryLibraryCommonS3client::ACL_PUBLIC_READ
            );

            $thumbnailETags[$key] = $this->cleanETag($thumbnail['ETag']);

            // call this to clear the filenhandler. Otherwise we can't delete the temp file
            gc_collect_cycles();
            unlink($image_thumb_file);
        }

        EventgalleryLibraryFileLocal::updateMetadata($tempFileName, $this->getFolderName(),$this->getFileName());
        
        unset($s3file);
        gc_collect_cycles();
        unlink($tempFileName);

        $this->saveETags($originalFileETag, $thumbnailETags);

        $time_end = microtime(true);

        $execution_time = ($time_end - $time_start);

        JLog::add('processing file '.$this->getFolderName(). '/'. $this->getFileName() . "in $execution_time s.", JLog::INFO, 'com_eventgallery');
        return [$availableSizes];
    }

    /**
     * remove double quoutes at the beginning and the end of an etag
     *
     * @param $etag
     * @return String
     */
    private function cleanETag($etag) {
        return str_replace("\"", "", $etag);
    }

    private function saveETags($originalFileETag, $thumbnailETags) {
        $db = JFactory::getDbo();
        // update the etag since it has changed.
        $query = $db->getQuery(true);
        $query->update('#__eventgallery_file')
            ->set('s3_etag='. $db->quote($originalFileETag))
            ->set('s3_etag_thumbnails='. $db->quote(json_encode($thumbnailETags)))
            ->where('id=' . $db->quote($this->getId()));
        $db->setQuery($query);
        $db->execute();
    }

    public function calculateS3Key($size) {
        $filepath = $this->getFolderName() . '/'. $this->calculateS3KeyPart($size);
        return $filepath;
    }


    private function calculateS3KeyPart($size) {
        $filename = 's'. $size . '/' . $this->getFileName();
        return $filename;
    }

}
