<?php
/**
 * @package     Sven.Bluege
 * @subpackage  com_eventgallery
 *
 * @copyright   Copyright (C) 2005 - 2013 Sven Bluege All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */
defined('_JEXEC') or die;

class EventgalleryControllerTrackorder extends JControllerLegacy
{
    public function display($cachable = false, $urlparams = array())
    {
        parent::display(false, $urlparams);
    }

    public function order(/** @noinspection PhpUnusedParameterInspection */
        $cachable = false, $urlparams = array()) {

        // Commented this out. Makes not sense since guessing the combinations of orderid and email is still possible
        // if somebody submitts the form.
        //JSession::checkToken('post') or jexit(JText::_('JInvalid_Token'));

        // Get the model and validate the data.
        $data  = array(
            'orderid'=>$this->input->getString('orderid',''),
            'email'=>$this->input->getString('email','')
        );
        $model  = $this->getModel('Trackorder', 'EventgalleryModel');
        $form = $model->getForm();
        $return	= $model->validate($form, $data);
        if ($return === false) {
            $msg = JText::_('COM_EVENTGALLERY_TRACKORDER_NOTFOUND');
            $this->setRedirect(JRoute::_('index.php?option=com_eventgallery&view=trackorder'), $msg, 'error');
        }

        $this->input->set('layout', 'order');

        parent::display(false, $urlparams);
    }


    public function resetViewCache() {
        parent::$views = null;
    }
}
