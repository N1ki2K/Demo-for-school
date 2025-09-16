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

define ('UTF32_BIG_ENDIAN_BOM'   , chr(0x00) . chr(0x00) . chr(0xFE) . chr(0xFF));
define ('UTF32_LITTLE_ENDIAN_BOM', chr(0xFF) . chr(0xFE) . chr(0x00) . chr(0x00));
define ('UTF16_BIG_ENDIAN_BOM'   , chr(0xFE) . chr(0xFF));
define ('UTF16_LITTLE_ENDIAN_BOM', chr(0xFF) . chr(0xFE));
define ('UTF8_BOM'               , chr(0xEF) . chr(0xBB) . chr(0xBF));

class MFile{

	// parses ini files e.g for MText
	public static function parseData($fileName, $asObject = false, $toLower= true){
		if(!file_exists($fileName)) {
			return null;
		}
		
		$lines = file($fileName);
		$return = ($asObject)? DataObject::instance():array();

		foreach ($lines as $line){
			$splitByEqual = explode("=",$line,2);
			if(sizeof($splitByEqual)==2){
				if($toLower){
					$splitByEqual[0] = strtolower($splitByEqual[0]);
				}
				if($asObject){
					$return->add(trim($splitByEqual[0]),trim($splitByEqual[1]));
				}else {
					$return[trim($splitByEqual[0])] = trim($splitByEqual[1]);
				}//EOF else
			}// EOF if
		}//EOF foreach
		return $return;
	}//EOF parseArray()

	
	public static function writeData($fileName = null,$data = null, $add = false){
		if(! trim($fileName)) return false;
		if( function_exists('file_put_contents')){
			$method = $add ? FILE_APPEND : null;
			return file_put_contents($fileName, $data, $method | LOCK_EX);
		}else{
			$method = $add ? 'a' : 'w';
			$status = fopen($fileName, $method);
			flock($status, LOCK_EX);
			if($status){
				fwrite($status, $data);
				fclose($status);
				flock($status, LOCK_UN);
				return true;
			}else{
				return false;
			}			
		}
	}
	
	public static function readData($fileName = null, $default = null){
		if(! trim($fileName) || ! self::isFile($fileName) || self::isDir($fileName)) return $default;
		if( function_exists('file_get_contents')) return file_get_contents($fileName);
		else{
			try {
				$contents ="";
				$handle = fopen($fileName, 'r');
				$contents = fread($handle, filesize($fileName));
				fclose($handle);
				return $contents;				
			}catch (Exception $e){
				return $default;
			}
			
		}
	}
	
	
	public static function copy($source,$destination,$overwrite=false){

	if(file_exists($destination)){
		if(self::isDir($source)){
			//TODO!!
		}
		
		if($overwrite){
			MFile::remove($destination);
		} else{
			return MText::_("filefolderexists");;
		}
	}

	if(! $return = copy($source,$destination)){
		}
	return $return; 
	}
	
	public static function move($source,$destination){
		if(!is_dir($destination) || !$destination) return "Destination is not a folder or is null!";
		$pi = pathinfo($source);
		$newName = $destination.DS.$pi['basename'];
		$error = null;
		if(file_exists($newName)){
			$error = MText::_("filefolderexists");
		}else{ 
			rename($source,$newName);
		}
		return $error;
	}
	
	
	public static function remove($fileName,$atAllCosts=false,$secondAttempt =false){
		if(self::isDir($fileName)){
			return $atAllCosts ? self::removeDirAtAllCosts($fileName) : self::removeDir($fileName)  ;
		}
		
		if(! $return = unlink($fileName)){
			if($atAllCosts && !$secondAttempt){
				MFile::chmod($fileName,0777);
				MFile::remove($fileName,true,true);				
			}
		}
	return $return; 
	}
	
	public static function isDir($dirName){
		return is_dir($dirName);
	}
	
	public static function isFile($fileName){
		return is_file($fileName);
	}
	
	public static function is($name){
		return file_exists($name);
	}
	
	public static function isWritable($fileName = null){
		if(! trim($fileName) || !self::is($fileName)) return false;
		else return is_writable($fileName);
	}
	
	public static function getSize($fileName = null){
		if(! self::is($fileName)) return false;
		return filesize($fileName);
	}
	
