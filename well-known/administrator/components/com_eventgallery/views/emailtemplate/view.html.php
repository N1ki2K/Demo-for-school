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


class EventgalleryViewEmailtemplate extends EventgalleryLibraryCommonView
{
	protected $state;

	protected $item;

	protected $form;

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

		// Check for errors.
		if (count($errors = $this->get('Errors')))
		{
			throw new Exception(implode("\n", $errors));
		}

		$this->addToolbar();
		EventgalleryHelpersEventgallery::addSubmenu('emailtemplate');      
        $this->sidebar = JHtmlSidebar::render();
		return parent::display($tpl);
	}

	private function addToolbar() {
		$isNew		= ($this->item->id < 1);
		$text = $isNew ? JText::_( 'New' ) : JText::_( 'Edit' );
		JToolbarHelper::title(   JText::_( 'COM_EVENTGALLERY_EMAILTEMPLATE' ).': <small>[ ' . $text.' ]</small>' );
		$bar = JToolbar::getInstance('toolbar');
		
		JToolbarHelper::apply('emailtemplate.apply');			
		JToolbarHelper::save('emailtemplate.save');
		if ($isNew)  {			
			JToolbarHelper::cancel( 'emailtemplate.cancel' );
		} else {
			JToolbarHelper::cancel( 'emailtemplate.cancel', JText::_( 'JTOOLBAR_CLOSE' ) );
			$bar->appendButton('Link', 'mail', 'COM_EVENTGALLERY_BUTTON_SENDTESTMAIL_DESC',  JRoute::_('index.php?option=com_eventgallery&task=emailtemplate.sendtestmail&id='.$this->item->id), false);
            $bar->appendButton('Link', 'file', 'COM_EVENTGALLERY_BUTTON_RESETMAILTEMPLATE_DESC',  JRoute::_('index.php?option=com_eventgallery&view=emailtemplate&loaddefault=true&id='.$this->item->id), false);

		}
	}

}