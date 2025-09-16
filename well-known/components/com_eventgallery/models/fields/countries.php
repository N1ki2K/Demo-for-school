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
class JFormFieldcountries extends JFormField
{

    //The field class must know its own type through the variable $type.
    protected $type = 'states';


    public function getInput()
    {

        $params = JComponentHelper::getParams('com_eventgallery');
        $preselectedCountry = $params->get('checkout_preselected_country');


        $data = array();

        $selectedValue = $this->value;

        if (strlen($selectedValue) == 0) {
            $selectedValue = $preselectedCountry;
        }

        foreach(EventgalleryLibraryCommonGeoobjects::getCountries() as $countryCode=>$countryName) {

            $data[$countryName] = 	[
                'value' => $countryCode,
				'text' => $countryName,
                'selected' => $selectedValue == $countryCode
            ];
        }

        $html = array();
        $attr = '';

        // Initialize some field attributes.
        $attr .= !empty($this->class) ? ' class="' . $this->class . '"' : '';
        $attr .= !empty($this->size) ? ' size="' . $this->size . '"' : '';
        $attr .= $this->required ? ' required aria-required="true"' : '';

        // Initialize JavaScript field attributes.
        $attr .= $this->onchange ? ' onchange="' . $this->onchange . '"' : '';

        // Get the field options.
        $options = $data;


        $html[] = JHtml::_('select.genericlist', $options, $this->name, trim($attr), 'value', 'text', $selectedValue, $this->id);

        return implode($html);

    }
}