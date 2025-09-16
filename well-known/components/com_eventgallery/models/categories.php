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

jimport( 'joomla.application.component.model' );

require_once(__DIR__.'/events.php');

class  EventgalleryModelCategories extends EventgalleryModelEvents
{
    /**
     * @param $category JCategoryNode
     * @param string $tags
     * @param string $sortAttribute
     * @param $usergroups
     * @param bool $recursive
     * @param bool $filterByUserGroups
     * @return mixed
     */
    function getSubCategories($category, $tags, $sortAttribute, $usergroups, $recursive, $filterByUserGroups) {

        $subCategories = $category->getChildren();
        $recursive = true;

        foreach($subCategories as $category) {
            $this->_entries = null;
            $events = $this->getEntries(false, 0, 0, $tags, $sortAttribute, $usergroups, $category->id, $recursive, $filterByUserGroups);
            $category->event = count($events)>0?  $events[0]: null;
        }

        return $subCategories;
    }



}
