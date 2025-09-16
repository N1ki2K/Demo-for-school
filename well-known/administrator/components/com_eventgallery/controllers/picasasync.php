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

use \Joomla\Component\Eventgallery\Site\Library\Connector\GooglePhotos;

require_once(__DIR__.'/../controller.php');

class EventgalleryControllerPicasasync extends JControllerForm
{

    protected $default_view = 'picasasync';

	public function getModel($name = 'Picasasync', $prefix ='EventgalleryModel', $config = array('ignore_request' => true))
    {
        $model = parent::getModel($name, $prefix, $config);
        return $model;
    }

    /**
     * function to provide the PicasaSync-View
     * @throws Exception
     */
	function sync()
	{
        JSession::checkToken();

        $app = JFactory::getApplication();
        $db = JFactory::getDbo();

        $username = $this->input->getString('username');
        $key = $this->input->getString('key');

        $params = JComponentHelper::getParams('com_eventgallery');
        $cachelifetime = $params->get('cache_picasa_lifetime', GooglePhotos::$cache_life);
        $refresh_token = $params->get('google_photos_refresh_token');

        $joomlaConfigParameters = \JFactory::getConfig();

        $albums = GooglePhotos::picasaweb_ListAlbums($cachelifetime, $refresh_token, $joomlaConfigParameters, $db, $app, $username, $key);

        /**
         * @var EventgalleryModelPicasasync $model
         */
        $model = $this->getModel();
        $albumsAdded = 0;

        foreach($albums as $album) {

            if (!$model->eventExists($album->folder)) {
                $model->addEvent($album);
                $albumsAdded++;
            }
        }

        $app->enqueueMessage(JText::sprintf('COM_EVENTGALLERY_PICASASYNC_DONE', $albumsAdded));
        $this->display();
	}

	public function cancel($key = NULL) {
		$this->setRedirect( 'index.php?option=com_eventgallery&view=events');
	}
}
