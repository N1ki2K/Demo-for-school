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


class EventgalleryLibraryImagelineitem extends EventgalleryLibraryLineitem
{

    /**
     * @var EventgalleryLibraryFile
     */
    protected $_file = null;
    /**
     * @var EventgalleryLibraryImagetype
     */
    protected $_imagetype = null;

    /**
     * @var string
     */
    protected $_lineitem_table = 'Imagelineitem';

    /**
     * creates the lineitem object. The given $lineitem can be an stdClass object or a id of a line item.
     * This is necessary since a lineitemcontainer can already preload it's line items with a single query.
     *
     * @param $lineitem
     */
    function __construct($lineitem)
    {
        parent::__construct($lineitem);


    }


    /**
     * @return string
     */
    public function getMiniCartThumb()
    {
        return $this->getFile()->getMiniCartThumb($this);
    }

    /**
 * @return string
 */
    public function getCartThumb()
    {
        if ($this->getFile() != null) {
            return $this->getFile()->getCartThumb($this);
        }

        return "";
    }

    /**
     * @return string
     */
    public function getOrderThumb()
    {
        if ($this->getFile() != null) {
            return $this->getFile()->getOrderThumb($this);
        }

        return "";
    }

    /**
     * @return string
     */
    public function getMailThumbUrl()
    {
        if ($this->getFile() != null) {
            return $this->getFile()->getMailThumbUrl($this);
        }

        return "";
    }

    /**
     * @return EventgalleryLibraryFile|null
     */
    public function getFile()
    {
        if ($this->_file == null) {
            /**
             * @var EventgalleryLibraryFactoryFile $fileFactory
             */
            $fileFactory = EventgalleryLibraryFactoryFile::getInstance();
            $this->_file = $fileFactory->getFile($this->_lineitem->folder, $this->_lineitem->file);
        }
        return $this->_file;
    }

    /**
     * @return string
     */
    public function getFileName()
    {
        return $this->_lineitem->file;
    }

    /**
     * @return string
     */
    public function getFolderName()
    {
        return $this->_lineitem->folder;
    }

    /**
     * @return EventgalleryLibraryImagetype|null
     */
    public function getImageType()
    {
        /**
         * @var EventgalleryLibraryFactoryImagetype $imagetypeMgr
         */
        $imagetypeMgr = EventgalleryLibraryFactoryImagetype::getInstance();

        if ($this->_imagetype == null) {
            $this->_imagetype = $imagetypeMgr->getImagetypeById($this->_lineitem->imagetypeid);
        }

        return $this->_imagetype;
    }

    /**
     * @return string
     */
    public function getBuyerNote()
    {
        return $this->_lineitem->buyernote;
    }

    /**
     * @param string $note
     */
    public function setBuyerNote($note)
    {
        $this->_lineitem->buyernote = $note;
        $this->_store();
    }

    /**
     * @return string
     */
    public function getSellerNote()
    {
        return $this->_lineitem->sellernote;
    }

    /**
     * @param int $imagetypeid
     *
     * @throws Exception
     */
    public function setImageType($imagetypeid)
    {
        $newImageType = $this->getFile()->getFolder()->getImageTypeSet()->getImageType($imagetypeid);
        /* @var $newImageType EventgalleryLibraryImagetype */
        if ($newImageType == null) {
            $newImageType = $this->getFile()->getFolder()->getImageTypeSet()->getDefaultImageType();
        }

        $this->_lineitem->imagetypeid = $newImageType->getId();
        $this->_lineitem->singleprice = $newImageType->getPrice()->getAmount();
        $this->_lineitem->currency = $newImageType->getPrice()->getCurrency();
        $this->_store();
        $this->_imagetype = null;
    }

}
