<?php
/**
 * @package     Sven.Bluege
 * @subpackage  com_eventgallery
 *
 * @copyright   Copyright (C) 2005 - 2013 Sven Bluege All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

jimport( 'joomla.application.component.controllerform' );

/** @noinspection PhpUndefinedClassInspection */
class EventgalleryControllerEvent extends JControllerForm
{

	/**
	 * Method to save a record.
	 *
	 * @param   string  $key     The name of the primary key of the URL variable.
	 * @param   string  $urlVar  The name of the URL variable if different from the primary key (sometimes required to avoid router collisions).
	 *
	 * @return  boolean  True if successful, false otherwise.
	 *
	 * @since   12.2
	 */
	public function save($key = null, $urlVar = null) {
		$task = $this->getTask();
		if ($task == 'save2copy') {
			$data  = $this->input->post->get('jform', array(), 'array');
			/**
			 * @var EventgalleryLibraryFactoryFolder $folderFactory
			 */
			$folderFactory = EventgalleryLibraryFactoryFolder::getInstance();
			$folder = $folderFactory->getFolder($data['folder']);

			if (null != $folder) {
				$this->setMessage(JText::_('COM_EVENTGALLERY_EVENT_COPY_ERROR'), 'error');

				$this->setRedirect(
					JRoute::_(
						'index.php?option=' . $this->option . '&view=' . $this->view_item
						. $this->getRedirectToItemAppend($data['id'], 'id'), false
					)
				);

				return false;
			}
		}
		return parent::save($key, $urlVar);
	}


	/**
	 * Function that allows child controller access to model data after the data has been saved.
	 *
	 * param   $model      The data model object.
	 * param   array         $validData  The validated data.
	 *
	 * @return	void
	 * @since	1.6
	 */
	protected function postSaveHook(JModelLegacy $model, $validData = array())
	{
        /**
         * @var EventgalleryModelEvent $model
         */
		
        $oldFolder = $this->input->getString("oldfolder", null);
		$newFolder = $validData['folder'];
		
		# Rename folder now:
		$basedir = COM_EVENTGALLERY_IMAGE_FOLDER_PATH;

		if ($oldFolder!=null && strcmp($oldFolder, $newFolder)!=0 && $this->task != 'save2copy')
		{
			rename($basedir.$oldFolder, $basedir.$newFolder);
			$model->changeFolderName($oldFolder, $newFolder);
		}

		if ($this->task == 'save')
		{
			$this->setRedirect(JRoute::_('index.php?option=com_eventgallery&view=events', false));
		}
	}

	/**
	 * Method to run batch operations.
	 *
	 * @param   object  $model  The model.
	 *
	 * @return  boolean   True if successful, false otherwise and internal error is set.
	 *
	 * @since   2.5
	 */
	public function batch($model = null)
	{
		JSession::checkToken() or jexit(JText::_('JINVALID_TOKEN'));

		// Set the model
		$model = $this->getModel('Event', '', array());

		// Preset the redirect
		$this->setRedirect(JRoute::_('index.php?option=com_eventgallery&view=events' . $this->getRedirectToListAppend(), false));

        /** @noinspection PhpParamsInspection */
        return parent::batch($model);
	}
}
