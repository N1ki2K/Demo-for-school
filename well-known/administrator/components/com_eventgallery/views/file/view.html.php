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
class EventgalleryViewFile extends EventgalleryLibraryCommonView
{
	protected $state;

	protected $item;

	protected $form;

    protected $file;

	protected $isModal;

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

		$app = JFactory::getApplication();

		$this->isModal = $app->input->getString('tmpl', 'default') == 'component';

        /**
         * @var EventgalleryLibraryFactoryFile $fileFactory
         */
        $fileFactory = EventgalleryLibraryFactoryFile::getInstance();
        $this->file = $fileFactory->getFile($this->item->folder, $this->item->file);

		// Check for errors.
		if (count($errors = $this->get('Errors')))
		{
			throw new Exception(implode("\n", $errors));
		}

		$this->addToolbar();
		EventgalleryHelpersEventgallery::addSubmenu('file');
		$this->sidebar = JHtmlSidebar::render();

		if ($this->isModal) {
			$tpl = 'modal';
		}

		return parent::display($tpl);
	}

	private function addToolbar() {
		$text = JText::_( 'Edit' ) . ' ' . $this->item->file;

		JToolbarHelper::title(   JText::_( 'COM_EVENTGALLERY_FILES' ).': <small>[ ' . $text.' ]</small>' );

		JToolbarHelper::apply('file.apply');
		JToolbarHelper::save('file.save');
		JToolbarHelper::cancel('file.cancel', JText::_('JTOOLBAR_CLOSE'));

	}

}