<?php

/**
 * @package     Sven.Bluege
 * @subpackage  com_eventgallery
 *
 * @copyright   Copyright (C) 2005 - 2013 Sven Bluege All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */


defined('_JEXEC') or die;

class EventgalleryHelpersTags
{

    /**
     * Checks if at least one needle tag is part of the tags string.
     * Returns false if the needle is empty
     *
     *
     * @param array $tags array like [TagObject, TagObject]
     * @param array $needleTags array like [0,1,2]
     * @return bool returns true if one element in the needeTags is contained in the tags
     */
    public static function checkTags($tags, $needleTags)
    {
        if (is_string($needleTags)) {
            return false;
        }

        if (count($needleTags) == 0) {
            return false;
        }

        $func = function($value) { return isset($value->tag_id)?$value->tag_id:$value; };


        $tagIds = array_map($func, $tags);
        $needleTagIds = array_map($func, $needleTags);

        $intersect = array_intersect($needleTagIds, $tagIds);

        if (count($intersect)>0) {
            return true;
        }

        // no match
        return false;

    }

}