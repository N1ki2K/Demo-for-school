<?php 
/**
 * @package     Sven.Bluege
 * @subpackage  com_eventgallery
 *
 * @copyright   Copyright (C) 2005 - 2013 Sven Bluege All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */
defined('_JEXEC') or die;



class EventgalleryViewDocumentation extends EventgalleryLibraryCommonView
{

	function display($tpl = null)
	{

		EventgalleryHelpersEventgallery::addSubmenu('documentation');		
		$this->sidebar = JHtmlSidebar::render();
		$this->addToolbar();

		parent::display($tpl);
	}

	protected function addToolbar() {
		JToolbarHelper::title(   JText::_( 'COM_EVENTGALLERY_SUBMENU_DOCUMENTATION' ) );
	}



}

