
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
class EventgalleryControllerEmailtemplate extends JControllerForm
{
    /**
     * sends a test mail to the current user by using the current emailtemplate and some demo data based on the emails key.
     *
     * @param null $key
     * @throws Exception
     */
 	public function sendtestmail(/** @noinspection PhpUnusedParameterInspection */$key = NULL) {

        $app = JFactory::getApplication();

 		$id = $this->input->getInt('id');

        if(!$id)
        {
            $this->setRedirect('index.php?option=com_eventgallery&view=emailtemplates', JText::_('COM_EVENTGALLERY_EMAILTEMPLATES_ERROR_CHOOSE_TEMPLATE'), 'notice');
            $this->redirect();
        }

        /**
        * @var EventgalleryLibraryFactoryEmailtemplate $emailtemplateFactory
        * @var EventgalleryLibraryManagerEmailtemplate $emailtemplateMgr
        */
        $emailtemplateFactory = EventgalleryLibraryFactoryEmailtemplate::getInstance();
        $emailtemplateMgr = EventgalleryLibraryManagerEmailtemplate::getInstance();

        $to = JFactory::getUser()->email;

        $emailtemplate = $emailtemplateFactory->getEmailtemplateById($id);
        $data = $emailtemplateMgr->getDemoData($emailtemplate->getKey());

        $emailtemplateMgr->sendMailById($id, $data, Array($to), false );

 		$msg = JText::_('COM_EVENTGALLERY_EMAILTEMPLATE_TESTMAIL_SEND_SUCCESSFUL');
        $app->enqueueMessage($msg);
        $this->setRedirect(JRoute::_('index.php?option=com_eventgallery&view=emailtemplate&id='. $id. $this->getRedirectToListAppend(), false));
    }

}
