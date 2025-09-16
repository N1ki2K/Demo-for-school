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
class JFormFieldhtml5text extends JFormField
{

    //The field class must know its own type through the variable $type.
    protected $type = 'html5text';


    public function getInput()
    {
        {

            $placeholder = $this->element['placeholder'] ? (string)$this->element['placeholder'] : "";
            $placeholder = $this->translateLabel ? JText::_($placeholder) : $placeholder;

            $inputtype = $this->element['inputtype'] ? (string)$this->element['inputtype'] : "text";
            // Initialize some field attributes.
            $size = $this->element['size'] ? ' size="' . (int)$this->element['size'] . '"' : '';
            $maxLength = $this->element['maxlength'] ? ' maxlength="' . (int)$this->element['maxlength'] . '"' : '';
            $class = $this->element['class'] ? ' class="' . (string)$this->element['class'] . '"' : '';

            $readonly = ((string)$this->element['readonly'] == 'true') ? ' readonly="readonly"' : '';
            $disabled = ((string)$this->element['disabled'] == 'true') ? ' disabled="disabled"' : '';
            $required = $this->required ? ' required="required" aria-required="true"' : '';
            // Initialize JavaScript field attributes.
            $onchange = $this->element['onchange'] ? ' onchange="' . (string)$this->element['onchange'] . '"' : '';

            return '<input placeholder="' . $placeholder . '" type="' . $inputtype . '" name="' . $this->name . '" id="'
            . $this->id . '"' . ' value="'
            . htmlspecialchars($this->value, ENT_COMPAT, 'UTF-8') . '"' . $class . $size . $disabled . $readonly. $required
            . $onchange . $maxLength . '/>';
        }
    }
}