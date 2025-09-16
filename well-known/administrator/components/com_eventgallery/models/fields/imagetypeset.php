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
class JFormFieldImagetypeset extends JFormField
{

    //The field class must know its own type through the variable $type.
    protected $type = 'imagetypeset';


    public function getInput()
    {
        /**
         * @var EventgalleryLibraryFactoryImagetypeset $imagetypesetFactory
         */

        $imagetypesetFactory = EventgalleryLibraryFactoryImagetypeset::getInstance();

        $imagetypesets = $imagetypesetFactory->getImageTypeSets(true);

        if ($this->value == null  && $imagetypesetFactory->getDefaultImageTypeSet(false) != null) {
            $this->value = $imagetypesetFactory->getDefaultImageTypeSet(false)->getId();
        }

        $return  = '<select name='.$this->name.' id='.$this->id.'>';
        foreach($imagetypesets as $imagetypeset) {
            /**
             * @var EventgalleryLibraryImagetypeset $imagetypeset
             */

            $this->value==$imagetypeset->getId()?$selected='selected="selected"':$selected ='';

            $return .= '<option '.$selected.' value="'.$imagetypeset->getId().'">'.$imagetypeset->getName().'</option>';
        }
        $return .= "</select>";
        return $return;

    }
}