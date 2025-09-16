<?php
/**
 * @package     Sven.Bluege
 * @subpackage  com_eventgallery
 *
 * @copyright   Copyright (C) 2005 - 2013 Sven Bluege All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */
// no direct access
defined('_JEXEC') or die('Restricted access');

/**
 * Class EventgalleryTableFolder
 *
 */
class EventgalleryTableFolder extends JTable
{
    public $id = null;
    public $folder = null;
    public $picasakey = null;
    public $foldertags = null;
    public $date = null;
    public $description = null;
    public $published = null;
    public $text = null;
    public $hits = null;
    public $userid = null;
    public $ordering = null;
    public $password = null;
    public $passwordhint = null;
    public $cartable = null;
    public $imagetypesetid = null;
    public $watermarkid = null;
    public $modified = null;
    public $created = null;
    public $usergroupids = null;
    public $attribs = null;
    public $metadata = null;
    public $foldertypeid = null;
    public $sortattribute = null;
    public $sortdirection = null;
    public $shuffle_images = null;


    function __construct($db) {
        parent::__construct('#__eventgallery_folder', 'id', $db);

        JTableObserverTags::createObserver($this, array('typeAlias' => 'com_eventgallery.event'));
    }

    public function store($updateNulls = false) {
        $this->modified = date("Y-m-d H:i:s");
        if (empty($this->id))
        {
            // Set the values

            // Set ordering to the last item if not set
            if (empty($this->ordering))
            {
                $db = JFactory::getDbo();
                $db->setQuery('SELECT MAX(ordering) FROM #__eventgallery_folder');
                $max = $db->loadResult();

                $this->ordering = $max + 1;
            }
        }
        return parent::store($updateNulls);
    }


	/**
	 * Overloaded bind function
	 *
	 * @param   array  $array   Named array
	 * @param   mixed  $ignore  An optional array or space separated list of properties
	 *                          to ignore while binding.
	 *
	 * @return  mixed  Null if operation was satisfactory, otherwise returns an error string
	 *
	 * @see     JTable::bind
	 * @since   11.1
	 */
	public function bind($array, $ignore = '')
	{		

        if ($array instanceof stdClass ) {
           $array =  (array) $array;
        }

		if (isset($array['attribs']) && is_array($array['attribs']))
		{
			$registry = new JRegistry;
			$registry->loadArray($array['attribs']);
			$array['attribs'] = (string) $registry;
		}

		if (isset($array['metadata']) && is_array($array['metadata']))
		{
			$registry = new JRegistry;
			$registry->loadArray($array['metadata']);
			$array['metadata'] = (string) $registry;
		}
		
		return parent::bind($array, $ignore);
	}

}

