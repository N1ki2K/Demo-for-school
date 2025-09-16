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
class JFormFieldScalepriceeditor extends JFormField
{

    //The field class must know its own type through the variable $type.
    protected $type = 'scalepriceeditor';


    public function getInput()
    {

        EventgalleryHelpersBackendmedialoader::load();

        $value = $this->value;
        if (empty($this->value)) {
            $value = '{}';
        }
        $return  = '<input type="text" value="'. htmlspecialchars($value, ENT_QUOTES, 'UTF-8') .'" id='.$this->id.' name="'. $this->name .'" class="scale-price-editor">';

        return $return;
    }




}