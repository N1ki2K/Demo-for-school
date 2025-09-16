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


class EventgalleryTableEmailtemplate extends JTable
{
	public $id = null;
	public $key = null;
	public $subject = null;
	public $body = null;
	public $attachments = null;
	public $language = null;
	public $ordering = null;
	public $published = null;
	public $modified = null;
	public $created = null;

    /**
     * Constructor
     * @param JDatabaseDriver $db
     */

	function __construct($db) {
		parent::__construct('#__eventgallery_emailtemplate', 'id', $db);
	}

    public function store($updateNulls = false) {
        $this->modified = date("Y-m-d H:i:s");
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

		if (isset($array['attachments']) && is_array($array['attachments']))
		{
			$registry = new JRegistry;
			$registry->loadArray($array['attachments']);
			$array['attachments'] = (string) $registry;
		}

		return parent::bind($array, $ignore);
	}
}
