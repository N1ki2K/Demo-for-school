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
class JFormFieldFoldertype extends JFormField
{

    //The field class must know its own type through the variable $type.
    protected $type = 'foldertype';


    public function getInput()
    {

        EventgalleryHelpersBackendmedialoader::load();

        /**
         * @var EventgalleryLibraryFactoryFoldertype $foldertypeFactory
         */
        $foldertypeFactory = EventgalleryLibraryFactoryFoldertype::getInstance();

        $foldertypes = $foldertypeFactory->getFolderTypes(true);

        if ($this->value == null  && $foldertypeFactory->getDefaultFolderType(false) != null) {
            $this->value = $foldertypeFactory->getDefaultFolderType(false)->getId();
        }

        $return = Array();

        $onchange = "eventgallery.jQuery('.foldertype-input').css('display', 'none'); eventgallery.jQuery('.foldertype-' + this.options[this.selectedIndex].value  ).css('display', 'block');";

        $return[]  = '<select onchange="'. $onchange .'" name="'.$this->name.'" id="'.$this->id.'">';
        foreach($foldertypes as $foldertype) {
            /**
             * @var EventgalleryLibraryFoldertype $foldertype
             */

            $this->value==$foldertype->getId()?$selected='selected="selected"':$selected ='';

            $return[] = '<option '.$selected.' value="'.$foldertype->getId().'">'.$foldertype->getDisplayName().'</option>';
        }
        $return[] = "</select>";

        $return[] = $this->getLocalInput();

        $return[] = $this->getPicasaInput();
        
        $return[] = $this->getFlickrInput();

        $return[] = $this->getS3Input();

        $currentFolderType = 0;
        if (isset($this->value) ) {
            $currentFolderType = $this->value;
        }

        $return[] = "<script>eventgallery.jQuery('.foldertype-input').css('display', 'none'); eventgallery.jQuery('.foldertype-$currentFolderType').css('display', 'block');</script>";

        return implode('', $return);
    }

    protected function getLocalInput() {
        $result = Array();
        $value = $this->form->getValue("folder");
        $result[] = '<div class="foldertype-0 foldertype-input">';
        $result[] = "<br>Folder Name<br>";
        $result[] = '<input onchange="document.getElementById(\'jform_folder\').value=this.value" type="text" id="foldertype-0-foldername" value="'.htmlspecialchars($value, ENT_COMPAT, 'UTF-8').'" />';
        $result[] = '</div>';

        return implode('', $result);
    }

    protected function getFlickrInput() {
        $result = Array();
        $value = $this->form->getValue("folder");
        $result[] = '<div class="foldertype-2 foldertype-input">';
        $result[] = "<br>Flickr Photo Set ID<br>";
        $result[] = '<input onchange="document.getElementById(\'jform_folder\').value=this.value" type="text" id="foldertype-2-photosetid" value="'.htmlspecialchars($value, ENT_COMPAT, 'UTF-8').'" />';
        $result[] = '</div>';
        return implode('', $result);
    }


    protected function getPicasaInput() {

        JHtml::_('behavior.modal', 'button.modal-button');

        $result = Array();
        $value = $this->form->getValue("folder");
        $picasakey = $this->form->getValue("picasakey");

        $temp = explode(EventgalleryLibraryFolderPicasa::PICASA_FOLDERID_DELIMITER, $value);

        $user = implode(EventgalleryLibraryFolderPicasa::PICASA_FOLDERID_DELIMITER, array_slice($temp, 0, count($temp)-1) );

        $album = "";
        if (count($temp) > 1) {
            $album = implode(EventgalleryLibraryFolderPicasa::PICASA_FOLDERID_DELIMITER, array_slice($temp, count($temp) - 1, 1));
        }

        $onchange = "document.getElementById('jform_folder').value = document.getElementById('foldertype-1-user').value + '@' + document.getElementById('foldertype-1-album').value;";
        $result[] = '<div class="foldertype-1 foldertype-input">';
        $result[] = "<br>User<br>";
        $result[] = '<input onchange="'. $onchange. '" type="text" id="foldertype-1-user" value="'.$user.'" />';
        $result[] = "<br>Album<br>";
        $result[] = '<input onchange="'. $onchange. '" type="text" id="foldertype-1-album" value="'.$album.'" />';
        $result[] = "<br>Picasa Key<br>";
        $result[] = '<input onchange="document.getElementById(\'jform_picasakey\').value=this.value" type="text" id="foldertype-1-picasakey" value="'.$picasakey.'" />';
        $result[] = "<br>";
        $result[] = "<br>";
        $result[] = '<button class="btn modal-button" title="Event Gallery" href="https://static.svenbluege.de/picasa/v1.2/index.html" rel="{handler: \'iframe\', size: function() { return {x: window.innerWidth-60, y: window.innerHeight-60}}() }">
		Album Selector</button>';
        $result[] = '<div id="foldertype-1-albumselectoriframe" ></div>';
        $result[] = "<br>";
        $result[] = '</div>';


        return implode('', $result);


    }

    protected function getS3Input() {
        $result = Array();
        $value = $this->form->getValue("folder");
        $result[] = '<div class="foldertype-3 foldertype-input">';
        $result[] = "<br>Key<br>";
        $result[] = '<input onchange="document.getElementById(\'jform_folder\').value=this.value" type="text" id="foldertype-3-foldername" value="'.htmlspecialchars($value, ENT_COMPAT, 'UTF-8').'" />';
        $result[] = '</div>';

        return implode('', $result);
    }


}