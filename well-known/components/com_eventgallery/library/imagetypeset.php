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

class EventgalleryLibraryImagetypeset extends EventgalleryLibraryDatabaseObject
{

    /**
     * @var int
     */
    protected $_imagetypeset_id = NULL;

    /**
     * @var EventgalleryTableImagetypeset
     */
    protected $_imagetypeset = NULL;

    /**
     * @var array
     */
    protected $_imagetypes = NULL;

    /**
     * @var array
     */
    protected $_imagetypes_published = NULL;

    /**
     * @var int
     */
    protected $_defaultimagetype_id = NULL;

    /**
     * @param object $object
     */
    public function __construct($object)
    {
        if (!is_object($object)) {
            throw new InvalidArgumentException("Can't initialize Image Type Set object because of a missing Data Object.");
        }

        $this->_imagetypeset = $object;
        $this->_imagetypeset_id = $object->id;

        /**
         * @var EventgalleryLibraryFactoryImagetypeset $imagetypesetFactory
         */
        $imagetypesetFactory = EventgalleryLibraryFactoryImagetypeset::getInstance();

        $this->_imagetypes = $imagetypesetFactory->getImagetypes($object->id);
        $this->_imagetypes_published = $imagetypesetFactory->getImagetypes($object->id, true);
        $defaultImageType = $imagetypesetFactory->getDefaultImagetype($object->id);
        if (null != $defaultImageType) {
            $this->_defaultimagetype_id = $defaultImageType->getId();
        }

        parent::__construct();
    }

    /**
     * Returns the images types of this image type set
     *
     * @param bool $publishedOnly
     * @return array|null
     */
    public function getImageTypes($publishedOnly = false)
    {
        if ($publishedOnly) {
            return $this->_imagetypes_published;
        }
        return $this->_imagetypes;
    }

    /**
     * This method will return the imagetype with the given id.
     *
     * @param int $imagetypeid
     *
     * @return EventgalleryLibraryImagetype
     */
    public function getImageType($imagetypeid)
    {

        if (isset($this->_imagetypes[$imagetypeid])) {
            return $this->_imagetypes[$imagetypeid];
        }

        return null;

    }

    /**
     * @return EventgalleryLibraryImagetype
     */
    public function getDefaultImageType($publishedOnly = false)
    {
        if ($this->_defaultimagetype_id == NULL) {
            $result = array_values($this->getImageTypes($publishedOnly));
            if (isset($result[0])) {
                return $result[0];
            }
        } else {
            $imageType = $this->getImageType($this->_defaultimagetype_id);
            if ($imageType->isPublished())  {
                return $imageType;
            }
        }

        return null;
    }

    /**
     * @return int
     */
    public function getId() {
        return $this->_imagetypeset->id;
    }

    /**
     * @return bool
     */
    public function isPublished() {
        return $this->_imagetypeset->published==1;
    }

    /**
     * @return bool
     */
    public function isDefault() {
        return $this->_imagetypeset->default==1;
    }

    /**
     * @return string
     */
    public function getName() {
        return $this->_imagetypeset->name;
    }

    /**
     * @return string
     */
    public function getNote() {
        return $this->_imagetypeset->note;
    }

    /**
     * @return string
     */
    public function getDescription() {
        return $this->_imagetypeset->description;
    }

    /**
     * @return int
     */
    public function getImageTypeCount() {
        return count($this->_imagetypes);
    }


}
