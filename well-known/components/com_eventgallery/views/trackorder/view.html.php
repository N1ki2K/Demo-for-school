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


class EventgalleryViewTrackorder extends EventgalleryLibraryCommonView
{
    /**
     * @var JRegistry
     */
    protected $params;
    protected $state;
    protected $item;
    protected $loginform;
    protected $form;

    /**
     * @var EventgalleryLibraryCart
     */
    protected $cart;

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
        $this->state = $this->get('State');
        $this->item = $this->get('Item');
        $this->form = $this->get('Form');
        $this->params = $app->getParams();
       

        if (!$this->item) {
            $this->setLayout("default");
        }

        // Get the form.
        JForm::addFormPath(JPATH_BASE . '/components/com_users/models/forms');
        JForm::addFieldPath(JPATH_BASE . '/components/com_users/models/fields');


        $this->loginform = JForm::getInstance('com_users.login', 'login');


        $pathway = $app->getPathWay();
        $pathway->addItem(JText::_('COM_EVENTGALLERY_TRACKORDER_PATH'));


        $this->_prepareDocument();

        parent::display($tpl);
    }


    /**
     * Prepares the document
     */
    protected function _prepareDocument()
    {
        $app = JFactory::getApplication();
        $menus = $app->getMenu();
        $title = NULL;

        // Because the application sets a default page title,
        // we need to get it from the menu item itself
        $menu = $menus->getActive();
        if ($menu) {
            $this->params->def('page_heading', $this->params->get('page_title', $menu->title));
        }


        $title = $this->params->get('page_title', '');

        $title .= " - " . JText::_('COM_EVENTGALLERY_TRACKORDER_PATH');


        // Check for empty title and add site name if param is set
        if (empty($title)) {
            $title = $app->get('sitename');
        } elseif ($app->get('sitename_pagetitles', 0) == 1) {
            $title = JText::sprintf('JPAGETITLE', $app->get('sitename'), $title);
        } elseif ($app->get('sitename_pagetitles', 0) == 2) {
            $title = JText::sprintf('JPAGETITLE', $title, $app->get('sitename'));
        }


        if ($this->document) {

            $this->document->setTitle($title);

        }
    }

}
