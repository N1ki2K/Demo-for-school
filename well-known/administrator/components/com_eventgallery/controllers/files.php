<?php
/**
 * @package     Sven.Bluege
 * @subpackage  com_eventgallery
 *
 * @copyright   Copyright (C) 2005 - 2013 Sven Bluege All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

// no direct access
defined('_JEXEC') or die('Restricted access');

jimport( 'joomla.application.component.controlleradmin' );

class EventgalleryControllerFiles extends JControllerAdmin
{

    protected $_anchor = "";

    public function __construct($config = array())
    {
        parent::__construct($config);

        $cids = $this->input->post->get('cid', array(), 'array');
        if (isset($cids[0])) {
            $this->_anchor = '#'.$cids[0];
        }


        $this->registerTask('allowcomments', 'allowComments');
        $this->registerTask('disallowcomments', 'allowComments');
        $this->registerTask('isnotmainimageonly', 'isMainImageOnly');
        $this->registerTask('ismainimageonly', 'isMainImageOnly');
        $this->registerTask('isnotmainimage', 'isMainImage');
        $this->registerTask('ismainimage', 'isMainImage');

    }


    /**
     * Proxy for getModel.
     * @param string $name
     * @param string $prefix
     * @param array $config
     * @return object
     */
    public function getModel($name = 'File', $prefix ='EventgalleryModel', $config = array('ignore_request' => true))
    {
        $model = parent::getModel($name, $prefix, $config);
        return $model;
    }

    function cancel() {
        $this->setRedirect( 'index.php?option=com_eventgallery&view=events');
    }

    /**
     * function to publish a single file/multiple files
     *
     */
    function publish()
    {
       parent::publish();
       $this->setRedirect( 'index.php?option=com_eventgallery&view=files&folderid='.$this->input->getString('folderid').$this->_anchor);
    }

    function saveorder()
    {
        parent::saveorder();
        $this->setRedirect( 'index.php?option=com_eventgallery&view=files&folderid='.$this->input->getString('folderid'));
    }

    function reorder()
    {
        parent::reorder();
        $this->setRedirect( 'index.php?option=com_eventgallery&view=files&folderid='.$this->input->getString('folderid').$this->_anchor);
    }

    function delete()
    {
        parent::delete();
        $this->setRedirect( 'index.php?option=com_eventgallery&view=files&folderid='.$this->input->getString('folderid'));
    }

    function clearOrdering() {

        JSession::checkToken() or jexit(JText::_('JINVALID_TOKEN'));
        /**
         * @var EventgalleryModelFile $model
         */
        $model = $this->getModel();
        $model->clearOrdering($this->input->getString('folderid'));
        $msg = JText::_('COM_EVENTGALLERY_EVENT_CLEAR_ORDERING_SUCCESS');
        $this->setRedirect( 'index.php?option=com_eventgallery&view=files&folderid='.$this->input->getString('folderid'), $msg);
    }

    function sort() {
        $params = JComponentHelper::getParams('com_eventgallery');

        $sortAttribute = $this->input->getString('sortattribute');
        $sortDirection = $this->input->getString('sortdirection');

        if (empty($sortAttribute)) {
            $sortAttribute = $params->get('sort_files_by_column','');
        }
        if (empty($sortDirection)) {
            $sortDirection = $params->get('sort_files_by_direction', 'ASC');
        }

        $folderid = $this->input->getString('folderid');
        $model = $this->getModel();
        $affectedRows = $model->sort($folderid, $sortAttribute, $sortDirection);
        $msg = JText::sprintf('COM_EVENTGALLERY_EVENT_ORDERING_SUCCESS', $sortAttribute, $sortDirection, $affectedRows);
        $this->setRedirect( 'index.php?option=com_eventgallery&view=files&folderid='.$folderid, $msg);
    }


     public function allowComments() {
        $cid = JFactory::getApplication()->input->get('cid', array(), 'array');
        $data = array('allowcomments' => 1, 'disallowcomments' => 0);
        $task = $this->getTask();
        $value = JArrayHelper::getValue($data, $task, 0, 'int');
        if (!is_array($cid) || count($cid) < 1)
        {
            JLog::add(JText::_($this->text_prefix . '_NO_ITEM_SELECTED'), JLog::WARNING, 'jerror');
        }
        else
        {
            // Get the model.
            $model = $this->getModel();

            // Make sure the item ids are integers
            jimport('joomla.utilities.arrayhelper');
            JArrayHelper::toInteger($cid);

            // Remove the items.
            if ($model->allowComments($cid, $value))
            {
                if ($value == 1)
                {
                    $ntext = $this->text_prefix . '_N_ITEMS_ALLOWEDCOMMENTS';
                }
                else
                {
                    $ntext = $this->text_prefix . '_N_ITEMS_DISALLOWEDCOMMENTS';
                }
                $this->setMessage(JText::plural($ntext, count($cid)));
            }
            else
            {
                $this->setMessage($model->getError());
            }
        }
        $this->setRedirect( 'index.php?option=com_eventgallery&view=files&folderid='.$this->input->getString('folderid').$this->_anchor);
    }
   
    public function isMainImage() {
        $cid = JFactory::getApplication()->input->get('cid', array(), 'array');
        $data = array('ismainimage' => 1, 'isnotmainimage' => 0);
        $task = $this->getTask();
        $value = JArrayHelper::getValue($data, $task, 0, 'int');
        if (!is_array($cid) || count($cid) < 1)
        {
            JLog::add(JText::_($this->text_prefix . '_NO_ITEM_SELECTED'), JLog::WARNING, 'jerror');
        }
        else
        {
            // Get the model.
            $model = $this->getModel();

            // Make sure the item ids are integers
            jimport('joomla.utilities.arrayhelper');
            JArrayHelper::toInteger($cid);

            // Remove the items.
            if ($model->isMainImage($cid, $value))
            {
                if ($value == 1)
                {
                    $ntext = $this->text_prefix . '_N_ITEMS_ISMAINIMAGE';
                }
                else
                {
                    $ntext = $this->text_prefix . '_N_ITEMS_ISNOTMAINIMAGE';
                }
                $this->setMessage(JText::plural($ntext, count($cid)));
            }
            else
            {
                $this->setMessage($model->getError());
            }
        }
        $this->setRedirect( 'index.php?option=com_eventgallery&view=files&folderid='.$this->input->getString('folderid').$this->_anchor);
    }

    public function isMainImageOnly() {
        $cid = JFactory::getApplication()->input->get('cid', array(), 'array');
        $data = array('ismainimageonly' => 1, 'isnotmainimageonly' => 0);
        $task = $this->getTask();
        $value = JArrayHelper::getValue($data, $task, 0, 'int');
        if (!is_array($cid) || count($cid) < 1)
        {
            JLog::add(JText::_($this->text_prefix . '_NO_ITEM_SELECTED'), JLog::WARNING, 'jerror');
        }
        else
        {
            // Get the model.
            $model = $this->getModel();

            // Make sure the item ids are integers
            jimport('joomla.utilities.arrayhelper');
            JArrayHelper::toInteger($cid);

            // Remove the items.
            if ($model->isMainImageOnly($cid, $value))
            {
                if ($value == 1)
                {
                    $ntext = $this->text_prefix . '_N_ITEMS_ISMAINIMAGEONLY';
                }
                else
                {
                    $ntext = $this->text_prefix . '_N_ITEMS_ISNOTMAINIMAGEONLY';
                }
                $this->setMessage(JText::plural($ntext, count($cid)));
            }
            else
            {
                $this->setMessage($model->getError());
            }
        }
        $this->setRedirect( 'index.php?option=com_eventgallery&view=files&folderid='.$this->input->getString('folderid').$this->_anchor);
    }


    
}