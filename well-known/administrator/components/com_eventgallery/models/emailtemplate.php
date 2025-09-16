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
class EventgalleryModelEmailtemplate extends JModelAdmin
{

    public function getItem($pk = null) {
        $app = JFactory::getApplication();

        /**
         * @var EventgalleryTableEmailtemplate $item
         */
        $item = parent::getItem($pk);;

        if ($item!== false) {
            // Convert the params field to an array.
            $registry = new JRegistry;
            $registry->loadString($item->attachments);
            $item->attachments = $registry->toArray();
        }

        $item->renderedSubject = '';
        $item->renderedBody = '';
        $item->demodata = Array();

        /**
         * @var EventgalleryLibraryManagerEmailtemplate $emailtemplateMgr
         */
        $emailtemplateMgr = EventgalleryLibraryManagerEmailtemplate::getInstance();


        $loadDefault = $app->input->getCmd('loaddefault') == 'true';

        if (strlen($item->key)>0) {

            if (strlen(trim($item->body)) == 0 || $loadDefault) {
                $item->body = $emailtemplateMgr->getDefaultBody($item->key);
            }

            if (strlen(trim($item->subject)) == 0 || $loadDefault) {
                $item->subject = $emailtemplateMgr->getDefaultSubject($item->key);
            }

            $item->demodata = $emailtemplateMgr->getDemoData($item->key);
        }

        return $item;
    }

    public function getTable($type = 'Emailtemplate', $prefix = 'EventgalleryTable', $config = array())
    {
        return JTable::getInstance($type, $prefix, $config);
    }	

    public function getForm($data = array(), $loadData = true) {

        $form = $this->loadForm('com_eventgallery.emailtemplate', 'emailtemplate', array('control' => 'jform', 'load_data' => $loadData));

        if (empty($form)){
            return false;
        }

        return $form;
    }

    protected function loadFormData()
    {
        // Check the session for previously entered form data.
        $data = JFactory::getApplication()->getUserState('com_eventgallery.edit.emailtemplate.data', array());

        if (empty($data))
        {
            $data = $this->getItem();
        }
        
		if (method_exists($this, 'preprocessData')) {
        	$this->preprocessData('com_eventgallery.emailtemplate', $data);
        }

        return $data;
    }

}
