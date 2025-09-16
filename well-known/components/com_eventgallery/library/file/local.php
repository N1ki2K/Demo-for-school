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
require_once JPATH_ROOT.'/components/com_eventgallery/config.php';

use lsolesen\pel\PelJpeg;
use lsolesen\pel\PelIfd;
use lsolesen\pel\Pel;
use lsolesen\pel\PelTag;

class EventgalleryLibraryFileLocal extends EventgalleryLibraryFile
{

    protected $_image_script_path = 'components/com_eventgallery/helpers/image.php?';

    public $exif;

    /**
     * creates the lineitem object. $dblineitem is the database object of this line item
     *
     * @param object $object
     * @throws Exception
     */
    function __construct($object)
    {

        parent::__construct($object);

        $params = JComponentHelper::getParams('com_eventgallery');

        if ($params->get('use_legacy_image_rendering','0')=='1') {
            $this->_image_script_path = "index.php?option=com_eventgallery&view=resizeimage";
        }


        if (isset($this->_file->exif) ){
            $this->exif = json_decode($this->_file->exif);
        }
        else {
            $this->exif = new stdClass();
        }

        // this is necessary to avoid an exception while running in CLI mode
        if (array_key_exists('REQUEST_METHOD', $_SERVER)) {
            $currentApplicationName = JFactory::getApplication()->getName();

            if ($currentApplicationName == 'administrator') {
                $this->_image_script_path .= '&site=1';
            }
        }
    }

    public function getImageUrl($width=104,  $height=104, $fullsize, $larger=false) {
        if ($fullsize) {
            return JUri::root().$this->_image_script_path."&mode=full&folder=".$this->getFolderName()."&file=".urlencode($this->getFileName());
        } else {

            if ($height>$width) {
                $width = $height;
            }

            return JUri::root().$this->_image_script_path."&width=".$width."&folder=".$this->getFolderName()."&file=".urlencode($this->getFileName());
        }
    }



    public function getThumbUrl ($width=104, $height=104, $larger=true, $crop=false) {

        if ($crop) {
            $mode = 'crop';
        } else {
            $mode = 'nocrop';
        }

        if ($height>$width) {
            $width = $height;
        }

        return JUri::root().$this->_image_script_path."&mode=".$mode."&width=".$width."&folder=".$this->getFolderName()."&file=".urlencode($this->getFileName());
    }

    public function getOriginalImageUrl() {

    	return JUri::base().substr(JRoute::_('index.php?option=com_eventgallery&view=download&&folder='.$this->getFolderName().'&file='.urlencode($this->getFileName()) ), strlen(JUri::base(true)) + 1);
        
    }

    public function getSharingImageUrl() {

        return JUri::base().substr(JRoute::_('index.php?option=com_eventgallery&is_for_sharing=true&view=download&&folder='.$this->getFolderName().'&file='.urlencode($this->getFileName()) ), strlen(JUri::base(true)) + 1);

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
        $folderpath = COM_EVENTGALLERY_IMAGE_FOLDER_PATH.$this->getFolderName();
        self::updateMetadata($folderpath.DIRECTORY_SEPARATOR.$this->getFileName(), $this->getFolderName(), $this->getFileName());

        return EventgalleryLibraryManagerFolder::$SYNC_STATUS_SYNC;
    }

