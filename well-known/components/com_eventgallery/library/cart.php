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

/**
 * @property mixed cart
 */
class EventgalleryLibraryCart extends EventgalleryLibraryLineitemcontainer
{

    /**
     * Constants to mark the status of the cart object
     */
    const STATUS_CURRENT = 0;
    const STATUS_HISTORY = 1;

    protected $_lineitemstatus = EventgalleryLibraryLineitem::TYPE_ORDER;
    /**
     * @var string
     */
    protected $_lineitemcontainer_table = "Cart";

    public function __construct($object)
    {
        if (!is_object($object)) {
            throw new InvalidArgumentException("Can't create the cart object without a valid data object.");
        }

        $this->_user_id = $object->userid;
        $this->_lineitemcontainer = $object;

        $this->_loadLineItems();
        $this->_loadServiceLineItems();

        parent::__construct();

        $this->_deleteLineItemsOfDeletedImages();

    }

    /**
     * @param $lineitemid
     *
     * @return EventgalleryLibraryImagelineitem|null
     */
    function cloneLineItem($lineitemid)
    {
        /**
         * @var EventgalleryLibraryImagelineitem $lineitem
         */
        $lineitem = $this->getLineItem($lineitemid);

        // do not clone a not existing line item.
        if ($lineitem == NULL) {
            return null;
        }

        /**
         * @var EventgalleryLibraryFactoryImagelineitem $imageLineItemFactory
         */
        $imageLineItemFactory = EventgalleryLibraryFactoryImagelineitem::getInstance();
        $newLineitem = $imageLineItemFactory->copyLineItem($this->getId(), $lineitem);

        $newLineitem->setQuantity(1);

        $this->_updateLineItemContainer();

        return $newLineitem;
    }

    /**
     * adds an image to the cart and checks if this action is actually allowed
     * @param $foldername
     * @param $filename
     * @param int $count
     * @param null $typeid
     * @param bool $mergeNewLineItem defines if we need to merge the new line item with an existing one of the same type.
     * @return EventgalleryLibraryImagelineitem|null
     * @throws Exception
     */

    function addItem($foldername, $filename, $count = 1, $typeid = NULL, $mergeNewLineItem = true, $addQuantity = true)
    {

        if ($filename == NULL || $foldername == NULL) {
            throw new Exception("can't add item with invalid file or folder name");
        }

        /**
         * @var EventgalleryLibraryFactoryFile $fileFactory
         */
        $fileFactory = EventgalleryLibraryFactoryFile::getInstance();
        $file = $fileFactory->getFile($foldername, $filename);


        /* security check BEGIN */
        if (!$file->isPublished()) {
            throw new Exception("the item you try to add is not published.");
        }

        if (!$file->getFolder()->isCartable()) {
            throw new Exception("the item you try to add is not cartable.");
        }

        if (!$file->getFolder()->isVisible()) {
            throw new Exception("the item you try to add is not visible for you. You might want to login first.");
        }

        if (!$file->getFolder()->isAccessible()) {
            throw new Exception("the item you try to add is not accessible. You might need to enter a password to unlock the folder first.");
        }

        /* check of the folder allows the type id. take the first type if not specific type was given. */

        /*@var EventgalleryLibraryImagetype */
        $imageType = NULL;

        if ($typeid == NULL) {
            $imageType = $file->getFolder()->getImageTypeSet()->getDefaultImageType();
        } else {
            $imageType = $file->getFolder()->getImageTypeSet()->getImageType($typeid);
        }

        if ($imageType == NULL) {
            throw new Exception("the image type you specified for the new item is invalid. Reason for this can be that there is not image type set, no image type set image type assignments or the image type set does not contain the image type");
        }

        /* security check END */

        /**
         * @var EventgalleryLibraryFactoryImagelineitem $imageLineItemFactory
         */
        $imageLineItemFactory = EventgalleryLibraryFactoryImagelineitem::getInstance();


        $lineitem = $this->getLineItemByFileAndType($foldername, $filename, $typeid);


        if ($lineitem == null || $mergeNewLineItem == false) {
            $lineitem = $imageLineItemFactory->createLineitem($this->getId(), $foldername, $filename, $typeid, $count);
        } else {
            $lineitem->setQuantity($addQuantity?$lineitem->getQuantity() + $count : $count);
        }

        if ($count == 0) {
            $this->deleteLineItem($lineitem->getId());
            $lineitem = null;
        }

        $this->_updateLineItemContainer();

        return $lineitem;

    }

    /**
     * tries to find a line item in the database
     *
     * @param $foldername
     * @param $filename
     * @param $imagetypeid
     *
     * @return null|EventgalleryLibraryImagelineitem
     */
    public function getLineItemByFileAndType($foldername, $filename, $imagetypeid)
    {
        foreach($this->getLineItems() as $lineitem) {
            /**
             * @var EventgalleryLibraryImagelineitem $lineitem
             */
            if ($lineitem->getFolderName() == $foldername && $lineitem->getFileName()==$filename && $lineitem->getImageType()->getId()==$imagetypeid) {
                return $lineitem;
            }
        }
        return null;
    }

    /**
     * @param int $statusid
     */
    public function setStatus($statusid)
    {
        $this->_lineitemcontainer->statusid = $statusid;
        $this->_storeLineItemContainer();
    }

    /**
     * @return int
     */
    public function getStatus() {
        return $this->_lineitemcontainer->statusid;
    }

    public function _deleteLineItemsOfDeletedImages()
    {

        $obsoleteImageLineItemIds = [];

        foreach ($this->getLineItems() as $lineitem) {
            try {
                $lineitem->getFile();
            } catch (InvalidArgumentException $e) {
                // the image was deleted while this item is in the art.
                $obsoleteImageLineItemIds[] = $lineitem->getId();
            }
        }

        $this->deleteLineItems($obsoleteImageLineItemIds);
    }
}
