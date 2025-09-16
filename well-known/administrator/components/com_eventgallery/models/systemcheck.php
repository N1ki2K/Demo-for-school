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

class eventgalleryModelSystemcheck  extends JModelList
{
    public function getInstalledextensions() {
        // Get the extension ID
        $db = JFactory::getDbo();

        $query = $db->getQuery(true);
        $query->select('extension_id, name')
            ->from('#__extensions')
            ->where($db->qn('element')." like '%eventgallery%'");
        $db->setQuery($query);
        return $db->loadAssocList();
    }

    public function getSchemaversions() {

        // Get the extension ID
        $db = JFactory::getDbo();

        $query = $db->getQuery(true);
        $query->select('extension_id')
            ->from('#__extensions')
            ->where($db->qn('element').' = '.$db->q('com_eventgallery') . ' AND type='. $db->q('component'));
        $db->setQuery($query);
        $eid = $db->loadResult();

        if ($eid != null) {
            // Get the schema version
            $query = $db->getQuery(true);
            $query->select('extension_id, version_id')
                ->from('#__schemas')
                ->where('extension_id = ' . $db->quote($eid));
            $db->setQuery($query);
            return $db->loadAssocList();
        }

        return "nothing found";
    }

    public function getChangeSet() {
        $folder = JPATH_ADMINISTRATOR . '/components/com_eventgallery/sql/updates/';
        $db = JFactory::getDbo();

        try
        {
            $changeSet = JSchemaChangeset::getInstance($db, $folder);
        }
        catch (RuntimeException $e)
        {
            JFactory::getApplication()->enqueueMessage($e->getMessage(), 'warning');

            return false;
        }
        return $changeSet;
    }

}
