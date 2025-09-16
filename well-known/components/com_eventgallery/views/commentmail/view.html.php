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


class EventgalleryViewCommentMail extends EventgalleryLibraryCommonView
{
    protected $file;
    protected $newComment;


    function display($tpl = NULL)
    {
        $this->_loadData();
        parent::display($tpl);
    }

    function loadTemplate($tpl = NULL)
    {
        $this->_loadData();
        return parent::loadTemplate($tpl);
    }

    function _loadData()
    {
        $app = JFactory::getApplication();
        $model = $this->getModel();
        $newComment = $model->getData($app->input->getInt('newCommentId'));
        $file = $model->getFile($newComment->id);


        $this->newComment = $newComment;
        $this->file = $file;
    }
}

