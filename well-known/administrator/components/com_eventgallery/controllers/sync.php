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

class EventgalleryControllerSync extends JControllerForm
{


    /**
     * The root folder for the physical images
     *
     * @var string
     */

    protected $default_view = 'sync';

    public function __construct($config = array())
    {

        parent::__construct($config);
    }

    public function getModel($name = 'Sync', $prefix = 'EventgalleryModel', $config = array('ignore_request' => true))
    {
        $model = parent::getModel($name, $prefix, $config);
        return $model;
    }

    /**
     * just cancels this view
     * @param null $key
     * @return bool|void
     */
    public function cancel($key = NULL)
    {
        $this->setRedirect('index.php?option=com_eventgallery&view=events');
    }

    /**
     * initializes the syncronization.
     *
     * @param bool $cachable
     * @param array $urlparams
     */
    public function init($cachable = false, $urlparams = array())
    {
        JSession::checkToken();

        /**
         * @var EventgalleryModelSync $model
         */
        $model = $this->getModel();

        $newFolders = $model->findNewFolders();
        $existingfolders = $model->getFolders();

        $result = ['folders'=>$existingfolders, 'newfolders' => $newFolders];
        echo json_encode($result);
    }

    /**
     * Syncs one folder
     *
     * @param bool $cachable
     * @param array $urlparams
     */
    public function processFolder(/** @noinspection PhpUnusedParameterInspection */
        $cachable = false, $urlparams = array())
    {
        $params = JComponentHelper::getParams('com_eventgallery');
        $use_htacces_to_protect_original_files = $params->get('use_htacces_to_protect_original_files', 1) == 1;

        JSession::checkToken();
        $folder = $this->input->getString('folder', '');
        $foldertype = $this->input->getInt('foldertype', null);
        $syncResult = $this->getModel()->syncFolder($folder, $foldertype, $use_htacces_to_protect_original_files);

        $result = Array();
        $result['folder'] = htmlspecialchars($folder);
        $result['status'] = $syncResult['status'];
        $result['files'] = $syncResult['files'];

        echo json_encode($result);
    }

    public function processFile()
    {
        JSession::checkToken();
        $folder = $this->input->getString('folder','');
        $file = $this->input->getString('file','');

        $result = $this->getModel()->syncFile($folder, $file);

        echo json_encode($result);
    }


}
