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

class EventgalleryLibraryFileflickr extends EventgalleryLibraryFile
{

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

        if (isset($this->_file->exif) ){
            $this->exif = json_decode($this->_file->exif);
        }
        else {
            $this->exif = new stdClass();
        }
    }

    public function getFarmId() {
        return $this->_file->flickr_farm;
    }

    public function getServerId() {
        return $this->_file->flickr_server;
    }

    public function getSecret() {
        return $this->_file->flickr_secret;
    }

    public function getSecretO() {
        return $this->_file->flickr_secret_o;
    }

    public function getSecretH() {
        return $this->_file->flickr_secret_h;
    }

    public function getSecretK() {
        return $this->_file->flickr_secret_k;
    }


    public function getLazyThumbImgTag($width=104,  $height=104, $cssClass="", $crop=false, $customDataAttributes = "") {

        $customDataAttributes  = ' data-farm="'.$this->getFarmId().'"';
        $customDataAttributes .= ' data-server="'.$this->getServerId().'"';
        $customDataAttributes .= ' data-secret="'.$this->getSecret().'"';
        $customDataAttributes .= ' data-secret_o="'.$this->getSecretO().'"';
        $customDataAttributes .= ' data-secret_h="'.$this->getSecretH().'"';
        $customDataAttributes .= ' data-secret_k="'.$this->getSecretK().'"';
        $customDataAttributes .= ' data-id="'.$this->getFileName().'"';
        $customDataAttributes .= ' ';

        return parent::getLazyThumbImgTag($width, $height, $cssClass, $crop, $customDataAttributes);
    }

    public function getImageUrl($width=104,  $height=104, $fullsize, $larger=false) {
        if ($fullsize) {
            return $this->getThumbUrl(1600, 1600);
        } else {
            return $this->getThumbUrl($width, $height);
        }
    }

    public function getThumbUrl ($width=104, $height=104, $larger=true, $crop=false) {
        if ($width == 0) {
            $width = 104;
        }
        if ($height == 0) {
            $height = 104;
        }
        return $this->flickrUrlBuilder($this->getFlickrSizeCode($width, $height));
    }

    public function getOriginalImageUrl() {
    	return $this->flickrUrlBuilder('o');
    }

    public function getSharingImageUrl() {
        return $this->getOriginalImageUrl();
    }

    /**
     *
     * s    klein, quadratisch, 75 x 75
     * q    large square 150x150
     * t    Thumbnail, 100 an der Längsseite
     * m    klein, 240 an der Längsseite
     * n    small, 320 on longest side
     * -    mittel, 500 an der Längsseite
     * z    mittel 640, 640 an der längsten Seite
     * c    mittel 800, 800 an der längsten Seite†
     * b    groß, 1024 an der längsten Seite*
     * h    groß mit 1600 Pixel, 1600 an längster Seite†
     * k    groß mit 2048 Pixel, 2048 an längster Seite†
     * o    Originalbild, entweder JPG, GIF oder PNG, je nach Quellformat
     *
     * @param $size
     * @return string
     */
    private function flickrUrlBuilder($sizeCode) {
        switch ($sizeCode) {
            case "h":
                $secret = $this->getSecretH();
                break;
            case "k":
                $secret = $this->getSecretK();
                break;
            case "o":
                $secret = $this->getSecretO();
                break;
            default:
                $secret = $this->getSecret();
        }

        $size = $sizeCode == '-' ? '' : '_'.$sizeCode;
        return 'https://farm'.$this->getFarmId().'.staticflickr.com/'.$this->getServerId().'/'.$this->getFileName().'_'.$secret.$size.'.jpg';
    }

    private function getFlickrSizeCode($width, $height) {

        $longSideSize = $width;
        $originalLongSideSize = $this->getWidth();

        if ($height>$width) {
            $longSideSize = $height;
            $originalLongSideSize = $this->getHeight();
        }

        if ($height == $width) {
            $ratio = $this->getWidth() / $this->getHeight();
            if ($ratio < 1) {
                // landscape
                $longSideSize = $width / $ratio;
            } else {
                //portait
                $longSideSize = $width * $ratio;
            }
        }

        if ($originalLongSideSize < $longSideSize) {
            return 'o';
        }

        $sizes = array(100 => 't', 240 => 'm', 320 => 'n', 500 => '-', 640 => 'z', 800 => 'c', 1024 => 'b', 1600 => 'h', 2048 => 'k');

        foreach($sizes as $size=>$sizeCode) {
            if ($size > $longSideSize) {
                return $sizeCode;
            }
        }

        return 'k';
    }

    public function getThumbImgTag($width=104,  $height=104, $cssClass="", $crop=false, $alternateThumbUrl = null) {
        $newWidth = $width;
        $newHeight = $height;

        if ($crop === false) {
            $newHeight = $this->getHeight()/$this->getWidth() * $width;
        }


        return '<img src="'.JUri::root().$this->_blank_script_path.'" '.
        'style="width: '.$newWidth.'px; '.
        'height: '.$newHeight.'px; '.
        'background-repeat:no-repeat; '.
        'background-position: 50% 50%; '.
        ($newWidth == $newHeight ? ($this->getWidth()>$this->getHeight() ? 'background-size: auto 100%;': 'background-size: 100% auto;'): '').
        'background-image:url(\''.htmlspecialchars($alternateThumbUrl == null ? $this->getThumbUrl($newWidth,$newHeight, true, $newHeight==$newWidth) : $alternateThumbUrl, ENT_NOQUOTES, "UTF-8").'\'); '.
        '" '.
        'alt="'.$this->getAltContent().'" '.
        'class="'.$cssClass.'"/>';
    }
}
