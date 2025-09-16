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

jimport( 'joomla.application.component.modeladmin' );
jimport('joomla.html.pagination');
jimport('joomla.filesystem.file');


/** @noinspection PhpUndefinedClassInspection */
class EventgalleryModelWatermark extends JModelAdmin
{

    public function getTable($type = 'Watermark', $prefix = 'EventgalleryTable', $config = array())
    {
        return JTable::getInstance($type, $prefix, $config);
    }	

    public function getForm($data = array(), $loadData = true) {

        $form = $this->loadForm('com_eventgallery.watermark', 'watermark', array('control' => 'jform', 'load_data' => $loadData));

        if (empty($form)){
            return false;
        }

        return $form;
    }

    protected function loadFormData()
    {
        // Check the session for previously entered form data.
        $data = JFactory::getApplication()->getUserState('com_eventgallery.edit.watermark.data', array());

        if (empty($data))
        {
            $data = $this->getItem();
        }
        
		if (method_exists($this, 'preprocessData')) {
        	$this->preprocessData('com_eventgallery.watermark', $data);
        }

        return $data;
    }

    public function setDefault($pks, $value) {

        $id = $pks[0];

        // reset all
        $db = JFactory::getDbo();
        $query = $db->getQuery(true);
        $query->update('#__eventgallery_watermark');
        $query->set($db->quoteName('default') . ' = 0');
        

        $db->setQuery($query);
        $db->execute();

        if ($value==1) {

            $db = JFactory::getDbo();
            $query = $db->getQuery(true);
            $query->update('#__eventgallery_watermark');
            $query->set($db->quoteName('default') . ' = 1');
            $query->where('id='.$db->quote($id));

            $db->setQuery($query);
            $db->execute();

        }
        return true;

    }

}
