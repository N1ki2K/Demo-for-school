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

class EventgalleryLibraryWatermark extends EventgalleryLibraryDatabaseObject
{

    /**
     * @var EventgalleryTableWatermark
     */
    protected $_watermark = NULL;
    protected $_watermark_id = NULL;

    public function __construct($dbwatermark)
    {
        if (!is_object($dbwatermark)) {
            throw new InvalidArgumentException("Can't initialize Watermark Object without a Data Object.");
        }
        $this->_watermark = $dbwatermark;
        $this->_watermark_id = $dbwatermark->id;



        parent::__construct();
    }

    /**
     * @return string the id of the watermark
     */
    public function getId()
    {
        return $this->_watermark->id;
    }   

    /**
     * @return string display name of the watermark
     */
    public function getName()
    {
        return $this->_watermark->name;
    }

    
    /**
     * @return string description name of the watermark
     */
    public function getDescription()
    {
        return $this->_watermark->description;
    }
   

    /**
     * @return bool
     */
    public function isPublished() {
        return $this->_watermark->published==1;
    }

    /**
     * @return bool
     */
    public function isDefault() {
        return $this->_watermark->default==1;
    }

     /**
     * @return int
     */
    public function getOrdering() {
        return $this->_watermark->ordering;
    }


    /**
     * Returns the image resource for this watermark
     *
     * @return resource|null
     */
    public function getImageResource() {

        $image_file = JPATH_SITE.'/'.$this->getImagePath();

        if (!file_exists($image_file)) {
            return null;
        }

        $im = null;

        $ext = pathinfo($image_file, PATHINFO_EXTENSION);;

        if (strtolower($ext) == "gif") {
            if (!$im = imagecreatefromgif($image_file)) {
                echo "Error opening $image_file!"; exit;
            }
        } else if(strtolower($ext) == "jpg" || strtolower($ext) == "jpeg") {
            if (!$im = imagecreatefromjpeg($image_file)) {
                echo "Error opening $image_file!"; exit;
            }
        } else if(strtolower($ext) == "png") {
            if (!$im = imagecreatefrompng($image_file)) {
                echo "Error opening $image_file!"; exit;
            }
        }

        return $im;
    }

    /**
     * returns the path to the image
     *
     * @return string
     */
    public function getImagePath() {
        return $this->_watermark->image;
    }


    /**
     * @return string
     */
    public function getImagePosition() {
        return $this->_watermark->image_position;
    }

    /**
     * @return int
     */
    public function getImageOpacity() {
        return $this->_watermark->image_opacity;
    }

    /**
     * @return string
     */
    public function getImageMode() {
        return $this->_watermark->image_mode;
    }

    /**
     * @return int
     */
    public function getImageModeProportional() {
        return $this->_watermark->image_mode_prop;
    }

    /**
     * @return int
     */
    public function getImageMarginHorizontal() {
        return $this->_watermark->image_margin_horizontal;
    }

    /**
     * @return int
     */
    public function getImageMarginVertical() {
        return $this->_watermark->image_margin_vertical;
    }

     /**
	 * Returns the minimum size for images before a watermark gets rendered.
	 *
     * @return int
     */
    public function getImageThumbThresholdSize() {
        return (int)$this->_watermark->image_thumbthresholdsize;
    }

