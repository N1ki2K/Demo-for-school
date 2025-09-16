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
class EventgalleryControllerFile extends JControllerForm
{

    /**
     * Function that allows child controller access to model data after the data has been saved.
     *
     * @param EventgalleryModelEvent|EventgalleryModelFile $model The data model object.
     * @param   array $validData The validated data.
     *
     * @return    void
     * @since    1.6
     */
	protected function postSaveHook(EventgalleryModelFile $model, $validData = array())
	{

		if ($this->task == 'save')
		{
			$this->setRedirect(JRoute::_('index.php?option=com_eventgallery&view=files&folderid='.$this->input->getInt('folderid') . $this->getRedirectToListAppend(), false));
		}
	}

    public function cancel($key = NULL) {
        $this->setRedirect(JRoute::_('index.php?option=com_eventgallery&view=files&folderid='.$this->input->getInt('folderid') . $this->getRedirectToListAppend(), false));
    }

}
