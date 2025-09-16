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


class EventgalleryViewFiles extends EventgalleryLibraryCommonView
{

    protected $item;
    protected $items;
    protected $pagination;
    protected $state;
    protected $folder;
    protected $params;

    function display($tpl = null)
	{
        $this->item = $this->get('Item');
        $this->state		= $this->get('State');
        $this->items		= $this->get('Items');
        $this->pagination	= $this->get('Pagination');
        $this->params = JComponentHelper::getParams('com_eventgallery');

        $folderFactory = EventgalleryLibraryFactoryFolder::getInstance();
        $this->folder = $folderFactory->getFolder($this->item->folder);


        // Check for errors.
        if (count($errors = $this->get('Errors')))
        {
            throw new Exception(implode("\n", $errors));
        }

        $this->addToolbar();
        EventgalleryHelpersEventgallery::addSubmenu('files');      
        $this->sidebar = JHtmlSidebar::render();
        return parent::display($tpl);
	}

    protected function addToolbar() {
        $text = $this->item->folder;
        JToolbarHelper::title(   JText::_( 'COM_EVENTGALLERY_EVENTS' ).': <small><small>[ ' . $text.' ]</small></small>' );

        JToolbarHelper::cancel('files.cancel', 'Close');

        if ($this->folder->supportsImageDataEditing()) {
            JToolbarHelper::custom('files.publish', 'eg-published');
            JToolbarHelper::custom('files.unpublish', 'eg-published-inactive');

            JToolbarHelper::custom('files.allowcomments', 'eg-comments');
            JToolbarHelper::custom('files.disallowcomments', 'eg-comments-inactive');


            JToolbarHelper::custom('files.ismainimage', 'eg-mainimage');
            JToolbarHelper::custom('files.isnotmainimage', 'eg-mainimage-inactive');

            JToolbarHelper::custom('files.isnotmainimageonly', 'eg-mainimageonly');
            JToolbarHelper::custom('files.ismainimageonly', 'eg-mainimageonly-inactive');
        }

        JToolbarHelper::spacer(50);

        if ($this->folder->supportsFileDeletion()) {
            JToolbarHelper::deleteList(JText::_('COM_EVENTGALLERY_EVENT_IMAGE_ACTION_DELETE_ALERT'), 'files.delete');
        }
        $bar = JToolbar::getInstance('toolbar');
        if ($this->folder->isSortable()) {
            $bar->appendButton('Confirm', 'COM_EVENTGALLERY_EVENT_CLEAR_ORDERING_ALERT', 'trash', 'COM_EVENTGALLERY_EVENT_CLEAR_ORDERING', 'files.clearOrdering', false);
        }
        

        JToolbarHelper::spacer(100);
        $bar->appendButton('Link', 'edit', 'COM_EVENTGALLERY_BUTTON_EDIT_DESC',  JRoute::_('index.php?option=com_eventgallery&task=event.edit&id='.$this->item->id), false);
        if ($this->folder->supportsFileUpload()) {
            $bar->appendButton('Link', 'upload', 'COM_EVENTGALLERY_BUTTON_UPLOAD_DESC', JRoute::_('index.php?option=com_eventgallery&task=upload.upload&folderid=' . $this->item->id), false);
            $url = JUri::base().substr(JRoute::_('index.php?option=com_eventgallery&view=files&layout=sorting&tmpl=component&folderid='.$this->item->id), strlen(JUri::base(true)) + 1);
            $bar->appendButton('Custom','
<button data-toggle="modal" onclick="jQuery( \'#collapseModalSorting\' ).modal(\'show\'); return true;" class="btn btn-small">
	<span class="icon-cog" title="'.JText::_('COM_EVENTGALLERY_FILE_SORTING_POPUP').'"></span>
	'.JText::_('COM_EVENTGALLERY_FILE_SORTING_POPUP').'
</button>');
        }




    }
}
