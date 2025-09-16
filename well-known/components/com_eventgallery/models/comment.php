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

jimport('joomla.application.component.modelform');


//jimport( 'joomla.application.component.helper' );

/** @noinspection PhpUndefinedClassInspection */
class EventgalleryModelComment extends JModelForm
{

        /**
     * @since   1.6
     */
    protected $view_item = 'singleimage';

    protected $_item = null;

    /**
     * Model context string.
     *
     * @var     string
     */
    protected $_context = 'com_eventgallery.comment';

    /**
     * Method to get the contact form.
     *
     * The base form is loaded from XML and then an event is fired
     *
     *
     * @param   array  $data        An optional array of data for the form to interrogate.
     * @param   boolean $loadData   True if the form is to load its own data (default case), false if not.
     * @return  JForm   A JForm object on success, false on failure
     * @since   1.6
     */
    public function getForm($data = array(), $loadData = true)
    {
        // Get the form.
        $form = $this->loadForm('com_eventgallery.comment', 'comment', array('control' => 'jform', 'load_data' => true));
        if (empty($form))
        {
            return false;
        }

        return $form;
    }

    protected function loadFormData()
    {
        $data = (array) JFactory::getApplication()->getUserState('com_eventgallery.comment.data', array());

        return $data;
    }


    function getData($commentId)
    {
        $db = JFactory::getDbo();

        $query = $db->getQuery(true)
            ->select('*')
            ->from($db->quoteName('#__eventgallery_comment'))
            ->where('id=' . $db->quote($commentId));
        $db->setQuery($query);
        return $db->loadObject();
    }

    function getFile($commentId)
    {
        $comment = $this->getData($commentId);
        /**
         * @var EventgalleryLibraryFactoryFile $fileFactory
         */
        $fileFactory = EventgalleryLibraryFactoryFile::getInstance();
        return $fileFactory->getFile($comment->folder, $comment->file);

    }
}
