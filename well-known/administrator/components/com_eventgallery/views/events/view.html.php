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
jimport( 'joomla.html.pagination');


/** @noinspection PhpUndefinedClassInspection */
class EventgalleryViewEvents extends EventgalleryLibraryCommonView
{

	protected $items;
	protected $pagination;
    protected $state;

	function display($tpl = null)
	{				
		// Get data from the model
        $this->state = $this->get('State');
        $this->items = $this->get('Items');
        $this->pagination = $this->get('Pagination');

        // Check for errors.
        if (count($errors = $this->get('Errors'))) {
            throw new Exception(implode("\n", $errors));
        }

        if ($this->getLayout() !== 'contentpluginbutton' || $this->getLayout() !== 'imagecontentpluginbutton') {
            $this->addToolbar();
            EventgalleryHelpersEventgallery::addSubmenu('events');
            $this->sidebar = JHtmlSidebar::render();
        }

        return parent::display($tpl);
	}

	protected function addToolbar() {

		JToolbarHelper::title(   JText::_( 'COM_EVENTGALLERY_EVENTS' ), 'generic.png' );
		//JToolbarHelper::deleteList();
		JToolbarHelper::addNew('event.add');
		JToolbarHelper::editList('event.edit');
		JToolbarHelper::publishList('events.publish');
		JToolbarHelper::unpublishList('events.unpublish');
        JToolbarHelper::publishList('events.cartable','COM_EVENTGALLERY_EVENT_CARTABLE');
        JToolbarHelper::unpublishList('events.notcartable','COM_EVENTGALLERY_EVENT_NOT_CARTABLE');
		JToolbarHelper::deleteList('Remove all selected Events?','events.delete','Remove');
		JToolbarHelper::preferences('com_eventgallery', '550');

		JToolbarHelper::spacer(100);

		$bar = JToolbar::getInstance('toolbar');

		// Add a trash button.
				
		$bar->appendButton('Link', 'trash', 'COM_EVENTGALLERY_SUBMENU_CLEAR_CACHE',  JRoute::_('index.php?option=com_eventgallery&view=cache'), false);		
		$bar->appendButton('Link', 'checkin', 'COM_EVENTGALLERY_SUBMENU_SYNC_DATABASE',  JRoute::_('index.php?option=com_eventgallery&view=sync'), false);


        JHtml::_('bootstrap.modal', 'collapseModal');
        $title = JText::_('JTOOLBAR_BATCH');

        // Instantiate a new JLayoutFile instance and render the batch button
        $layout = new JLayoutFile('joomla.toolbar.batch');

        /** @noinspection PhpParamsInspection */
        $dhtml = $layout->render(array('title' => $title, 'height' => 200));
        $bar->appendButton('Custom', $dhtml, 'batch');

        JHtmlSidebar::addFilter(
            JText::_('COM_EVENTGALLERY_EVENT_FILTER_TAG'),
            'filter_tag',
            JHtml::_('select.options', JHtml::_('tag.tags', array('filter.published' => array(1))), 'value', 'text', $this->state->get('filter.tag'), true)
        );

        /**
         * @var EventgalleryLibraryFactoryFoldertype $folderTypeFactory
         */
        $folderTypeFactory = EventgalleryLibraryFactoryFoldertype::getInstance();

        $options= array();
        /**
         * @var EventgalleryLibraryFoldertype $folderType
         */
        foreach($folderTypeFactory->getFolderTypes(true) as $folderType) {
            $options[] = JHtml::_('select.option', $folderType->getId(), $folderType->getDisplayName());
        }
        $options[] = JHtml::_('select.option', '*', 'JALL');

        JHtmlSidebar::addFilter(
            JText::_('COM_EVENTGALLERY_EVENT_FILTER_TYPE'),
            'filter_type',
            JHtml::_('select.options', $options, 'value', 'text', $this->state->get('filter.type'), true)
        );

        JHtmlSidebar::addFilter(
            JText::_('JOPTION_SELECT_CATEGORY'),
            'filter_category',
            JHtml::_('select.options', JHtml::_('category.options', 'com_eventgallery'), 'value', 'text', $this->state->get('filter.category'))
        );



	}

    /**
     * Returns an array of fields the table can be sorted by
     *
     * @return  array  Array containing the field name to sort by as the key and display text as value
     *
     * @since   3.0
     */
    protected function getSortFields()
    {
        return array(
            'folder' => JText::_('COM_EVENTGALLERY_EVENTS_FOLDERNAME'),
            'date' => JText::_('COM_EVENTGALLERY_EVENTS_EVENT_DATE'),
            'ordering' => JText::_('COM_EVENTGALLERY_EVENTS_ORDER'),
            'published' => JText::_('COM_EVENTGALLERY_EVENTS_PUBLISHED'),
            'cartable' => JText::_('COM_EVENTGALLERY_EVENTS_CARTABLE'),
            'hits' => JText::_('COM_EVENTGALLERY_EVENTS_HITS'),
            'catid' => JText::_('COM_EVENTGALLERY_EVENTS_CATEGORY')
        );
    }
}

