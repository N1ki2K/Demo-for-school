<?php

/**
 * @package     Sven.Bluege
 * @subpackage  com_eventgallery
 *
 * @copyright   Copyright (C) 2005 - 2013 Sven Bluege All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */


defined('_JEXEC') or die;

jimport('joomla.application.categories');

class EventgalleryHelpersCategories
{

    public static function addCategoryPathToPathway($pathway, $rootCatId, $catId, $menuItemId, $skipRoot = false) {
        // add the category path

        if ( $catId != $rootCatId) {
            $options = Array();
            $categories = JCategories::getInstance('Eventgallery', $options);
            // get the category and the path for the current folder
            /**
             * @var JCategoryNode $category
             */
            $category = $categories->get($catId);

            if ($category != null) {
                $path = $category->getPath();


                // search the path for
                foreach ($path as $pathItem) {
                    $temp = explode(':', $pathItem);
                    $currentCatId = $temp[0];
                    $category = $categories->get($currentCatId);
                    if (!$skipRoot || $currentCatId != $rootCatId) {
                        $pathway->addItem(EventgalleryHelpersCategories::getCategoryTitle($category), JRoute::_('index.php?option=com_eventgallery&view=categories&catid=' . (int)$currentCatId . '&Itemid=' . $menuItemId));
                    }
                }
            }
        }
    }

    /**
     * @param JCategoryNode $category
     * @return String
     */
    public static function getCategoryTitle($category) {
        $params = $category->getParams();
        if (!$params->exists('eventgallery_title')) {
            return $category->title;
        }

        $lc = new EventgalleryLibraryDatabaseLocalizablestring($params->get('eventgallery_title'));

        $lcTitle = $lc->get();

        if (empty($lcTitle)) {
            return $category->title;
        }

        return $lcTitle;
    }

    /**
     * @param JCategoryNode $category
     * @return String
     */
    public static function getCategoryDescription($category) {
        $params = $category->getParams();
        if (!$params->exists('eventgallery_description')) {
            return $category->description;
        }

        $lc = new EventgalleryLibraryDatabaseLocalizablestring($params->get('eventgallery_description'));

        $lcDescription = $lc->get();

        if (empty($lcDescription)) {
            return $category->description;
        }

        return $lcDescription;
    }
}