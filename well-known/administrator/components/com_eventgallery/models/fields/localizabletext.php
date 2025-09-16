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

class JFormFieldlocalizabletext extends JFormField
{

    //The field class must know its own type through the variable $type.
    protected $type = 'localizabletext';


    public function getInput()
    {

        EventgalleryHelpersBackendmedialoader::load();

        $name = (string)$this->element['name'];
        $inputtype=(string)$this->element['inputtype'];
        $class = $this->element['class'] ? ' class=" lc_'.$name.' ' . (string) $this->element['class'] . '"' : ' class="lc_'.$name.'" ';
        $rows = $this->element['rows'] ? $this->element['rows'] : 4;
        $required = $this->required ? ' required="required" aria-required="true"' : '';

        $langs = JFactory::getLanguage()->getKnownLanguages();

        $defaultLanguageTag = JComponentHelper::getParams('com_languages')->get('site');
        $defaultLanguage = $langs[$defaultLanguageTag];
        if ($defaultLanguage != null) {
            unset($langs[$defaultLanguageTag]);
            $langs = array_merge(array($defaultLanguageTag => $defaultLanguage), $langs);
        }

        $result = "";

        $lt = json_decode($this->value);

        if ($lt == null) {
            $lt = new stdClass();
            // added fallback logic in case the current value is not in JSON format
            // this might be because in older versions there where no multilanguage fields.
            if (!empty($this->value) && json_last_error() == JSON_ERROR_SYNTAX) {
                foreach($langs as $tag=>$lang) {        
                    $lt->$tag = $this->value;
                }
            } 
        }
        foreach($langs as $tag=>$lang) {
            $defaultLangMarker = $tag == $defaultLanguageTag? " *": "";
            $result .= '<div class="input-prepend" style="display:block; margin-bottom:10px;">';
            $result .= '<span class="add-on">'.$tag . $defaultLangMarker .'</span>';
            $value = htmlspecialchars(isset($lt->$tag)===true?$lt->$tag:'', ENT_COMPAT, 'UTF-8');
            if ($inputtype == 'textarea'){
                $result .= '<textarea data-tag="'.$tag.'" rows="'.$rows.'" type="text" '.$class.'>'.$value.'</textarea>';
            } else {
                $result .= '<input data-tag="'.$tag.'" type="text" value="'.$value.'" '.$class.'>';
            }
            $result .= '</div>';
        }

        $hiddenField =  '<input type="hidden" name="' . $this->name . '" id="' . $this->id . '" value="' . htmlspecialchars($this->value, ENT_COMPAT, 'UTF-8') . '"' . $required . '/>';

        // Initialize JavaScript field attributes.
        $script = '<script type="text/javascript">';

        // the script searches all the lc text fields and creates a json string for the hidden input field.
        $script .= '
            eventgallery.jQuery(".lc_'.$name.'").blur(function(e) {

                var $container = eventgallery.jQuery(e.target).closest(".localizabletext"),
                    data = {},
                    jsonData;

                $container.find(".lc_'.$name.'").each(function(){
                    var value = this.value;
                    if (value.trim().length > 0) {
                        data[eventgallery.jQuery(this).data("tag")] = this.value;
                    }
                });
                
                jsonData = JSON.encode(data);
                if (jsonData.length < 3) {
                    jsonData = "";
                }
                
                $container.find("#'.$this->id.'").val(jsonData);
            });
        ';

        $script .= '</script>';

        return '<span class="localizabletext">'.$result.$hiddenField.$script."</span>";
    }
}