    /**
     * paints the watermark on the given image
     *
     * @param resource $image
     * @param bool $force can overrule the published status of the watermark.
     * @return resource
     */
    public function addWatermark($image, $force=false) {

        if (!$force && !$this->isPublished()) {
            return $image;
        }

        $watermark = $this->getImageResource();

        if ($watermark == null) {
            return $image;
        }

        // validate threshold

        $size = max(imagesx($image), imagesy($image));

        if ($this->getImageThumbThresholdSize()>$size) {
        	return $image;
        }

        // calc margin

        $margin_x = 0;
        $margin_y = 0;

        if ($this->getImageMode() == 'prop' || $this->getImageMode() == 'fit') {
            $margin_x = floor(imagesx($image)*0.25*$this->getImageMarginHorizontal()/100);
            $margin_y = floor(imagesy($image)*0.25*$this->getImageMarginVertical()/100);
        }

        // resize watermark

        switch($this->getImageMode()) {
            case "fill": break;
            case "fit":
                $ratio = imagesy($watermark) / imagesx($watermark);
                $width = imagesx($image) - $margin_x*2;
                $height = $width*$ratio;
                $watermark = $this->resizeImage($watermark, $width, $height);
                break;
            case "prop":
                $ratio = imagesy($watermark) / imagesx($watermark);
                $width = floor( imagesx($image) * $this->getImageModeProportional()/100)  - $margin_x*2;
                $height = $width*$ratio;
                $watermark = $this->resizeImage($watermark, $width, $height);
                break;
        }

        // add watermark to the original image

        $position = str_split($this->getImagePosition());

        $dest_x = 0;
        $dest_y = 0;

        switch ($position[0]) {
            case "t":
                $dest_y = 0 + $margin_y;
                break;
            case "m":
                $dest_y = floor( (imagesy($image) - imagesy($watermark) ) / 2 );
                break;
            case "b":
                $dest_y = imagesy($image) - imagesy($watermark) - $margin_y;
                break;
        }

        switch ($position[1]) {
            case "l":
                $dest_x = 0 + $margin_x;
                break;
            case "c":
                $dest_x = floor( (imagesx($image) - imagesx($watermark)) / 2 );
                break;
            case "r":
                $dest_x = imagesx($image) - imagesx($watermark) - $margin_y;
                break;
        }


        $this->imagecopymerge_alpha($image, $watermark, $dest_x, $dest_y, 0, 0, imagesx($watermark), imagesy($watermark), $this->getImageOpacity());

        return $image;
    }



    /**
     * @param resource $image
     * @param int $width
     * @param int $height
     * @return resource
     */
    private function resizeImage($image, $width, $height) {
        $new_image = imagecreatetruecolor($width, $height);

        imagealphablending($image, false);

        imagealphablending($new_image, true);
        $trans_layer_overlay = imagecolorallocatealpha($new_image, 0, 0, 200, 127);
        imagefill($new_image, 0, 0, $trans_layer_overlay);
        imagesavealpha($new_image, true);

        imagecopyresampled($new_image, $image, 0, 0, 0, 0, $width, $height, imagesx($image), imagesy($image));
        imagedestroy($image);

        return $new_image;
    }

    /**
     * http://www.php.net/manual/en/function.imagecopymerge.php#88456
     *
     * @param $dst_im
     * @param $src_im
     * @param $dst_x
     * @param $dst_y
     * @param $src_x
     * @param $src_y
     * @param $src_w
     * @param $src_h
     * @param $pct
     * @return bool
     */
    function imagecopymerge_alpha($dst_im, $src_im, $dst_x, $dst_y, $src_x, $src_y, $src_w, $src_h, $pct){
        if(!isset($pct)){
            return false;
        }
        $pct /= 100;
        // Get image width and height
        $w = imagesx( $src_im );
        $h = imagesy( $src_im );
        // Turn alpha blending off
        imagealphablending( $src_im, false );
        // Find the most opaque pixel in the image (the one with the smallest alpha value)
        $minalpha = 127;
        for( $x = 0; $x < $w; $x++ )
            for( $y = 0; $y < $h; $y++ ){
                $alpha = ( imagecolorat( $src_im, $x, $y ) >> 24 ) & 0xFF;
                if( $alpha < $minalpha ){
                    $minalpha = $alpha;
                }
            }
        //loop through image pixels and modify alpha for each
        for( $x = 0; $x < $w; $x++ ){
            for( $y = 0; $y < $h; $y++ ){
                //get current alpha value (represents the TANSPARENCY!)
                $colorxy = imagecolorat( $src_im, $x, $y );
                $alpha = ( $colorxy >> 24 ) & 0xFF;
                //calculate new alpha
                if( $minalpha !== 127 ){
                    $alpha = 127 + 127 * $pct * ( $alpha - 127 ) / ( 127 - $minalpha );
                } else {
                    $alpha += 127 * $pct;
                }
                //get the color index with new alpha
                $alphacolorxy = imagecolorallocatealpha( $dst_im, ( $colorxy >> 16 ) & 0xFF, ( $colorxy >> 8 ) & 0xFF, $colorxy & 0xFF, $alpha );
                //set pixel with the new color + opacity
                if( !imagesetpixel( $src_im, $x, $y, $alphacolorxy ) ){
                    return false;
                }
            }
        }
        // The image copy
        imagecopy($dst_im, $src_im, $dst_x, $dst_y, $src_x, $src_y, $src_w, $src_h);

        return true;
    }

}
