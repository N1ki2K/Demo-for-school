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


class EventgalleryViewWatermarks extends EventgalleryLibraryCommonView
{    

    protected $items;
    protected $pagination;
    protected $state;

    /**
     * Display the view
     * @param null $tpl
     * @return bool|mixed
     */
    public function display($tpl = null)
    {
        $this->state = $this->get('State');
        $this->items = $this->get('Items');
        $this->pagination = $this->get('Pagination');

        // Check for errors.
        if (count($errors = $this->get('Errors'))) {
            throw new Exception(implode("\n", $errors));
        }
        $this->addToolbar();
        EventgalleryHelpersEventgallery::addSubmenu('watermarks');      
        $this->sidebar = JHtmlSidebar::render();
        return parent::display($tpl);
    }

    protected function addToolbar() {
        JToolbarHelper::title(   JText::_( 'COM_EVENTGALLERY_WATERMARKS' ), 'generic.png' );            
        JToolbarHelper::addNew('watermark.add');
        JToolbarHelper::editList('watermark.edit');
        JToolbarHelper::publishList('watermarks.publish');
        JToolbarHelper::unpublishList('watermarks.unpublish');
        JToolbarHelper::deleteList('Remove all selected Events?','watermarks.delete','Remove');
    }

}
