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


// The class name must always be the same as the filename (in camel case)
/**
 * provides a form field where you can select which class should be used. This works only of the ID is not set.
 *
 * Class JFormFieldmethodsclass
 */
class JFormFieldmethodsclass extends JFormField
{

    //The field class must know its own type through the variable $type.
    protected $type = 'methodsclass';


    public function getInput()
    {
        $required = $this->required ? ' required="required" aria-required="true"' : '';
        $cssclass = $this->element['class'] ? ' class="' . (string) $this->element['class'] . '"' : '';
        $superclass = (string)$this->element['superclass'];

        $this->getClasses(JPATH_PLUGINS.DIRECTORY_SEPARATOR.'eventgallery_sur');
        $this->getClasses(JPATH_PLUGINS.DIRECTORY_SEPARATOR.'eventgallery_pay');
        $this->getClasses(JPATH_PLUGINS.DIRECTORY_SEPARATOR.'eventgallery_ship');

        if ($this->form->getField('id')->value!=0 && $this->value!="") {
            $class= $this->value;

            if ( class_exists($class ) ) {
                $classname = $class::getClassName();
            } else {
                $classname = 'invalid';
            }

            return  '<input '.$cssclass.' value="'.$classname.'" disabled="disabled"">';
        }

        $return  = '<select '.$required.' '.$cssclass.' name='.$this->name.' id='.$this->id.'>';
        foreach(get_declared_classes() as $class) {

            if (strpos($class, 'EventgalleryPlugins')!==false) {

                if (is_subclass_of($class, $superclass)) {
                    $return .= '<option value="'.$class.'">'.$class::getClassName().'</option>';
                }
            }
        }
        $return .= "</select>";

        return $return;

    }

    private function getClasses($path) {
        $directory = new RecursiveDirectoryIterator($path);
        $iterator = new RecursiveIteratorIterator($directory);
        // filer for the second subdirectory like /home/foo/xxxx/yyy.php
        $dirSep = '\\/\\\\';
        $regex = new RegexIterator($iterator, '/^'.preg_quote($path, '/')."[$dirSep][^$dirSep]+[$dirSep][^$dirSep]+\\.php$/i", RecursiveRegexIterator::GET_MATCH);
        foreach($regex as $object) {
            require_once($object[0]);
        }
    }


}