	public static function mkdir($dirName,$chmod = 0755){
		return self::createDir($dirName, $chmod);
	}

	public static function chmod($file,$mode,$isOctal=false){
	
	if(!$isOctal){
		$t = array(0000,1000,2000,3000,4000,5000,6000,7000);
		$h = array(0000,0100,0200,0300,0400,0500,0600,0700);
		$z = array(0000,0010,0020,0030,0040,0050,0060,0070);
		$e = array(0000,0001,0002,0003,0004,0005,0006,0007);
		
		$_t =  (int)  ($mode /1000);
		$mode = $mode %1000;
		$_h = (int)  ($mode /100);
		$mode = $mode %100;
		$_z = (int) ($mode /10);
		$_e = $mode %10;
		$octal = $t[$_t]+$h[$_h]+$z[$_z]+$e[$_e];
	}else {
		$octal = $mode;
	}	
	
	return chmod($file,$octal); 
	}
	
	public static function rename($oldName,$newName){
		return rename($oldName,$newName); 
	}
	
	public static function mode($fileName = null){
		if(! file_exists($fileName)){
			return null;
		}
		clearstatcache();
		return substr(decoct(fileperms($fileName)),2);
	}
	public static function info($name){
		if(! file_exists($name)){
				return null;
			}
		$info = DataObject::instance();
		$name =  str_replace("\\", '/', $name);
		$info->add("fileName",$name);
		$info->add("mode",MFile::mode($name));
		$info->add("permmask", MFile::permissionMask($name));
		$info->add("size",(int) filesize($name));
		$info->add("sizeKB",round(($info->size/1024),2));
		$info->add("sizeMB",round(($info->size/1048576),2));
		if($info->sizeMB >=1){
			$smart= $info->sizeMB." MB";
		}elseif($info->sizeKB >= 1){
			$smart= $info->sizeKB." KB";
		}else {
			$smart= $info->size." Bytes";
		}
		$info->add("smartSize",$smart);
		$info->add("type",filetype($name));
		$info->add("isDir",is_dir($name));
		$info->add("isFile",is_file($name));
		$info->add("lastModifiedTimestamp",filemtime($name));
		$info->add("lastModifiedDate",date("d.m.Y",$info->lastModifiedTimestamp));
		$info->add("lastModifiedTime",date("H:i",$info->lastModifiedTimestamp));
		$info->add("lastModified",date("d.m.Y H:i",$info->lastModifiedTimestamp));
		$pi = pathinfo($name);
		$info->add("dirName",$pi['dirname']);
		$info->add("baseName",utf8_encode($pi['basename']));
		
		$info->add("extension", strtolower(  isset($pi['extension']) ? $pi['extension'] : null   ));	
		$info->add("folderUp",($pi['basename']=='..'));	
		$owner = (fileowner($name)==0)?"n/a":fileowner($name);	
		$info->add("owner",$owner);	
		$info->add("isReadable",is_readable($name));
		$info->add("isWritable",is_writable($name));			
		
		$imgArray = array("gif","jpg","jpeg","png","ico","icon");
		$info->add("isImage",in_array(strtolower($info->extension),$imgArray));
		
		$docArray = array("doc"," docx","pdf","rtf","ps","lwp","txt","text","wps","htm","html","odt","ods","odp","pps","ppt","xml");
		$info->add("isDocument",in_array(strtolower($info->extension),$docArray));
		

		$audioArray = array("mp3","ra","ram","wav","wave","wma","au","mpa","m3u","aif","iff","mid","midi");
		$info->add("isAudio",in_array(strtolower($info->extension),$audioArray));
		
		$videoArray = array("avi","mov","movi","moov","qt","mp4","mpg","mpeg","rm","swf","wm","wmv","dvx","divx","flv","xvid");
		$info->add("isVideo",in_array(strtolower($info->extension),$videoArray));		
		
		$compressedArray = array("zip","rar","gz","gzip");
		$info->add("isCompressed",in_array(strtolower($info->extension),$compressedArray));
		$info->add("sub",null);				
		return $info;
	}

