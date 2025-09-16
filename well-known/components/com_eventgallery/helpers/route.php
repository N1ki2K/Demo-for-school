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

class EventgalleryHelpersRoute
{
    /**
     * creates a link based on a category id
     * @param $catid
     * @param null $itemid
     * @throws Exception
     * @return string
     */
    public static function createCategoryRoute($catid, $itemid = null) {

        if ($itemid == null) {
            $app = JFactory::getApplication();
            $menus = $app->getMenu('site');
            /**
             * @var JLanguage $lang
             */
            $lang = JFactory::getLanguage();
            $language = $lang->getTag();


            $component = JComponentHelper::getComponent('com_eventgallery');

            $attributes = array('component_id');
            $values = array($component->id);

            // take the current lang into account
            $attributes[] = 'language';
            $values[] = array($language, '*');


            $items = $menus->getItems($attributes, $values);
            $itemid = NULL;
            $foundViewType = NULL;
            $options = array();
            $categories = JCategories::getInstance('Eventgallery', $options);

            foreach ($items as $item) {
                if (isset($item->query) && isset($item->query['view'])) {
                    $view = $item->query['view'];

                    if ($view == 'categories') {

                        // check the category reference
                        // the categories view uses the catid as query parameter, the events view as param
                        if (isset($item->query['catid'])) {
                            $menuItemCatid = $item->query['catid'];
                        } else {
                            $menuItemCatid = 0;
                        }
                        // if no category id is defined, this menu item would work
                        if ( null==$catid || $menuItemCatid  == 0) {
                            $itemMatches = true;
                        } else {

                            /**
                             * @var JCategoryNode $category
                             */

                            // get the category and the path for the current folder
                            $category = $categories->get($catid);
                            $path = $category->getPath();
                            $categoryMatches = false;

                            // search the path for
                            foreach($path as $pathItem) {
                                $temp = explode(':', $pathItem);
                                $currentCatId = $temp[0];
                                if ($menuItemCatid == $currentCatId) {
                                    $categoryMatches = true;
                                    break;
                                }
                            }

                            $itemMatches = $categoryMatches;
                        }

                        // set the necessary parameters if the current item is valid
                        if ($itemMatches) {
                            $itemid = $item->id;
                        }
                    }



                }

                if ($itemid != NULL) {
                    break;
                }
            }
        }


        $url = 'index.php?option=com_eventgallery&view=categories&catid='.$catid;

        // if not found, return language specific home link
        if ($itemid != NULL) {
            $url .= '&Itemid=' . $itemid;
        }

        return $url;
    }

    /**
     * create the route for a ucm link like from the tag component.
     *
     * @param $id
     * @param int $catid
     * @param int $language
     */
    public static function getEventRoute($id, $catid = 0, $language = 0) {

        $temp = explode(':', $id);
        $id  = $temp[0];

        $db    = JFactory::getDbo();
        $query = $db->getQuery(true)
            ->select('folder')
            ->from('#__eventgallery_folder')
            ->where('id=' . $db->quote($id));

        $db->setQuery($query);
        $row = $db->loadObject();

        return self::createEventRoute($row->folder, null, null, null);
    }

    /**
     * creates a link to an event
     * @param $foldername
     * @param array $tags
     * @param $catid
     * @param null $itemid
     * @params String $targetLanguageCode
     * @throws Exception
     * @return string
     */
    public static function createEventRoute($foldername, $tags, $catid, $itemid = null, $targetLanguageCode = null)
    {

        $foundViewType = NULL;

        if ($itemid == null) {
            $app = JFactory::getApplication();
            $menus = $app->getMenu('site');
            /**
             * @var JLanguage $lang
             */
            $lang = JFactory::getLanguage();

            $language = $lang->getTag();

            if ($targetLanguageCode != null) {
                $language = $targetLanguageCode;
            }

            $component = JComponentHelper::getComponent('com_eventgallery');

            $attributes = array('component_id');
            $values = array($component->id);

            // take the current lang into account
            $attributes[] = 'language';
            $values[] = array($language, '*');


            $items = $menus->getItems($attributes, $values);
            $itemid = NULL;
            $options = array();
            $categories = JCategories::getInstance('Eventgallery', $options);

            foreach ($items as $item) {
                if (isset($item->query) && isset($item->query['view'])) {
                    $view = $item->query['view'];

                    if ($view == 'events' || $view == 'categories') {

                        // check the tags
                        if (count($item->params->get('tags', array())) == 0) {
                            $itemMatches = true;
                        } else {
                            if (EventgalleryHelpersTags::checkTags($item->params->get('tags', array()), $tags)) {
                                $itemMatches = true;
                            } else {
                                $itemMatches = false;
                            }
                        }

                        // check the category reference
                        // the categories view uses the catid as query parameter, the events view as param
                        if ($view=='categories' && isset($item->query['catid'])) {
                            $menuItemCatid = $item->query['catid'];
                        } else {
                            $menuItemCatid = $item->params->get('catid', 0);
                        }
                        // if no category id is defined, this menu item would work
                        if ( null==$catid || $menuItemCatid  == 0) {
                            $itemMatches = $itemMatches && true;
                        } else {

                            /**
                             * @var JCategoryNode $category
                             */

                            // get the category and the path for the current folder
                            $category = $categories->get($catid);
                            if ($category != null) {
                                $path = $category->getPath();
                                $categoryMatches = false;

                                // search the path for
                                foreach ($path as $pathItem) {
                                    $temp = explode(':', $pathItem);
                                    $currentCatId = $temp[0];
                                    if ($menuItemCatid == $currentCatId) {
                                        $categoryMatches = true;
                                        break;
                                    }
                                }

                                $itemMatches = $itemMatches && $categoryMatches;
                            }

                        }

                        // set the necessary parameters if the current item is valid
                        if ($itemMatches) {
                            $itemid = $item->id;
                            $foundViewType = $view;
                        }
                    }

                    if ($view == 'event' && isset($item->query['folder']) && $item->query['folder'] == $foldername) {
                        $itemid = $item->id;
                        $foundViewType = $view;
                    }

                }

                if ($itemid != NULL) {
                    break;
                }
            }
        }

        $url = 'index.php?option=com_eventgallery&view=event&folder=' . $foldername ;

        // if not found, return language specific home link
        if ($itemid != NULL) {
            // if this is an event view we don't need to specific additional data.
            if ($foundViewType == 'event') {
                return 'index.php?Itemid=' . $itemid;
            }
            $url .= '&Itemid=' . $itemid;
        }




        return $url;
    }
}

abstract class EventgalleryHelperRoute
{
    public static function getCategoryRoute($catid, /** @noinspection PhpUnusedParameterInspection */$language = 0) {
        if ($catid instanceof JCategoryNode)
        {
            $id = $catid->id;
            $category = $catid;
        }
        else
        {
            $id = (int) $catid;
            $category = JCategories::getInstance('Eventgallery')->get($id);
        }

        if ($id < 1 || !($category instanceof JCategoryNode))
        {
            return '';
        }

        $link = EventgalleryHelpersRoute::createCategoryRoute($id);

        return $link;
    }

}