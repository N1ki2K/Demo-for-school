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

abstract class EventgalleryLibraryFactoryMethod extends EventgalleryLibraryFactoryFactory
{
    /**
     * name of the sql table like #__foobar
     */
    protected $_methodtablename = null;

    /**
     * @var array
     */
    protected $_methods;

    /**
     * @var array
     */
    protected $_methods_published;

    /**
     * Determine an EventgalleryLibraryMethodsMethod object by a given ID.
     *
     * @param $id int the ID of an address
     * @param $publishedOnly
     * @return EventgalleryLibraryMethodsMethod
     */
    public function getMethodById($id, $publishedOnly) {
        $methods = $this->getMethods($publishedOnly);


        if (isset($methods[$id])) {
            return $methods[$id];
        }

        return null;
    }

    /**
     * @param bool $publishedOnly
     *
     * @return array
     */
    public function getMethods($publishedOnly = true)
    {

        if ($this->_methods == null) {

            $db = $this->db;
            $query = $db->getQuery(true);
            $query->select('*');
            $query->from($db->qn($this->_methodtablename));
            $query->order('ordering');
            $db->setQuery($query);
            $items = $db->loadObjectList();

            $this->_methods = array();
            $this->_methods_published = array();

            foreach ($items as $item) {
                /**
                 * @var EventgalleryLibraryInterfaceMethod $itemObject
                 */
                if (class_exists($item->classname)) {
                    $itemObject = new $item->classname($item);
                    if ($item->published == 1) {
                        $this->_methods_published[$itemObject->getId()] = $itemObject;
                    }
                    $this->_methods[$itemObject->getId()] = $itemObject;
                }
            }
        }
        if ($publishedOnly) {
            return $this->_methods_published;
        } else {
            return $this->_methods;
        }
    }


    /**
     * @return EventgalleryLibraryInterfaceMethod
     */
    public function getDefaultMethod()
    {
        $methods = $this->getMethods(true);
        foreach ($methods as $method) {
            /**
             * @var EventgalleryLibraryInterfaceMethod $method
             */
            if ($method->isDefault()) {
                return $method;
            }
        }

        $array_values = array_values($methods);
        if (isset($array_values[0])) {
            return $array_values[0];
        }

        return NULL;
    }

    public function clearCache() {
        $this->_methods = null;
        $this->_methods_published = null;
    }


}