	public static function permissionMask($path = null){
		if(!$path) return null;
		
		$perms = fileperms($path);
		
		if (($perms & 0xC000) == 0xC000) {
			// Socket
			$info = 's';
		} elseif (($perms & 0xA000) == 0xA000) {
			// Symbolic Link
			$info = 'l';
		} elseif (($perms & 0x8000) == 0x8000) {
			// Regular
			$info = '-';
		} elseif (($perms & 0x6000) == 0x6000) {
			// Block special
			$info = 'b';
		} elseif (($perms & 0x4000) == 0x4000) {
			// Directory
			$info = 'd';
		} elseif (($perms & 0x2000) == 0x2000) {
			// Character special
			$info = 'c';
		} elseif (($perms & 0x1000) == 0x1000) {
			// FIFO pipe
			$info = 'p';
		} else {
			// Unknown
			$info = 'u';
		}
		
		// Owner
		$info .= (($perms & 0x0100) ? 'r' : '-');
		$info .= (($perms & 0x0080) ? 'w' : '-');
		$info .= (($perms & 0x0040) ?
				(($perms & 0x0800) ? 's' : 'x' ) :
				(($perms & 0x0800) ? 'S' : '-'));
		
		// Group
		$info .= (($perms & 0x0020) ? 'r' : '-');
		$info .= (($perms & 0x0010) ? 'w' : '-');
		$info .= (($perms & 0x0008) ?
				(($perms & 0x0400) ? 's' : 'x' ) :
				(($perms & 0x0400) ? 'S' : '-'));
		
		// World
		$info .= (($perms & 0x0004) ? 'r' : '-');
		$info .= (($perms & 0x0002) ? 'w' : '-');
		$info .= (($perms & 0x0001) ?
				(($perms & 0x0200) ? 't' : 'x' ) :
				(($perms & 0x0200) ? 'T' : '-'));
		return $info;
	}
	
	
	public static function getDir($parent=null,$allowUp = false){
		if(!is_dir($parent)) return null;
		$array = array();
		$dir = @opendir($parent);
		while ($entry = @readdir($dir)){
			if ($entry == '.') continue;
			if (!$allowUp && $entry == '..')continue;
			
			if(is_dir($parent.DS.$entry)){
				$array[] = MFile::info($parent.DS.$entry);
			}	
		}
		@closedir ($dir);
		asort($array);
		return $array;
	}
	
	public static function countDir($parent=null){
		if(!is_dir($parent)) return null;	
		$dir = @opendir($parent);
		$count = 0;
		while ($entry = @readdir($dir)){
			if ($entry == '.' || $entry == '..' || is_file($parent.DS.$entry)) continue;
			$count++;
		}	
		@closedir ($dir);
		return $count;
	}
	
	public static function hasSubDir($parent=null){
		if(!MFile::isDir($parent)) return null;
		$dir = @opendir($parent);
		while ($entry = @readdir($dir)){
			if ($entry == '.' || $entry == '..') continue;			
			if(is_dir($parent.DS.$entry)){
				return true;
			}	
		}
		@closedir ($dir);
		return false;	
	}
	
	public static function traverseDir($file,$level=-1){
		if(! MFile::is($file) || $level==0){
			return null;
		}
		$info = MFile::info($file);
		if($info->isFile){
			return null;
		}
		$array = array();
		$dir = @opendir($file);
		while ($entry = @readdir($dir)){
			if ($entry == '.' || $entry == '..') continue;
			if(MFile::isDir($file.DS.$entry)){
				
				$array[] = MFile::traverseDir($file.DS.$entry,($level-1));
			}	
		}
		@closedir ($dir);
		
		if(sizeof($array)>0){
			$info->sub = $array;
			return $info;	
		}else if($info){
			return $info;
		}else return null;
	}
	
	public static function filesInfo($dirName){
		if(! MFile::is($dirName) || ! MFile::isDir($dirName)){
			return null;
		}
		$array = array();
		$dir = @opendir($dirName);
		while ($entry = @readdir($dir)){
			if ($entry == '.' || $entry == '..') continue;
			if(MFile::isFile($dirName.DS.$entry)){
				$array[] = MFile::info($dirName.DS.$entry);
			}	
		}
		@closedir ($dir);
		asort($array);
		if(sizeof($array)>0){
			return $array;
		}else {
			return null;
		}
	}
	
