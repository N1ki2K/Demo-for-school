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
class EventgalleryViewEvent extends EventgalleryLibraryCommonView
{
	protected $state;

	protected $item;

	protected $form;

	protected $folder;

    /**
     * Display the view
     * @param null $tpl
     * @return bool|mixed
     */
	public function display($tpl = null)
	{
		$this->state	= $this->get('State');
		$this->item		= $this->get('Item');
		$this->form		= $this->get('Form');

        /**
         * @var EventgalleryLibraryFactoryFolder $folderFactory
         */
        $folderFactory = EventgalleryLibraryFactoryFolder::getInstance();
        $this->folder = $folderFactory->getFolder($this->item->folder);

		// Check for errors.
		if (count($errors = $this->get('Errors')))
		{
			throw new Exception(implode("\n", $errors));
		}

		$this->addToolbar();
		EventgalleryHelpersEventgallery::addSubmenu('event');      
        $this->sidebar = JHtmlSidebar::render();
		return parent::display($tpl);
	}

	private function addToolbar() {
		$isNew		= ($this->item->id < 1);
		$text = $isNew ? JText::_( 'New' ) : JText::_( 'Edit' );
		$bar = JToolbar::getInstance('toolbar');
		
		JToolbarHelper::title(   JText::_( 'COM_EVENTGALLERY_EVENTS' ).': <small><small>[ ' . $text.' ]</small></small>' );
			
		JToolbarHelper::apply('event.apply');			
		JToolbarHelper::save('event.save');
		if ($isNew)  {			
			JToolbarHelper::cancel( 'event.cancel' );
		} else {
			JToolbarHelper::save2copy('event.save2copy');
			JToolbarHelper::cancel( 'event.cancel', JText::_( 'JTOOLBAR_CLOSE' ) );

		

				JToolbarHelper::spacer(100);
				$bar->appendButton('Link', 'folder', 'COM_EVENTGALLERY_BUTTON_FILES_DESC',  JRoute::_('index.php?option=com_eventgallery&view=files&folderid='.$this->item->id), false);
				if ($this->folder->supportsFileUpload() == true) {
					$bar->appendButton('Link', 'upload', 'COM_EVENTGALLERY_BUTTON_UPLOAD_DESC', JRoute::_('index.php?option=com_eventgallery&task=upload.upload&folderid=' . $this->item->id), false);
				}


		}




	}

}