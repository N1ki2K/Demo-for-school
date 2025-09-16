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
class JFormFieldstates extends JFormField
{

    //The field class must know its own type through the variable $type.
    protected $type = 'states';


    public function getInput()
    {

        $attribs = array();
        $data = array();
        $data['N/A'] = ['id'=>'nocountry', 'text'=>'N/A', 'items'=>[JHtml::_('select.option', '', 'N/A')]];

        foreach(EventgalleryLibraryCommonGeoobjects::getStates(true) as $countryCode=>$states) {
            $countryName = EventgalleryLibraryCommonGeoobjects::getCountryName($countryCode);
            $data[$countryName] = 	[
                'id' => \JApplicationHelper::stringURLSafe($countryName),
				'text' => $countryName,
				'items' => []
            ];

            foreach($states as $state) {
                $data[$countryName]['items'][] = JHtml::_('select.option', $state->statecode, $state->statename);
            }
        }

        return JHtml::_('select.groupedlist', $data, $this->id, [
            'id' =>$this->id,
            'group.id' => 'id',
            'list.attr' => $attribs,
            'list.select' => $this->value
        ]);
    }
}