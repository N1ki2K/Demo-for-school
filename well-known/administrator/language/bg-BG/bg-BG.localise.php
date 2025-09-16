<?php
/**
 * @version		$Id: language.php 15628 2010-03-27 05:20:29Z infograf768 $
 * @copyright	Copyright (C) 2005 - 2011 Open Source Matters, Inc. All rights reserved.
 * @license		GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

/**
 * bg-BG localise class
 *
 * @package		Joomla.Site
 * @since		1.6
 */
abstract class bg_BGLocalise {
	/**
	 * Returns the potential suffixes for a specific number of items
	 *
	 * @param	int $count  The number of items.
	 * @return	array  An array of potential suffixes.
	 * @since	1.6
	 */
	public static function getPluralSuffixes($count)
	{
		if ($count == 0) 
		{
			$return =  array('0');
		}
		elseif($count == 1) 
		{
			$return =  array('1');
		}
		else 
		{
			$return = array('MORE');
		}
		return $return;
	}
	/**
	 * Returns the ignored search words
	 *
	 * @return	array  An array of ignored search words.
	 * @since	1.6
	 */
	public static function getIgnoredSearchWords() {
		$search_ignore = array();
		$search_ignore[] = "и";
		$search_ignore[] = "в";
		$search_ignore[] = "или";
		$search_ignore[] = "на";
		$search_ignore[] = "за";
		$search_ignore[] = "по";
		$search_ignore[] = "с";
		return $search_ignore;
	}
	/**
	 * Returns the lower length limit of search words
	 *
	 * @return	integer  The lower length limit of search words.
	 * @since	1.6
	 */
	public static function getLowerLimitSearchWord() {
		return 2;
	}
	/**
	 * Returns the upper length limit of search words
	 *
	 * @return	integer  The upper length limit of search words.
	 * @since	1.6
	 */
	public static function getUpperLimitSearchWord() {
		return 100;
	}
	/**
	 * Returns the number of chars to display when searching
	 *
	 * @return	integer  The number of chars to display when searching.
	 * @since	1.6
	 */
	public static function getSearchDisplayedCharactersNumber() {
		return 1000;
	}
	public static function transliterate($string)
	{
		$str = JString::strtolower($string);
 
		//Specific language transliteration.
		//This one is for latin 1, latin supplement , extended A, Cyrillic, Greek
 
		$glyph_array = array(
		'a'		=>	'а,ъ',
		'b'		=>	'б',
		'v'		=>	'в',
		'g'		=>	'г',
		'd'		=>	'д',
		'e'		=>	'е',
		'zh'	=>	'ж',
		'z'		=>	'з',
		'i'		=>	'и,й',
		'k'		=>	'к',
		'l'		=>	'л',
		'm'		=>	'м',
		'n'		=>	'н',
		'o'		=>	'о',
		'p'		=>	'п',
		'r'		=>	'р',
		's'		=>	'с',
		't'		=>	'т',
		'u'		=>	'у',
		'f'		=>	'ф',
		'h'		=>	'х',
		'tz'	=>	'ц',
		'ch'	=>	'ч',
		'sh'	=>	'ш',
		'sht'	=>	'щ',
		'yo'	=>	'ь',
		'yu'	=>	'ю',
		'ya'	=>	'я'
		);
 
		foreach( $glyph_array as $letter => $glyphs ) {
			$glyphs = explode( ',', $glyphs );
			$str = str_replace( $glyphs, $letter, $str );
		}
 
		return $str;
	}
	
}

