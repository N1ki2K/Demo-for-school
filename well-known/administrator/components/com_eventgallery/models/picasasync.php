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

jimport( 'joomla.application.component.modellist' );

class EventgalleryModelPicasasync extends JModelList
{

    /**
     * Checks if the foldername esists in the database
     *
     * @param $foldername
     * @return bool true if the folder exists in the database
     */
    public function eventExists($foldername) {

        $db = JFactory::getDbo();

        // update the file table
        $query = $db->getQuery(true)
            ->select('1')
            ->from($db->quoteName('#__eventgallery_folder'))
            ->where('folder=' . $db->quote($foldername));
        $db->setQuery($query);
        $db->execute();
        $affectedRows = $db->getAffectedRows();

        return $affectedRows>0?true: false;

    }

    public function addEvent($album) {

        $db = JFactory::getDbo();
        $db->setQuery('SELECT MAX(ordering) FROM #__eventgallery_folder');
        $max = $db->loadResult();

        /**
         * @var EventgalleryTableFolder $table
         */
        $table = JTable::getInstance('Folder', 'EventgalleryTable');

        $user = JFactory::getUser();
        $timestamp = strtotime($album->date);

        $table->folder = $album->folder;
        $table->description = $album->description;
        $table->published = 0;
        $table->userid = $user->id;
        $table->date = date('Y-m-d H:i:s',$timestamp);
        $table->created = date('Y-m-d H:i:s');
        $table->created = date('Y-m-d H:i:s');
        $table->ordering = $max + 1;
        $table->foldertypeid = 1;

        $table->store();


    }

}
