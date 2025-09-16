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
jimport('joomla.application.categories');



class EventgalleryViewSingleimage extends EventgalleryLibraryCommonView
{
    /**
     * @var JRegistry
     */
    protected $params;
    protected $state;
    protected $use_comments;
    protected $currentItemid;
    /**
     * @var EventgalleryLibraryFolder
     */
    protected $folder;

    /**
     * @var EventgalleryLibraryFile
     */
    protected $file;

    protected $position;
    protected $imageset;
    protected $model;
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
        $this->params = $app->getParams();


        $this->catid = $app->input->getInt('catid', null);
        if ($this->catid == 0) {
            $this->catid = 'root';
        }

        $options = array();

        /**
         * @var JCategories $categories
         */
        $categories = JCategories::getInstance('Eventgallery', $options);

        /**
         * @var JCategoryNode $root
         */

        if (null != $this->catid) {
            $this->category = $categories->get($this->catid);
        }

        if ($this->category!=null && $this->category->published!=1) {
            throw new Exception(JText::_('JGLOBAL_CATEGORY_NOT_FOUND'), 404);
        }


        $model = $this->getModel('singleimage');
        $modelComment = JModelLegacy::getInstance('Comment', 'EventgalleryModel');
        $model->getData($app->input->getString('folder'), $app->input->getString('file'));

        $this->model = $model;
        $this->file = $model->file;

        if (!is_object($this->file) || $this->file->isPublished() != 1) {
            throw new Exception(JText::_('COM_EVENTGALLERY_SINGLEIMAGE_NO_PUBLISHED_MESSAGE'), 404);
        }

        $this->folder = $this->file->getFolder();
        $this->position = $model->position;

        /** Default Page fallback
         * @var JMenu $active
        */
        $active = $app->getMenu()->getActive();
        if (NULL == $active) {
            $this->params->merge($app->getMenu()->getDefault()->params);
            $active = $app->getMenu()->getDefault();
        }

        $this->currentItemid = $active->id;

        $this->use_comments = $this->params->get('use_comments');

        if ($this->use_comments) {

            $this->commentform = $modelComment->getForm();

        }

        if (!is_object($this->folder) || $this->folder->isPublished() != 1) {
            throw new Exception(JText::_('COM_EVENTGALLERY_EVENT_NO_PUBLISHED_MESSAGE'), 404);
        }        


        if (!isset($this->file) || strlen($this->file->getFileName()) == 0 || $this->file->isPublished() != 1) {
            throw new Exception(JText::_('COM_EVENTGALLERY_SINGLEIMAGE_NO_PUBLISHED_MESSAGE'), 404);
        }

        if (!$this->folder->isVisible()) {
            $user = JFactory::getUser();
            if ($user->guest) {

                $redirectUrl = JRoute::_("index.php?option=com_eventgallery&view=singleimage&folder=" . $this->folder->getFolderName()."&file=".$this->file->getFileName(), false);
                $redirectUrl = urlencode(base64_encode($redirectUrl));
                $redirectUrl = '&return='.$redirectUrl;
                $joomlaLoginUrl = 'index.php?option=com_users&view=login';
                $finalUrl = JRoute::_($joomlaLoginUrl . $redirectUrl, false);
                $app->redirect($finalUrl);
            } else {
                $this->setLayout('noaccess');
            }
        }

        $password = $app->input->getString('password', '');
        $accessAllowed = EventgalleryHelpersFolderprotection::isAccessAllowed($this->folder, $password);
        if (!$accessAllowed) {
            $app->redirect(
                JRoute::_("index.php?option=com_eventgallery&view=password&folder=" . $this->folder->getFolderName(), false)
            );
        }

        // remove the password from the url
        if (strlen($password)>0) {
            $app->redirect(
                JRoute::_("index.php?option=com_eventgallery&view=singleimage&folder=" . $this->folder->getFolderName()."&file=".$this->file->getFileName(), false)
            );
        }

        $this->imageset = $this->folder->getImageTypeSet();

        $pathway = $app->getPathWay();

        if ($active->query['view']=='categories') {
            EventgalleryHelpersCategories::addCategoryPathToPathway($pathway, $app->input->getInt('catid', 0), $this->folder->getCategoryId(), $this->currentItemid);
        }

        $pathway->addItem(        
            $this->folder->getDisplayName(), JRoute::_('index.php?option=com_eventgallery&view=event&folder=' . $this->folder->getFolderName())
        );
        $pathway->addItem($model->position . ' / ' . $model->overallcount);

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
        $title = null;

        // Because the application sets a default page title,
        // we need to get it from the menu item itself
        $menu = $menus->getActive();
        if ($menu)
        {
            $this->params->def('page_heading', $this->params->get('page_title', $menu->title));
        }
        

        $title = $this->params->get('page_title', '');

        if ($this->folder->getDisplayName()) {
            $title = $this->folder->getDisplayName();
        }
        
        $title .= " - ".$this->position.' / '.$this->folder->getFileCount();


        // Check for empty title and add site name if param is set
        if (empty($title)) {
            $title = $app->get('sitename');
        }
        elseif ($app->get('sitename_pagetitles', 0) == 1) {
            $title = JText::sprintf('JPAGETITLE', $app->get('sitename'), $title);
        }
        elseif ($app->get('sitename_pagetitles', 0) == 2) {
            $title = JText::sprintf('JPAGETITLE', $title, $app->get('sitename'));
        }
        if (empty($title)) {
            $title = $this->folder->getDisplayName();
        }
        
        if ($this->document) {

            $description = $this->folder->getMetadata()->get('metadesc');
            if (!empty($description)) {
                $this->document->setDescription($description);
            } 
            elseif ($this->folder->getText())
            {
                $this->document->setDescription(strip_tags($this->folder->getText()));
            }
            elseif (!$this->folder->getText() && $this->params->get('menu-meta_description'))
            {
                $this->document->setDescription($this->params->get('menu-meta_description'));
            }

            if ($this->params->get('menu-meta_keywords'))
            {
                $this->document->setMetaData('keywords', $this->params->get('menu-meta_keywords'));
            } else {
                $this->document->setMetaData('keywords', $this->folder->getMetadata()->get('metakey'));
            }

            if ($this->params->get('robots'))
            {
                $this->document->setMetaData('robots', $this->params->get('robots'));
            }

            $this->document->setTitle($title);

            $this->document->setMetaData('fragment', '!');
        }
    }

}
