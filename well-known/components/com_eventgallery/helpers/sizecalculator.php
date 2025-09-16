<?php
/**
 * @package     Sven.Bluege
 * @subpackage  com_eventgallery
 *
 * @copyright   Copyright (C) 2005 - 2013 Sven Bluege All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;
/*
* there is a set of sizes. based on the longest site of the image it'll use one of
* the entries in the set. If the image has width== height it's a square, we'll return a square sized image
*/
class EventgalleryHelpersSizecalculator
{

    var $img_width = NULL;
    var $img_height = NULL;
    var $desired_width = NULL;
    var $doFindMatingSize = NULL;
    var $width = NULL;
    var $height = NULL;
    var $isCrop = false;

    // constructor
    public function __construct($img_width, $img_height, $desired_width, $isCrop = false, $doFindMatingSize)
    {
        $this->img_width = $img_width;
        $this->img_height = $img_height;
        $this->desired_width = $desired_width;
        $this->isCrop = $isCrop;
        $this->doFindMatingSize = $doFindMatingSize;
        $this->adjustSize();

    }

    private function adjustSize()
    {
        $sizeSet = new EventgalleryHelpersSizeset();

        if ($this->isCrop) {
            $this->width = $sizeSet->getMatchingSize($this->desired_width);
            $this->height = $this->width;
            return;
        }

        if ($this->doFindMatingSize) {
            $sizeValue = $sizeSet->getMatchingSize($this->desired_width);
        } else {
            $sizeValue = $this->desired_width;
        }

        if ($this->img_width > $this->img_height) {
            $this->width = $sizeValue;
            $this->height = ceil($this->img_height / $this->img_width * $this->width);
        } else {
            $this->height = $sizeValue;
            $this->width = ceil($this->img_width / $this->img_height * $this->height);
        }

    }

    public function getWidth()
    {
        return $this->width;
    }

    public function getHeight()
    {
        return $this->height;
    }

}