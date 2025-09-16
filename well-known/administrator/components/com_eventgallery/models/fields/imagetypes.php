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
class JFormFieldImagetypes extends JFormField
{

    //The field class must know its own type through the variable $type.
    protected $type = 'imagetypes';


    public function getInput()
    {
        /**
         * @var EventgalleryLibraryFactoryImagetype $imagetypeFactory
         * @var EventgalleryLibraryFactoryImagetypeset $imagetypesetFactory
         */
        $imagetypeFactory = EventgalleryLibraryFactoryImagetype::getInstance();
        $imagetypesetFactory = EventgalleryLibraryFactoryImagetypeset::getInstance();

        $imagetypes = $imagetypeFactory->getImageTypes(false);

        $id = $this->form->getField('id')->value;

        $imagetypeset = null;
        if ($id!=0) {
            $imagetypeset = $imagetypesetFactory->getImagetypesetById($id);
        }

        /**
         * @var EventgalleryLibraryImagetype $imagetype
         */

        $return  = '<select multiple name="'.$this->name.'" id="'.$this->id.'">';
        if ($imagetypeset != null) {
            foreach($imagetypeset->getImageTypes() as $imagetype) {
                $return .= '<option selected="selected" value="'.$imagetype->getId().'">'.$imagetype->getName().'</option>';
            }
        }

        foreach($imagetypes as $imagetype) {


            if ($imagetypeset != null && $imagetypeset->getImageType($imagetype->getId())!=null){
                continue;
            }
            $return .= '<option value="'.$imagetype->getId().'">'.$imagetype->getName().'</option>';
        }
        $return .= "</select>";        

        return $return;

    }
}