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

class EventgalleryLibraryEmailtemplate extends EventgalleryLibraryDatabaseObject
{

    /**
     * @var int
     */
    protected $_emailtemplate_id = NULL;

    /**
     * @var EventgalleryTableEmailtemplate
     */
    protected $_emailtemplate = NULL;

    /**
     * @param object $object
     */
    public function __construct($object)
    {

        if (!is_object($object)) {
            throw new InvalidArgumentException("can't create instance of email template because the given object is not an Object");
        }

        $this->_emailtemplate = $object;
        $this->_emailtemplate_id = $object->id;

        parent::__construct();
    }

    /**
     * @return int
     */
    public function getId() {
        return $this->_emailtemplate->id;
    }

    /**
     * @return bool
     */
    public function isPublished() {
        return $this->_emailtemplate->published==1;
    }

    /**
     * @return string
     */
    public function getSubject() {
        return $this->_emailtemplate->subject;
    }

    /**
     * @return string
     */
    public function getBody() {
        return $this->_emailtemplate->body;
    }

    /**
     * @return string
     */
    public function getLanguage() {
        return $this->_emailtemplate->language;
    }

    /**
     * @return string
     */
    public function getKey() {
        return $this->_emailtemplate->key;
    }

    /**
     * @return array
     */
    public function getAttachments() {
        $registry = new JRegistry;
        $registry->loadString($this->_emailtemplate->attachments);
        return $registry->toArray();
    }


}
