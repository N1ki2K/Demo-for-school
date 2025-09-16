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


class EventgalleryTableFile extends JTable
{
	public $id = null;
	public $file = null;
    public $folder = null;
	public $hits = null;
	public $caption = null;
	public $title = null;
    public $creation_date = null;
    public $url = null;
	public $published = null;
	public $allowcomments = null;
	public $userid = null;
	public $ordering = null;
	public $ismainimage = null;
	public $ismainimageonly = null;
	public $modified = null;
	public $created = null;
    public $height = null;
    public $width = null;
    public $exif = null;
    public $picasa_url_image = null;
    public $picasa_url_originalimage = null;
    public $picasa_url_thumbnail = null;
    public $flickr_secret = null;
    public $flickr_secret_h = null;
    public $flickr_secret_k = null;
    public $flickr_secret_o = null;
    public $flickr_server = null;
    public $flickr_farm = null;
    public $s3_etag = null;
    public $s3_etag_thumbnails = null;

    /**
     * Constructor
     * @param JDatabaseDriver $db
     */

	function __construct($db) {
		parent::__construct('#__eventgallery_file', 'id', $db);
	}

    public function store($updateNulls = false) {
        $this->modified = date("Y-m-d H:i:s");
        return parent::store($updateNulls);
    }

    /**
     * Method to compact the ordering values of rows in a group of rows
     * defined by an SQL WHERE clause.
     *
     * @param   string  $where  WHERE clause to use for limiting the selection of rows to compact the ordering values.
     *
     * @return  mixed  Boolean  True on success.
     *
     * @link    http://docs.joomla.org/JTable/reorder
     * @since   11.1
     * @throws  UnexpectedValueException
     */
    public function reorder($where = '')
    {
        // If there is no ordering field set an error and return false.
        if (!property_exists($this, 'ordering'))
        {
            throw new UnexpectedValueException(sprintf('%s does not support ordering.', get_class($this)));
        }

        // Get the primary keys and ordering values for the selection.
        $query = $this->_db->getQuery(true)
            ->select(implode(',', $this->_tbl_keys) . ', ordering')
            ->from($this->_db->qn($this->_tbl))
            ->where('ordering > 0')
            ->order('ordering, file desc');

        // Setup the extra where and ordering clause data.
        if ($where)
        {
            $query->where($where);
        }

        $this->_db->setQuery($query);
        $rows = $this->_db->loadObjectList();

        // Compact the ordering values.
        foreach ($rows as $i => $row)
        {
            // Make sure the ordering is a positive integer.
            if ($row->ordering >= 0)
            {
                // Only update rows that are necessary.
                if ($row->ordering != $i + 1)
                {
                    // Update the row ordering field.
                    $query->clear()
                        ->update($this->_db->qn($this->_tbl))
                        ->set('ordering = ' . ($i + 1));
                    $this->appendPrimaryKeys($query, $row);
                    $this->_db->setQuery($query);
                    $this->_db->execute();
                }
            }
        }

        return true;
    }

