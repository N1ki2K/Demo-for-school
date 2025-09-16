<?php 
/**
 * @package     Sven.Bluege
 * @subpackage  com_eventgallery
 *
 * @copyright   Copyright (C) 2005 - 2013 Sven Bluege All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */
defined('_JEXEC') or die;

/** @noinspection PhpUndefinedClassInspection */
class EventgalleryViewS3 extends EventgalleryLibraryCommonView
{

    protected $folders;

	function display($tpl = null)
	{

        $this->folders = $this->get('Folders');

        $this->addToolbar();
		EventgalleryHelpersEventgallery::addSubmenu('overview');		
		$this->sidebar = JHtmlSidebar::render();
		parent::display($tpl);
	}

	protected function addToolbar() {
		$bar = JToolbar::getInstance('toolbar');
		JToolbarHelper::title(   JText::_('COM_EVENTGALLERY_SUBMENU_S3') );
		JToolbarHelper::cancel( 's3.cancel', 'Close' );
		$bar->appendButton('Link', 'checkin', 'COM_EVENTGALLERY_SUBMENU_SYNC_DATABASE',  JRoute::_('index.php?option=com_eventgallery&view=sync'), false);
	}
}

