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

class EventgalleryModelImagetype extends JModelAdmin
{
    protected $text_prefix = 'COM_EVENTGALLERY';

    public function getTable($type = 'imagetype', $prefix = 'EventgalleryTable', $config = array())
    {
        return JTable::getInstance($type, $prefix, $config);
    }

    /**
     * Method to get the record form.
     *
     * @param array $data An optional array of data for the form to interogate.
     * @param boolean $loadData True if the form is to load its own data (default case), false if not.
     * @return JForm A JForm object on success, false on failure
     */
    public function getForm($data = array(), $loadData = true)
    {
        // Initialise variables.

        // Get the form.
        $form = $this->loadForm('com_eventgallery.imagetype', 'imagetype', array('control' => 'jform', 'load_data' => $loadData));

        if (empty($form)) {
            return false;
        }
        return $form;
    }

    protected function loadFormData()
    {
        // Check the session for previously entered form data.
        $data = JFactory::getApplication()->getUserState('com_eventgallery.edit.imagetype.data', array());

        if (empty($data))
        {
            $data = $this->getItem();
        }

		if (method_exists($this, 'preprocessData')) {
        	$this->preprocessData('com_eventgallery.imagetype', $data);
		}
		
        return $data;
    }

    public function delete(&$pks) {
        if (!parent::delete($pks)) {
            return false;
        }


        foreach($pks as $pk) {
            $db = JFactory::getDbo();
            $query = $db->getQuery(true);
            $query->delete('#__eventgallery_imagetypeset_imagetype_assignment');
            $query->where('imagetypeid = '.$db->quote($pk));
            $db->setQuery($query);
            $db->execute();
        }

        return true;

    }




   




}
