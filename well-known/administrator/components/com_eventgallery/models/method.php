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

class EventgalleryModelMethod extends JModelAdmin
{
    protected $text_prefix = 'COM_EVENTGALLERY';
    protected $table_type = null;
    protected $table_name = null;
    protected $form_name = null;
    protected $form_source = null;
    /**
     * @var EventgalleryLibraryFactoryMethod
     */
    protected $methodFactory = null;



    public function getTable($type = '', $prefix = 'EventgalleryTable', $config = array())
    {
        return JTable::getInstance($this->table_type, $prefix, $config);
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
        /**
         * @var JForm $form
         */
        $form = $this->loadForm($this->form_name, $this->form_source, array('control' => 'jform', 'load_data' => $loadData));

        if (empty($form)) {
            return false;
        }

        if ($form->getValue('id')!=0 || isset($data['id'])) {
            /**
             * @var EventgalleryLibraryInterfaceMethod $method
             */

            $id = $form->getValue('id');
            if (isset($data['id'])) {
                $id = $data['id'];
            }
            $method = $this->methodFactory->getMethodById($id, false);
            if ($method) {
                $form = $method->onPrepareAdminForm($form);
            }
        }

        return $form;
    }

    protected function loadFormData()
    {
        // Check the session for previously entered form data.
        $data = JFactory::getApplication()->getUserState('com_eventgallery.edit.'.$this->form_name.'.data', array());

        if (empty($data))
        {
            $data = $this->getItem();
        }
		
		if (method_exists($this, 'preprocessData')){
        	$this->preprocessData($this->form_source, $data);
		}
		
        return $data;
    }

    public function setDefault($pks, $value) {

        $id = $pks[0];
        if ($value==1) {

            $db = JFactory::getDbo();
            $query = $db->getQuery(true);
            $query->update($db->qn($this->table_name));
            $query->set($db->quoteName('default') . ' = 0');
            $db->setQuery($query);
            $db->execute();

            $db = JFactory::getDbo();
            $query = $db->getQuery(true);
            $query->update($db->qn($this->table_name));
            $query->set($db->quoteName('default') . ' = 1');
            $query->where('id='.$db->quote($id));

            $db->setQuery($query);
            $db->execute();

        }
        return true;

    }

    public function save($data) {
        $success = parent::save($data);
        $this->methodFactory->clearCache();
        if (isset($data['id'])) {
            /**
             * @var EventgalleryLibraryInterfaceMethod $method
             */

            $method = $this->methodFactory->getMethodById($data['id'], false);
            if ($method) {
                $success &= $method->onSaveAdminForm($data);
            }
        }

        return $success;
    }




   




}