	public static function filesByType($dirName,$type){
		if(! MFile::is($dirName) || ! MFile::isDir($dirName)){
			return null;
		}
		$isArray = (gettype($type)== "array");
		
		$array = array();
		$dir = @opendir($dirName);
		while ($entry = @readdir($dir)){
			if ($entry == '.' || $entry == '..') continue;
			if(MFile::isFile($dirName.DS.$entry)){
				$info = MFile::info($dirName.DS.$entry);
				if($isArray){
					$typeMatching = in_array($info->extension,$type);
				} else{
					$typeMatching = ($info->extension == $type);
				}
				if($typeMatching){
					$array[] = $info;	
				}
			}	
		}
		@closedir ($dir);
		if(sizeof($array)>0){
			return $array;
		}else {
			return null;
		}
	}
	
	
	
	
	public static function action($name,$action,$arguments){
		if(!file_exists($name)) return null;
		switch ($action){
			case 'parseData':return MFile::parseData($name) ;
			break;
			case 'chmod':return MFile::chmod($name,$arguments);
			break;
			case 'mode':return MFile::mode($name);
			break;
			default:
			case 'info':return MFile::info($name);
			break;
		}
	}
	
	
	
	//removes a dir with all files and folders inside
	public static function removeDir ($path) {
		if (!is_dir ($path)) {
			return -1;
		}
		$dir = @opendir ($path);
		if (!$dir) {
			return -2;
		}
		while ($entry = @readdir($dir)) {
			if ($entry == '.' || $entry == '..') continue;
			if (is_dir ($path.DS.$entry)) {
				$res = MFile::removeDir ($path.DS.$entry);
				if ($res == -1) {
					@closedir ($dir);
					return -2;
				} else if ($res == -2) {
					@closedir ($dir);
					return -2;
				} else if ($res == -3) {
					@closedir ($dir);
					return -3;
				} else if ($res != 0) {
					@closedir ($dir);
					return -2;
				}
			} else if (is_file ($path.DS.$entry) || is_link ($path.DS.$entry)) {
				$res = @unlink ($path.DS.$entry);
				if (!$res) {
					@closedir ($dir);
					return -2;
				}
			} else {
				@closedir ($dir);
				return -3;
			}
		}
		@closedir ($dir);

		$res = @rmdir ($path);

		if (!$res) {
			return -2;
		}
		return 0;
	}//EOF removeDir

	
	public static function removeDirAtAllCosts($path){
		if (!is_dir($path)) {
			return false;
		}
		
		$dir = @opendir($path);
		while ($entry = @readdir($dir)) {
			if ($entry == '.' || $entry == '..') continue;
			if (is_dir ($path.DS.$entry)) {
				MFile::removeDirAtAllCosts($path.DS.$entry);
			}else{
				chmod($path.DS.$entry,0777);
				unlink($path.DS.$entry);
			}
		}
		@closedir($dir);
		chmod($path,0777);
		rmdir($path);
		return true;
	}

	public static function createDir($dirPath = null, $chmod = 0755){
		return  $dirPath ? @mkdir( $dirPath , $chmod ) : false;
	}
	
	public static function unzip($source=null,$destination=null,$overwrite = true){
		if(! class_exists("dUnzip2") ){
			return null;
		}
		if(!$source || !$destination){
			return null;
		}
		$zip = new dUnzip2($source);
		$zip->debug = false; 
		$zip->getList();
		$zip->unzipAll($destination); 
		return true;
	}

	
	public static function getEncoding($filename){
		if(!file_exists($filename)) return null;
		$handle = fopen($filename,"r");
		$header = fread($handle,4);
		$sample = fread($handle,10240);
		fclose($handle);
		
		
		
	    $first2 = substr($header, 0, 2);
	    $first3 = substr($header, 0, 3);
	    $first4 = substr($header, 0, 3);
   
	    if ($first3 == UTF8_BOM) return 'UTF-8';
	    elseif ($first4 == UTF32_BIG_ENDIAN_BOM) return 'UTF-32BE';
	    elseif ($first4 == UTF32_LITTLE_ENDIAN_BOM) return 'UTF-32LE';
	    elseif ($first2 == UTF16_BIG_ENDIAN_BOM) return 'UTF-16BE';
	    elseif ($first2 == UTF16_LITTLE_ENDIAN_BOM) return 'UTF-16LE';
		

//	    ISO-8859-1  bis 16
		if(function_exists("iconv")){
			$sample2 = substr(trim($sample),0,20);
			$compareSample = md5($sample2);
			
			if($compareSample == md5(iconv("UTF-8","UTF-8",$sample2))) return "UTF-8";
			
			$count = 0;
			$iso = "ISO-8859-";
			while(++$count<17){
				if($compareSample==  md5(iconv($iso.$count,$iso.$count,$sample2)))	return $iso.$count;				
			}
			
			if($compareSample == md5(iconv("UTF-8","UTF-8",$sample2))) return "UTF-8";
			
			$windows = array(874,932,936,949,950,1250,1251,1252,1253,1254,1255,1256,1257,1258);
			
			foreach($windows as $win){
				if($compareSample == md5(iconv("Windows-".$win,"Windows-".$win,$sample2))) return "Windows-".$win;
			}			
		}
		
		if(function_exists("mb_detect_encoding")) return mb_detect_encoding($sample);
		else return null;
		
	}

