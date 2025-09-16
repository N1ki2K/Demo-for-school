<?php

/**
 * @package     Sven.Bluege
 * @subpackage  com_eventgallery
 *
 * @copyright   Copyright (C) 2005 - 2013 Sven Bluege All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */


defined('_JEXEC') or die;

class EventgalleryHelpersUsergroups
{

    /**
     * @var array of id=>name
     */
    static $userGroupNames;

    static $userGroupPaths;
    static $userGroups;


    /**
    * Returns an array of id=>name
    */
    public static function getUserGroupNames()
    {
        if (self::$userGroupNames == null ) {
        $db = JFactory::getDbo();
        $query = $db->getQuery(true)
            ->select('a.id AS value, a.title AS text')
            ->from('#__usergroups AS a');


        // Get the options.
        $db->setQuery($query);
        $objects = $db->loadObjectList();
        $userGroupNames = array();
        foreach($objects as $object) {
            $userGroupNames[$object->value] = $object->text;
        }

        self::$userGroupNames = $userGroupNames;

       }

       return self::$userGroupNames;
    }

    /**
     * Resolve an usergroup id into a name
     * @param $id
     * @return string
     */
    public static function getUserGroupName($id) {
        $userGroupNames = self::getUserGroupNames();
        return $userGroupNames[$id];
    }

    /**
     * Gets the parent groups that a leaf group belongs to in its branch back to the root of the tree
     * (including the leaf group id).
     *
     * @param   mixed  $groupId  An integer or array of integers representing the identities to check.
     *
     * @return  mixed  array with the parent user groups.
     *
     * @since   11.1
     */
    public static function getGroupPath($groupId)
    {
        // Preload all groups
        if (empty(self::$userGroups))
        {
            $db = JFactory::getDbo();
            $query = $db->getQuery(true)
                ->select('parent.id, parent.lft, parent.rgt')
                ->from('#__usergroups AS parent')
                ->order('parent.lft');
            $db->setQuery($query);
            self::$userGroups = $db->loadObjectList('id');
        }

        // Get parent groups and leaf group
        if (!isset(self::$userGroupPaths[$groupId]))
        {
            self::$userGroupPaths[$groupId] = array();

            foreach (self::$userGroups as $group)
            {
                if ($group->lft <= self::$userGroups[$groupId]->lft && $group->rgt >= self::$userGroups[$groupId]->rgt)
                {
                    self::$userGroupPaths[$groupId][] = $group->id;
                }
            }
        }

        return self::$userGroupPaths[$groupId];
    }

}