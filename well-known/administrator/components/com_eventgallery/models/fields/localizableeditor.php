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
jimport('joomla.form.field.editor');


// The class name must always be the same as the filename (in camel case)

class JFormFieldLocalizableeditor extends JFormFieldEditor
{

    //The field class must know its own type through the variable $type.
    public $type = 'localizableeditor';
    protected $editorType = NULL;


    public function getInput()
    {
        $result = "";
        $langs = JFactory::getLanguage()->getKnownLanguages();
        $oldId = $this->id;
        $oldName = $this->name;
        $oldValue = $this->value;

        $lt = json_decode($oldValue);

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

        $defaultLanguageTag = JComponentHelper::getParams('com_languages')->get('site');
        $defaultLanguage = $langs[$defaultLanguageTag];
        if ($defaultLanguage != null) {
            unset($langs[$defaultLanguageTag]);
            $langs = array_merge(array($defaultLanguageTag => $defaultLanguage), $langs);
        }

        if (count($langs)>1) {
            $result .= '<small>'.JText::_('COM_EVENTGALLERY_LOCALIZEDEDITOR_WARNING').'</small>';
        }

        foreach($langs as $tag=>$lang) {
            $defaultLangMarker = $tag == $defaultLanguageTag? "*": "";
            $this->value = isset($lt->$tag)===true?$lt->$tag:'';
            $this->id = $oldId . str_replace('-','_',$tag);
            $this->name = $oldName . str_replace('-','_',$tag);
            $result .= '<div style="clear:both">';
            $result .= "<h4 >$tag $defaultLangMarker</h4>";
            $result .= parent::getInput();
            $result .= '</div>';
        }
        $this->id = $oldId;
        $this->value=$oldValue;
        $this->name = $oldName;

        $hiddenField =  '<input type="hidden" name="' . $this->name . '" id="' . $this->id . '" value="' . htmlspecialchars($this->value, ENT_COMPAT, 'UTF-8') . '"/>';

        return $result.$hiddenField;
    }

    public function save() {
        $result = "";
        $langs = JFactory::getLanguage()->getKnownLanguages();
        foreach($langs as $tag=>$lang) {
            $editorid = $this->id . str_replace('-', '_', $tag);
            $result .= $this->getEditor()->save($editorid)."\n";
        }

        $script = "\n" . ' var data'.$this->id.' = {};' . "\n";

        foreach ($langs as $tag => $lang) {
            // this is a workaround for the missing multieditor ability of Joomla
            // https://github.com/joomla/joomla-cms/commit/47645bbfe306b85d5b662500078069698b80f43d
            $editorid = $this->id . str_replace('-', '_', $tag);

            $script .= "if (typeof tinyMCE != 'undefined' && tinyMCE.get('" . $editorid ."') ) {\n";
            $script .= "    if (tinyMCE.get('$editorid').hidden === true) {";
            $script .= '    data' . $this->id . '["' . $tag . '"] = document.getElementById("'.$editorid.'").value;'. "\n";
            $script .= '    } else {';
            $script .= '    data' . $this->id . '["' . $tag . '"] = tinyMCE.get(\'' . $editorid . '\').getContent();'. "\n";
            $script .= '    }';
            $script .= "} else {";
            $script .= '    try {';
            $script .= '        data' . $this->id . '["' . $tag . '"] = ' . $this->getEditor()->getContent($editorid) . ';' . "\n";
            $script .= '    }';
            $script .= '    catch(err) {console.log(err);}';
            $script .="}\n;";
        }

        $script .= 'document.getElementById("'.$this->id.'").value = JSON.encode(data'.$this->id.'); '. "\n";

        return $result.$script;
    }


}