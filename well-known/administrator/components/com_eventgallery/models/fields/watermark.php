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

// The class name must always be the same as the filename (in camel case)
class JFormFieldWatermark extends JFormField
{

    //The field class must know its own type through the variable $type.
    protected $type = 'watermark';


    public function getInput()
    {
         /**
         * @var EventgalleryLibraryFactoryWatermark $watermarkFactory
         */
        $watermarkFactory = EventgalleryLibraryFactoryWatermark::getInstance();

        $watermarks = $watermarkFactory->getWatermarks(false);
        
        $return  = '<select name='.$this->name.' id='.$this->id.'>';
        $return .= '<option  value="">'.JText::_('COM_EVENTGALLERY_WATERMARK_NONE').'</option>';

        foreach($watermarks as $watermark) {
            /**
             * @var EventgalleryLibraryWatermark $watermark
             */

            $this->value==$watermark->getId()?$selected='selected="selected"':$selected ='';

            $return .= '<option '.$selected.' value="'.$watermark->getId().'">'.$watermark->getName().'</option>';
        }
        $return .= "</select>";
        return $return;

    }
}