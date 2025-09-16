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


class EventgalleryTableComment extends JTable
{
	public $id = null;
	public $file = null;
    public $folder = null;
	public $text = null;
	public $name = null;
	public $link = null;
	public $email = null;
	public $user_id = null;
	public $date = null;
	public $ip = null;
	public $published = null;
	public $modified = null;
	public $created = null;
  

    /**
     * Constructor
     * @param JDatabaseDriver $db
     */

	function __construct($db) {
		parent::__construct('#__eventgallery_comment', 'id', $db);
	}

    public function store($updateNulls = false) {
        $this->modified = date("Y-m-d H:i:s");
        return parent::store($updateNulls);
    }
}
