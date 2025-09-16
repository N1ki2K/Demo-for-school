<?php

/**
 * @package     Sven.Bluege
 * @subpackage  com_eventgallery
 *
 * @copyright   Copyright (C) 2005 - 2013 Sven Bluege All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

// Check to ensure this file is included in Joomla!
defined('_JEXEC') or die('Restricted access');

jimport('joomla.form.formfield');
require_once JPATH_ADMINISTRATOR . '/components/com_eventgallery/helpers/backendmedialoader.php';

// The class name must always be the same as the filename (in camel case)
class JFormFieldOauthusers extends JFormField
{

    //The field class must know its own type through the variable $type.
    protected $type = 'oauthusers';


    public function getInput()
    {

        EventgalleryHelpersBackendmedialoader::load();

        $return = Array();

        $return[]  = '<input class="google-oauth-input" name="'.$this->name.'" value="'. $this->value .'" id="'.$this->id.'"/>&nbsp';
        $return[]  = '<button class="google-oauth-trigger-button btn active btn-success" id='.$this->id.'>'. JText::_('COM_EVENTGALLERY_OPTIONS_COMMON_GOOGLE_PHOTOS_REFRESH_TOKEN_BUTTON_LABEL') .'</bottons>';
        return implode('', $return);
    }

}