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


class EventgalleryViewPaymentmethod extends EventgalleryLibraryCommonView
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
		EventgalleryHelpersEventgallery::addSubmenu('paymentmethod');      
        $this->sidebar = JHtmlSidebar::render();
		return parent::display($tpl);
	}

	private function addToolbar() {
		$isNew		= ($this->item->id < 1);
		$text = $isNew ? JText::_( 'New' ) : JText::_( 'Edit' );
		JToolbarHelper::title(   JText::_( 'COM_EVENTGALLERY_PAYMENTMETHOD' ).': <small>[ ' . $text.' ]</small>' );
		
		JToolbarHelper::apply('paymentmethod.apply');			
		JToolbarHelper::save('paymentmethod.save');
		if ($isNew)  {			
			JToolbarHelper::cancel( 'paymentmethod.cancel' );
		} else {
			JToolbarHelper::cancel( 'paymentmethod.cancel', JText::_( 'JTOOLBAR_CLOSE' ) );
		}

	}

}