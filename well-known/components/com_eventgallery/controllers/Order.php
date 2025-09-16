<?php
/**
 * @package     Sven.Bluege
 * @subpackage  com_eventgallery
 *
 * @copyright   Copyright (C) 2005 - 2013 Sven Bluege All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */
defined('_JEXEC') or die;

class EventgalleryControllerOrder extends JControllerLegacy
{
    public function display($cachable = false, $urlparams = array())
    {
        $user = JFactory::getUser();
        if ($user->guest) {
            $this->setRedirect(
                JRoute::_('index.php?option=com_eventgallery&view=trackorder', false)
            );
            return;
        }
        parent::display(false, $urlparams);
    }

}
