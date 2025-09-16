<?php

/**
 * @package     Sven.Bluege
 * @subpackage  com_eventgallery
 *
 * @copyright   Copyright (C) 2005 - 2013 Sven Bluege All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */


defined('_JEXEC') or die;

class EventgalleryHelpersTextsplitter
{

    /**
     * split the text separated by <hr id="system-readmore">
     * If no hr is available, the intro and the full text returns the initial text
     *
     * @param $initialtext
     * @return \stdClass
     */
    public static function split($initialtext) {

       $pattern = '#<hr\s+id=("|\')system-readmore("|\')\s*\/*>#i';
       $tagPos = preg_match($pattern, $initialtext);

       if ($tagPos == 0)
       {
           $introtext = $initialtext;
           $fulltext = $initialtext;
       }
       else
       {
           list ($introtext, $fulltext) = preg_split($pattern, $initialtext, 2);
       }

       $result = new stdClass();
       $result->introtext = $introtext;
       $result->fulltext = $fulltext;

       return $result;

    }

}