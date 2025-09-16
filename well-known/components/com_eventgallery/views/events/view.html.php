<?php
/**
 * @package     Sven.Bluege
 * @subpackage  com_eventgallery
 *
 * @copyright   Copyright (C) 2005 - 2013 Sven Bluege All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */
defined('_JEXEC') or die;


jimport('joomla.application.component.view');


class EventgalleryViewEvents extends EventgalleryLibraryCommonView
{


    /**
     * @var JRegistry
     */
    public $params;
    protected $entries;
    protected $fileCount;
    protected $folderCount;
    protected $eventModel;
    protected $pageNav;
    protected $entriesCount;
    protected $currentItemid;

    protected $folder;


    /**
     * @var JDocument
     */
    public $document;


    function display($tpl = NULL)
    {
        /**
         * @var JSite $app
         */
        $app = JFactory::getApplication();

        $this->params = $app->getParams();

        /* Default Page fallback*/
        $active = $app->getMenu()->getActive();
        if (NULL == $active) {
            $this->params->merge($app->getMenu()->getDefault()->params);
            $active = $app->getMenu()->getDefault();
        }

        $this->currentItemid = $active->id;

        $entriesPerPage = $this->params->get('max_events_per_page', 12);

        $filterEventsByUserGroup = $this->params->get('show_usergroup_protected_events_in_list', 0) == 0;

        $model = $this->getModel('events');
        $eventModel = JModelLegacy::getInstance('Event', 'EventgalleryModel');

        $recursive = $this->params->get('show_items_per_category_recursive', false);

        $user = JFactory::getUser();
        $usergroups = JUserHelper::getUserGroups($user->id);

        $entries = $model->getEntries(true, $app->input->getInt('start', 0), $entriesPerPage, $this->params->get('tags'), $this->params->get('sort_events_by'), $usergroups, $this->params->get('catid', null), $recursive, $filterEventsByUserGroup);

        $this->pageNav = $model->getPagination();

        $this->entries = $entries;
        $this->eventModel = $eventModel;

        $this->_prepareDocument();

        parent::display($tpl);
    }

    /**
     * Prepares the document
     */
    protected function _prepareDocument()
    {
        $app    = JFactory::getApplication();
        $menus  = $app->getMenu();
        $title  = null;

        // Because the application sets a default page title,
        // we need to get it from the menu item itself
        $menu = $menus->getActive();
        if($menu)
        {
            $this->params->get('page_heading', $this->params->get('page_title', $menu->title));
        }

        $title = $this->params->get('page_title', '');
        if (empty($title)) {
            $title = $app->get('sitename');
        }
        elseif ($app->get('sitename_pagetitles', 0) == 1) {
            $title = JText::sprintf('JPAGETITLE', $app->get('sitename'), $title);
        }
        elseif ($app->get('sitename_pagetitles', 0) == 2) {
            $title = JText::sprintf('JPAGETITLE', $title, $app->get('sitename'));
        }
        $this->document->setTitle($title);

        if ($this->params->get('menu-meta_description'))
        {
            $this->document->setDescription($this->params->get('menu-meta_description'));
        }

        if ($this->params->get('menu-meta_keywords'))
        {
            $this->document->setMetaData('keywords', $this->params->get('menu-meta_keywords'));
        }

        if ($this->params->get('robots'))
        {
            $this->document->setMetaData('robots', $this->params->get('robots'));
        }
    }

}