    /**
     * Method to move a row in the ordering sequence of a group of rows defined by an SQL WHERE clause.
     * Negative numbers move the row up in the sequence and positive numbers move it down.
     *
     * @param   integer  $delta  The direction and magnitude to move the row in the ordering sequence.
     * @param   string   $where  WHERE clause to use for limiting the selection of rows to compact the
     *                           ordering values.
     *
     * @return  mixed    Boolean  True on success.
     *
     * @link    http://docs.joomla.org/JTable/move
     * @since   11.1
     * @throws  UnexpectedValueException
     */
    public function move($delta, $where = '')
    {

        // If the change is none, do nothing.
        if (empty($delta))
        {
            return true;
        }

        $row   = null;
        $query = $this->_db->getQuery(true);

        // Select the primary key and ordering values from the table.
        $query->select($this->_db->qn($this->_tbl_key) . ', ordering')
            ->from($this->_db->qn($this->_tbl));

        // If the movement delta is negative move the row up.
        if ($delta < 0)
        {
            $query->where('ordering < ' . (int) $this->ordering)
                ->order('ordering DESC');
        }
        // If the movement delta is positive move the row down.
        elseif ($delta > 0)
        {
            $query->where('ordering > ' . (int) $this->ordering)
                ->order('ordering ASC');
        }

        // Add the custom WHERE clause if set.
        if ($where)
        {
            $query->where($where);
        }

        // Select the first row with the criteria.
        $this->_db->setQuery($query, 0, 1);
        $row = $this->_db->loadObject();

        // If a row is found, move the item.
        if (!empty($row))
        {
            // Update the ordering field for this instance to the row's ordering value.

            // is we add a file with sorting 0 to the set of sorted elements we need to
            // increase the ordernumbers in this folder
            if ($this->ordering == 0 && $delta == 1) {

                $query->clear()
                    ->update($this->_db->qn($this->_tbl))
                    ->set('ordering = ordering + 1 ')
                    ->where('ordering > 0');
                $this->_db->setQuery($query);
                $this->_db->execute();

                $this->ordering = 2;
            }

            // set the new position for the item
            $query->clear()
                ->update($this->_db->qn($this->_tbl))
                ->set('ordering = ' . (int) $row->ordering);
            $this->appendPrimaryKeys($query);
            $this->_db->setQuery($query);
            $this->_db->execute();

            // if we remove an item from the set of sorted items we need to increase all sorting numbers
            // else we just switch position
            if ($this->ordering == 1 && $delta == -1) {

                $query->clear()
                    ->update($this->_db->qn($this->_tbl))
                    ->set('ordering = ordering - 1 ')
                    ->where('ordering > 0');
                $this->_db->setQuery($query);
                $this->_db->execute();

                $this->ordering = 1;
            } else {

                // Update the ordering field for the row to this instance's ordering value.
                $query->clear()
                    ->update($this->_db->qn($this->_tbl))
                    ->set('ordering = ' . (int) $this->ordering);
                $this->appendPrimaryKeys($query, $row);
                $this->_db->setQuery($query);
                $this->_db->execute();

                // Update the instance value.
                $this->ordering = $row->ordering;
            }
        }
        else
        {
            // if a field switches from 0 to 1 we have to increase all other ordering numbers
            // since we allow multiple items having the number of 1
            if ($this->ordering == 0 && $delta == 1) {

                $query->clear()
                    ->update($this->_db->qn($this->_tbl))
                    ->set('ordering = ordering + 1 ')
                    ->where('ordering > 0');
                $this->_db->setQuery($query);
                $this->_db->execute();

                $this->ordering = 1;
            }

            // Update the ordering field for this instance.
            $query->clear()
                ->update($this->_db->qn($this->_tbl))
                ->set('ordering = ' . (int) $this->ordering);
            $this->appendPrimaryKeys($query);
            $this->_db->setQuery($query);
            $this->_db->execute();
        }

        return true;
    }

    /**
     * Method to append the primary keys for this table to a query.
     *
     * MODIFICATION: use $this->_tbl_key instead if $this->_tbl_keys
     *
     * @param   JDatabaseQuery  $query  A query object to append.
     * @param   mixed           $pk     Optional primary key parameter.
     *
     * @return  void
     *
     * @since   12.3
     */
    public function appendPrimaryKeys($query, $pk = null)
    {
        $k = $this->_tbl_key;

        if (is_null($pk))
        {

             $query->where($this->_db->quoteName($k) . ' = ' . $this->_db->quote($this->$k));

        }
        else
        {
            if (is_string($pk))
            {
                $pk = array($this->_tbl_key => $pk);
            }

            $pk = (object) $pk;

            $query->where($this->_db->quoteName($k) . ' = ' . $this->_db->quote($pk->$k));

        }
    }
}
