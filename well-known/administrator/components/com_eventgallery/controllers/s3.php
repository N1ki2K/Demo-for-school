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

require_once(__DIR__.'/../controller.php');

class EventgalleryControllerS3 extends JControllerForm
{


    /**
     * The root folder for the physical images
     *
     * @var string
     */

    protected $default_view = 's3';

    public function __construct($config = array())
    {

        parent::__construct($config);
    }

	public function getModel($name = 'S3', $prefix ='EventgalleryModel', $config = array('ignore_request' => true))
    {
        $model = parent::getModel($name, $prefix, $config);
        return $model;
    }

    /**
     * just cancels this view
     * @param null $key
     * @return bool|void
     */
	public function cancel($key = NULL) {
		$this->setRedirect( 'index.php?option=com_eventgallery&view=events');
	}

    public function processfolder(/** @noinspection PhpUnusedParameterInspection */$cachable = false, $urlparams = array()) {
        JSession::checkToken();
        $folder = $this->input->getString('folder','');
        $refreshETagsStr = $this->input->getString('refreshetags', "true");
        $refreshETags = !strcasecmp($refreshETagsStr, "false") == 0;
        $files =  $this->getModel()->getFilesToSync($folder, $refreshETags);
        echo json_encode($files);
    }

    public function processfile() {
        JSession::checkToken();
        $folder = $this->input->getString('folder','');
        $file = $this->input->getString('file','');

        $result = $this->getModel()->createThumbnails($folder, $file);

        echo json_encode($result);
    }


}
