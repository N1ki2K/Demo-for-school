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

jimport( 'joomla.application.component.view');

/** @noinspection PhpUndefinedClassInspection */
class EventgalleryViewSystemcheck extends EventgalleryLibraryCommonView
{

	protected $params;
	protected $schemaversions;
	protected $installedextensions;
    protected $doShowLogs = false;

	function display($tpl = null)
	{				
        /**
		 * @var eventgalleryModelSystemcheck $model
		 */
		$model = $this->getModel();
		$this->schemaversions = $model->getSchemaversions();
		$this->installedextensions = $model->getInstalledextensions();
		$this->changeset = $model->getChangeSet();
        $this->changeseterrors = $this->changeset->check();
        $app = JFactory::getApplication();
        $this->doShowLogs = $app->input->getBool('showlogs', false);

		$this->params = JComponentHelper::getParams('com_eventgallery');
		EventgalleryHelpersEventgallery::addSubmenu('systemcheck');
		$this->sidebar = JHtmlSidebar::render();
		$this->addToolbar();
		parent::display($tpl);
	}

	protected function addToolbar() {

		JToolbarHelper::title(   JText::_( 'COM_EVENTGALLERY_EVENTGALLERY' ) . " ". EVENTGALLERY_VERSION . ' (build ' . EVENTGALLERY_VERSION_SHORTSHA . ')', 'generic.png' );

	}
}

