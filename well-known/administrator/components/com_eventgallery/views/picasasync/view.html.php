<?php 
/**
 * @package     Sven.Bluege
 * @subpackage  com_eventgallery
 *
 * @copyright   Copyright (C) 2005 - 2013 Sven Bluege All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */
defined('_JEXEC') or die;

jimport( 'joomla.application.component.view');
jimport( 'joomla.html.pagination');
jimport( 'joomla.html.html');


/** @noinspection PhpUndefinedClassInspection */
class EventgalleryViewPicasasync extends EventgalleryLibraryCommonView
{
    protected $item;

	function display($tpl = null)
	{
		$this->addToolbar();
		EventgalleryHelpersEventgallery::addSubmenu('events');		
		$this->sidebar = JHtmlSidebar::render();
		parent::display($tpl);
	}

	protected function addToolbar() {
		JToolbarHelper::title(  JText::_('COM_EVENTGALLERY_PICASASYNC') );
		JToolbarHelper::cancel( 'picasasync.cancel', 'Close' );
	}
}

