<?php
/**
 * @package		Profiles
 * @subpackage	filemanger
 * @copyright	Copyright (C) 2013 - 2013 Mad4Media - Dipl. Informatiker(FH) Fahrettin Kutyol. All rights reserved.
 * @license		GNU General Public License version 2 or later; see LICENSE.txt
 * @license		Libraries can be under a different license in other environments
 * @license		Media files owned and created by Mad4Media such as 
 * @license 	Javascript / CSS / Shockwave or Images are licensed under GFML (GPL Friendly Media License). See GFML.txt.
 * @license		3rd party scripts are under the license of the copyright holder. See source header or license text file which is included in the appropriate folders
 * @version		1.0
 * @link		http://www.mad4media.de
 * Creation date 2013/02
 */

//CUSTOMPLACEHOLDER
//CUSTOMPLACEHOLDER2

defined('_JEXEC') or die;
	
	class MDatabase {
		
		// variable to hold connection
		var $connection = null;	
		// holding the sql query	
		var $sql = null;
		// database prefix
		var $prefix = null;	
			
		public function __construct($host=DB_SERVER, $user=DB_SERVER_USERNAME , $pass=DB_SERVER_PASSWORD, $db=DB_DATABASE, $prefix=DB_PREFIX)
			{
			global $error;
			$this->prefix = $prefix;
			if (!function_exists( 'mysql_connect')) MDebug::add("Function mysql_connect doesn't exist");
			
			
			if (phpversion() < '4.2.0') 
				{
					if (!($this->connection = @mysql_connect( $host, $user, $pass ))) 
						MDebug::add("Connection to database failed! [PHP<4.2.0]");
				}
			else 
				{
					if (!($this->connection = @mysql_connect( $host, $user, $pass, true )))
						MDebug::add("Connection to database failed! [PHP>=4.2.0]");
				}
				
			if ($db != '' && !mysql_select_db($db,$this->connection)) 
				MDebug::add("Databasename doesn't match!");
			}//EOF constructor	
		
		public function getEscaped($string) 
			{
			if (phpversion() < '4.3.0') 
				return mysql_escape_string($string);
		    else 	
				return mysql_real_escape_string($string, $this->connection);	
			}//EOF getEscaped
			
		public function quote($string)
			{
				return '\''.$string.'\'';
			}//EOF quote
			
		public function setQuery($sql) 
			{
				$sql = str_replace('#__',$this->prefix,$sql);
				$this->sql = mysql_query($sql,$this->connection); 
			}//EOF setQuery
			
		public function getAffectedRows() 
			{
			return mysql_affected_rows( $this->connection );
			}
		
		public function loadResultArray() 
			{
			if (!$this->sql) return null;
			
			$array = array();
				while ($row = mysql_fetch_row( $this->sql )) 
				{
					$array[] = $row;
				}
			mysql_free_result($this->sql);
			return $array;
			}//EOF loadResultArray
	
		public function loadObjectArray($key="") 
				{
				if (!$this->sql) return null;
				
				$array = array();
				while ($row = mysql_fetch_object( $this->sql )) 
						($key)?$array[$row->$key]=$row:$array[] = $row;	
				mysql_free_result($this->sql);
				return $array;
				}//EOF loadObjectArray
	
	
	
		public function close()
			{
			if($this->connection) mysql_close();	
			}//EOF Close
			
			
		public function insertid() 
			{
			return mysql_insert_id( $this->connection );
			}	
		
			
		}//EOF class
	
	
	