	public static function isSubDir($subdir=null,$dir=null){
		if(!$dir || !$subdir) return false;
		
		if(gettype($dir)=="array"){
			
			foreach($dir as $d){
				if ( substr($subdir,0,strlen($d))== $d ) return true;
			}
			return false;
			
		}else{
			return ( substr($subdir,0,strlen($dir))== $dir );
		}
	}
	
	public static function cleanPath($path = null){
		$path = trim($path);
		if (empty($path)){ 
			return $GLOBALS['currentMainFolder'];
		}else{
			$path = preg_replace('#[/\\\\]+#', DS, $path);
		}
	
		return $path;
	}//EOF cleanPath
	
	public static function toBytes($value = null){
		$value = trim($value);
		$ext = strtolower($value[strlen($value)-1]);
		switch($ext) {
			case 'g':
				$value *= 1024;
			case 'm':
				$value *= 1024;
			case 'k':
				$value *= 1024;
		}
		
		return $value;
	}
	
	public static function bytesToFormat($bytes = 0){
		$bytes = (int) $bytes;
		$value = $bytes;
		$bytes /= 1024;
		if($bytes < 1) return $value . " Bytes";
		$value = $bytes;
		$bytes /= 1024;
		if($bytes < 1) return round($value,2) . " KB";
		$value = $bytes;
		$bytes /= 1024;
		if($bytes < 1) return round($value,2) . " MB";
		$value = $bytes;
		$bytes /= 1024;
		if($bytes < 1) return round($value,2) . " GB";
		$value = $bytes;
		$bytes /= 1024;
		return round($value,2) . " TB";		
	}
	
	public static function getMime($fileName = null){
		if(! trim($fileName) || ! self::is($fileName)) return false;
		if(function_exists('finfo_open')){
			$finfo = finfo_open(FILEINFO_MIME);
			$mime = finfo_file($finfo, $fileName);
			finfo_close($finfo);
			return $mime;
		}else if(function_exists('mime_content_type')){
			return mime_content_type($fileName);
		}
		return false;
	}
	
	public static function send2Browser($fileName = null){
		set_time_limit(0);
		//Purge 
		ob_get_clean();
		ob_get_clean();
		
		if(self::is($fileName)){
			$size = self::getSize($fileName);
			$mime = self::getMime($fileName);
			header('Content-type: ' . ($mime ? $mime : ' application') );
			header('Content-length: ' . $size );
			header('Content-Disposition: attachment; filename="'.basename($fileName).'"');
			header("Pragma: public");
			header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
			
			$ouputBuffering =  !! ini_get('output_buffering');
			$memoryLimit =  self::toBytes( ((ini_get("memory_limit")!="")?ini_get("memory_limit"):get_cfg_var("memory_limit")) );
			
			if($ouputBuffering && ($memoryLimit <= ($size + 102400) ) ){
				$file = @fopen($fileName,"rb");
				while(!feof($file)){
					print(@fread($file, 1024*8));
					ob_flush();
					flush();
				}
			}else{
				readfile($fileName);
			}
		}
		exit;
	}
	
	
}//EOF Class MFile