    /**
     * upaded meta information
     * @param $path
     * @param $foldername
     * @param $filename
     */
    public static function updateMetadata($path, $foldername, $filename) {
        /**
         * @var \Joomla\Registry\Registry $params
         */
        $params = JComponentHelper::getParams('com_eventgallery');

        /** @noinspection PhpUnusedLocalVariableInspection */
        @list($width, $height, $type, $attr) = getimagesize($path, $info);


        $creation_date = "";
        $title = "";
        $caption = "";

        if (isset($info["APP13"]) && function_exists("iptcparse")) {
            $iptc = iptcparse($info["APP13"]);
            if (is_array($iptc)) {
                if (isset($iptc["2#005"])) {
                    $title = $iptc["2#005"][0];
                }

                if (isset($iptc["2#055"])) {
                    $creation_date = $iptc["2#055"][0];
                    if (isset($iptc["2#060"])) {
                        $creation_date .= $iptc["2#060"][0];
                    }
                }

                if (isset($iptc["2#120"])) {
                    $caption = $iptc["2#120"][0];
                }
            }
        }

        // do some filtering for the content. We do not allow HTML in here.
        $filter = JFilterInput::getInstance();
        $title = $filter->clean($title, 'html');
        $caption = $filter->clean($caption, 'html');
        $creation_date = $filter->clean($creation_date, 'html');


        $exif = array();

        try {
            $input_jpeg = new PelJpeg($path);

            $app1 = $input_jpeg->getExif();

            if ($app1) {
                $tiff = $app1->getTiff();
                $ifd0 = $tiff->getIfd();
                $exifData = $ifd0->getSubIfd(PelIfd::EXIF);

                if ($exifData) {

                    if ( ($data = $exifData->getEntry(PelTag::APERTURE_VALUE)) || ($data=$exifData->getEntry(PelTag::FNUMBER))) {
                        $value = $data->getValue();
                        $aperture = floor(pow(2, $value[0]/$value[1]/2)*10.0)/10.0;
                        $exif['fstop'] = sprintf('%.1f', $aperture);
                    }

                    if (($data = $exifData->getEntry(PelTag::FOCAL_LENGTH_IN_35MM_FILM)) || ($data = $exifData->getEntry(PelTag::FOCAL_LENGTH))) {
                        $value = $data->getValue();
                        if (is_int($value)) {
                            $exif['focallength'] = $value;
                        } else {
                            $exif['focallength'] = sprintf('%.0f', $value[0] / $value[1]);
                        }
                    }
                    if ($data = $exifData->getEntry(PelTag::EXPOSURE_TIME)) {
                        $value = $data->getValue();

                        $exif['exposuretime'] = $data->formatNumber($value);

                    }

                    if ($data = $ifd0->getEntry(PelTag::MODEL)) {
                        $exif['model'] = $data->getText();
                    }
                    if ($data = $exifData->getEntry(PelTag::ISO_SPEED_RATINGS)) {
                        $exif['iso'] = $data->getText();
                    }

                    // we need to store the image size differently if we rotate the image later.
                    if ($params->get('use_autorotation',1)==1 && $ifd0 != null) {

                        $orientation = $ifd0->getEntry(PelTag::ORIENTATION);

                        if ($orientation != null) {
                            if ($orientation->getValue()==6 || $orientation->getValue()==8) {
                                $tempWidth = $width;
                                $width = $height;
                                $height = $tempWidth;
                            }
                        }
                    }
                }


            }
        } catch (Exception $e) {

        }

        $exifJson = json_encode($exif);

        $db = JFactory::getDbo();

        $query = $db->getQuery(true);
        $query->update("#__eventgallery_file");
        $query->set("width=".$db->quote($width));
        $query->set("height=".$db->quote($height));
        $query->set("exif=".$db->quote($exifJson));
        $query->set("creation_date=".$db->quote($creation_date));
        $query->where('folder='.$db->quote($foldername));
        $query->where('file='.$db->quote($filename));
        $db->setQuery($query);
        $db->execute();


        $use_iptc_data = $params->get('use_iptc_data', 1) == 1;
        $override_with_iptc_data = $params->get('overwrite_with_iptc_data', 0) == 1;


        if ($use_iptc_data && !empty($title)) {
            $query = $db->getQuery(true);
            $query->update("#__eventgallery_file");
            $query->set("title=" . $db->quote($title));
            $query->where('folder=' . $db->quote($foldername));
            $query->where('file=' . $db->quote($filename));
            if ($override_with_iptc_data == false) {
                $query->where("(title='' OR title IS NULL)");
            }
            $db->setQuery($query);
            $db->execute();
        }

        if ($use_iptc_data && !empty($caption)) {
            $query = $db->getQuery(true);
            $query->update("#__eventgallery_file");
            $query->set("caption=" . $db->quote($caption));
            $query->where('folder=' . $db->quote($foldername));
            $query->where('file=' . $db->quote($filename));
            if ($override_with_iptc_data == false) {
                $query->where("(caption='' OR caption IS NULL)");
            }
            $db->setQuery($query);
            $db->execute();
        }

        Pel::clearExceptions();
        unset($input_jpeg);
    }


}
