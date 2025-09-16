<?php
/**
 * @package     Sven.Bluege
 * @subpackage  com_eventgallery
 *
 * @copyright   Copyright (C) 2005 - 2013 Sven Bluege All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */
defined('_JEXEC') or die;

class EventgalleryControllerSingleimage extends EventgalleryController
{
    
    public function display($cachable = false, $urlparams = array())
    {
        $cachable = true;

        $folder = $this->input->getString('folder', '');

        /**
         * @var EventgalleryLibraryFactoryFolder $folderFactory
         */
        $folderFactory = EventgalleryLibraryFactoryFolder::getInstance();
        $folder = $folderFactory->getFolder($folder);


        // we need to do this only if someone entered a password.
        // the views will protect themselfs
        $accessAllowed = $folder->isVisible();

        if (!$accessAllowed) {
            $cachable = false;
        }

        $params = JComponentHelper::getParams('com_eventgallery');
        $isCommentsEnabled = $params->get('use_comments', 0) == 1;

        if ($isCommentsEnabled) {
            $cachable = false;
        }

        $viewLayout = $this->input->get('layout', 'default', 'string');

        if ('imagesetselection' == $viewLayout) {
            $cachable = false;
        }

        parent::display($cachable, $urlparams);
    }

}
