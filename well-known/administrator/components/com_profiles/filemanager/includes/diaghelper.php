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

class MDiagHelper{
	
	protected static $params = array();
	
	protected static $server = array(
			array('safe_mode','=',0),
			array('safe_mode_gid','=',0),
			array('upload_max_size','summary',0),
			array('post_max_size','summary',0),
			array('memory_limit','summary',0),
			array('max_execution_time','summary',0),
			array('upload_tmp_dir','value',0),
			array('upload_tmp_dir_writable','=',1)
			);
	
	protected static $live = array(
			array('live_is_dir','=',1),
			array('live_is_file','=',1),
			array('live_create_dir','=',1),
			array('live_read_file','=',1),
			array('live_copy','=',1),
			array('live_rename','=',1),
			array('live_mode','=',1),
			array('live_chmod','=',1),
			array('live_write_file','=',1),
			array('live_zip','=',1),
			array('live_delete_file','=',1),
			array('live_delete_folder','=',1),
			array('live_unzip','=',1),
			array('live_move','=',1)
	);
	
	public static $sandboxError = 0;
	
	
	public static function start(){
		//PHP
		self::$params["safe_mode"] = (int) ini_get("safe_mode");
		self::$params["safe_mode_gid"] = (int) ini_get("safe_mode_gid");
		self::$params["upload_max_size"] = ini_get("upload_max_filesize");
    	self::$params["post_max_size"] = ini_get("post_max_size");
		self::$params["memory_limit"] = ((ini_get("memory_limit")!="")?ini_get("memory_limit"):get_cfg_var("memory_limit"));
		self::$params["max_execution_time"] = ini_get("max_execution_time");
		
		$uploadTmpDir = ini_get("upload_tmp_dir");
		$uploadTmpDir = $uploadTmpDir ? $uploadTmpDir : realpath(sys_get_temp_dir()); 
		self::$params["upload_tmp_dir"] = $uploadTmpDir;		
		self::$params["upload_tmp_dir_writable"] =  @is_writable($uploadTmpDir);
		self::$params["output_buffering"] = (int)  !! ini_get('output_buffering');
		
		//ZLIB
		self::$params["zlib"] = (int) function_exists('gzopen');
		
		
		//For future or commercial versions
		self::$params["xml_parser_create"] = (int) function_exists("xml_parser_create");
		//GD
		self::$params['gd'] = (int) (function_exists("gd_info") && function_exists("imagecopyresized") && function_exists("imagecopyresampled")) ;
			
		
		self::liveTests();
	}
	
	public static function liveTests(){
		// Set Sandbox to be writable if possible
		@MFile::chmod(_FM_SANDBOX, 755);
		if( ! MFile::isWritable(_FM_SANDBOX)){
			self::$sandboxError = 1;
			return false;
		}
		
		$assets = _FM_SANDBOX .DS . "assets" ;
		$fileSample = _FM_SANDBOX .DS . "assets" . DS ."sample.txt";
		$fileValidate = _FM_SANDBOX .DS . "assets" . DS ."validate.txt";
		$destinationFolder = _FM_SANDBOX . DS . "dest";
		// 1. isDir
		self::$params["live_is_dir"] = (int) @MFile::isDir($assets);
		
		// 2. isFile
		self::$params["live_is_file"] = (int) @MFile::isFile($fileSample);
		
		// 3. Create Dir 
		MFile::createDir($destinationFolder, 0755);
		self::$params["live_create_dir"] = (int) ( @MFile::is($destinationFolder) && @MFile::isDir($destinationFolder));
		
		// 4. Read
		$valid = MFile::readData($fileValidate);
		self::$params["live_read_file"] = (int) $valid == "valid";
		
		// 5. Copy
		MFile::copy($fileValidate, $destinationFolder . DS . basename($fileValidate));
// 		MFile::copy($fileValidate, _FM_SANDBOX . DS . "reserved.txt");
		self::$params["live_copy"] = (int) MFile::is($destinationFolder . DS . basename($fileValidate));
		
		// 6. Rename
		$newValidate = $destinationFolder . DS .  "deleteme.txt";
		MFile::rename($destinationFolder . DS . basename($fileValidate), $newValidate);
		self::$params["live_rename"] = (int) MFile::is($newValidate);
		
		// 7. mode read
		@MFile::chmod($newValidate, 444);
		$mode = MFile::mode($newValidate);
		self::$params["live_mode"] = (int)  (!! $mode);
		
		// 8. CHMOD
		MFile::chmod($newValidate, 666);
		self::$params["live_chmod"] =  (int) ( $mode != MFile::mode($newValidate) );
		
		// 9. Write (Create / Add File)
		MFile::writeData($newValidate,"new",true);
		$validnew = MFile::readData($newValidate);
		self::$params["live_write_file"] = (int) $validnew == "validnew";
		
		// 10. Pack
		$archive = new PclZip(_FM_SANDBOX. DS . 'packed.zip');
		$archive->add($destinationFolder,PCLZIP_OPT_REMOVE_PATH, $destinationFolder);
		self::$params["live_zip"] = (int) MFile::is(_FM_SANDBOX. DS . 'packed.zip');
		
		// 11. Delete File
		MFile::remove($newValidate, 1);
		self::$params["live_delete_file"] = (int) ! MFile::is($newValidate);
		
		// 12. Delete Folder
		MFile::removeDir($destinationFolder);
		self::$params["live_delete_folder"] = (int) ! MFile::is($destinationFolder);
		
		// 13. UNZIP
		$archive = new PclZip(_FM_SANDBOX. DS . 'packed.zip');
		$archive->extract(PCLZIP_OPT_PATH, _FM_SANDBOX);
		self::$params["live_unzip"] = (int) MFile::is(_FM_SANDBOX. DS . 'deleteme.txt');
		
		// 14. Move
		MFile::createDir($destinationFolder, 0777);
		MFile::move(_FM_SANDBOX. DS . 'deleteme.txt', $destinationFolder);
		self::$params["live_move"] = (int) MFile::is($newValidate);
		
		
		// Purge
		MFile::remove(_FM_SANDBOX. DS . 'packed.zip', 1);
		MFile::removeDirAtAllCosts($destinationFolder);
		
		
		
	}
	
	public static function getTests(){
		return self::$params;
	}
	
	
	public static function contentWrap($header = "main", $content = null){
		$header = $header ? $header : "main";
		$c = new MContainer();
		$c->add('<div class="mMaskHeading"><span>');
		$c->add(MText::_("heading_".$header, "diagnostics"));
		$c->add('</span></div>');
		$c->add('<div style="padding:10px;">');
		$c->add('<table class="mRightsTable"></tbody>');
		$c->add('<tr>');
		$c->add('<td class="heading">'. MText::_("setting","diagnostics").'</td>');
		$c->add('<td class="heading">'. MText::_("value","diagnostics").'</td>');
		$c->add('<td class="heading">'. MText::_("evaluation","diagnostics").'</td>');
		$c->add('<td class="heading">'. MText::_("info","diagnostics").'</td>');
		$c->add('</tr>');
		$c->add($content);
		$c->add('</tbody></table>');
		$c->add('</div>');
		return $c->get();
	}
	/**
	 * 
	 * @param string $task
	 * @param MConfig $config
	 * @param	array $error
	 */
	public static function generate(){
		$c = new MContainer();
		foreach(self::$server as $param){
			$result = "";
			$value = self::$params[$param[0]];
			switch ($param[1]){
				default:
					break;

				case "value":
					$result = self::$params[$param[0]] ;			
					break;	
					
				case "summary":
					$result = MText::_("seesummary","diagnostics");
					break;

				case "=":
					$result = ( self::$params[$param[0]]  == (int) $param[2]) ? '<img src="'. _FM_HOME_FOLDER.'/images/ok.png" />'  : '<img src="'. _FM_HOME_FOLDER.'/images/no.png"  />';		
					$value = $value ? MText::_("yes") : MText::_("no");			
					break;				
			}
			
			self::wrapElement($c, $param[0], $value , $result , $param[1], $param[2]);
		}

		$main = self::contentWrap("main", $c->get() ) . self::mainSummary() ;	

		$c->reset();
		if(! self::$sandboxError){
			foreach(self::$live as $param){
				$result = "";
				$value = self::$params[$param[0]];
				switch ($param[1]){
					default:
						break;
			
					case "value":
						$result = self::$params[$param[0]] ;
						break;
			
					case "summary":
						$result = MText::_("seesummary","diagnostics");
						break;
			
					case "=":
						$result = ( self::$params[$param[0]]  == (int) $param[2]) ? '<img src="'. _FM_HOME_FOLDER.'/images/ok.png" />'  : '<img src="'. _FM_HOME_FOLDER.'/images/no.png"  />';
						$value = $value ? MText::_("yes") : MText::_("no");
						break;
				}
			
				self::wrapElement($c, $param[0], $value , $result , $param[1], $param[2]);
			}
			
			$live =  self::contentWrap("live", $c->get() ) . self::liveSummary() ;
		}else{
			$c->add('<div class="mSummary error"><div style="padding: 10px;">');
			$c->add('<div class="mSummaryHeading">' .MText::_("heading_live","diagnostics") . ' - ' . MText::_("summary","diagnostics") . '</div><br/>');
			$c->add( sprintf( MText::_("sandbox_nowrite","diagnostics") , str_replace("\\", "/"  , _FM_SANDBOX ) ) );
			$c->add('</div></div>');
			
			$live =  $c->get() ;
		}
		
		$data = self::internalDataTest();
		
		return  self::checkFirstCall() .   $main . '<br/>' .$live . '<br/>' . $data;
	}
	/**
	 * 
	 * @param MContainer $c
	 * @param string $name
	 * @param any $value
	 * @param string $error
	 */
	public static function wrapElement(& $c, $key , $param, $result, $condition, $mustbe){		
		$desc = MText::_($key ."_desc","diagnostics");
		if($desc == $key ."_desc"){
			if($condition == "="){
				$cdt = '<span style="color:red;">' .  ( $mustbe ?  MText::_("enabled","diagnostics") :  MText::_("disabled","diagnostics") ) . '</span>';
				$desc  = (strpos($key, "live_") === 0) ?  
							sprintf( MText::_("mustbelive","diagnostics"), MText::_($key,"diagnostics") ) :  
							sprintf( MText::_("mustbe","diagnostics"), $cdt );
		
			}
		}
		$c->add('<tr>');
			$c->add('<td style="width:auto;">'.MText::_($key,"diagnostics") . '</td>'  );
			$c->add('<td style="width:auto;">'.$param . '</td>'  );
			$c->add('<td style="width:auto;">'.$result . '</td>'  );
			$c->add('<td style="width:auto;">'. $desc . '</td>'  );
		$c->add('</tr>');
	}
	
	public static function mainSummary(){
		$atAll = self::$params["upload_tmp_dir_writable"] && ( ! self::$params["safe_mode"] ) && ( ! self::$params["safe_mode_gid"] );
		$isErr =  $atAll ? "" : " error";
		
		$c = new MContainer();
		$c->add('<div class="mSummary'.$isErr.'"><div style="padding: 10px;">');
		$c->add('<div class="mSummaryHeading">' . MText::_("summary","diagnostics") . '</div><br/>');
		$c->add(MText::_("summary_consider","diagnostics").'<br/><br/>');
		if($atAll){
			$c->add(MText::_("summary_noerror","diagnostics").'<br/>');
		}else{
			if((  self::$params["safe_mode"] ) || (  self::$params["safe_mode_gid"] ) ){
				$c->add( '<b>' . MText::_("summary_error_safemode","diagnostics").'</b><br/>');	
			}
			if(( ! self::$params["upload_tmp_dir_writable"] ) ){
				$c->add(MText::_("summary_error_uploadtmp","diagnostics").'<br/>');	
			}
			$c->add(MText::_("summary_advice","diagnostics").'<br/>');
		}
		
		$c->add('<br/>');
		
		$realMaxUpload = ( MFile::toBytes(self::$params["post_max_size"]) < MFile::toBytes(self::$params["upload_max_size"]) ) ? self::$params["post_max_size"] : self::$params["upload_max_size"];
		
		$c->add( sprintf(MText::_("summary_uploadmax","diagnostics") ,$realMaxUpload));
		$c->add('<br/><br/>');
		$c->add( MText::_("summary_downloadopen","diagnostics") );
		
		$c->add('</div></div>');
		return $c->get();
	}
	
	public static function liveSummary(){
		$isError = 0;
		$errors = array();
		$count = 1;
			foreach (self::$live as $live){
				if(! self::$params[$live[0]]){
					array_push($errors, '<div style="display:block; color:red;">'. $count++ . '. ` ' . MText::_($live[0],"diagnostics") . ' `</div>' . "\n");
					$isError = 1;
				}
			}
		
		$isErr =  $isError ?  " error" : "" ;
	
		$c = new MContainer();
		$c->add('<div class="mSummary'.$isErr.'"><div style="padding: 10px;">');
		$c->add('<div class="mSummaryHeading">' . MText::_("summary","diagnostics") . '</div><br/>');
		$c->add(MText::_("summary_live_intro","diagnostics").'<br/><br/>');
		if(! $isError){
			$c->add(MText::_("summary_live_success","diagnostics").'<br/>');
		}else{
			$c->add(  sprintf( MText::_("summary_live_error","diagnostics"), implode("", $errors ) )   );
		}	
		$c->add('</div></div>');
		return $c->get();
	}
	
	public static function internalDataTest(){
		
		$isError = 0;
		$dataPath = _FM_HOME_DIR . DS."data";
		$rightsPath = $dataPath . DS . "rights";
		
		
		$isRightsFolder = 0;
		$isRightsFolderWritable = 0;
		$isDataFolderWritable = 0;
		$isDataFolder = (int) MFile::is($dataPath);
		if($isDataFolder){
			$isDataFolderWritable = (int) MFile::isWritable($dataPath);
			$isRightsFolder = (int) MFile::is($rightsPath);
			if($isRightsFolder){
				$isRightsFolderWritable = (int) MFile::isWritable($rightsPath);
			}else{
				$isRightsFolderWritable = 1;				
			}
		}else{
			$isRightsFolderWritable = 1;
			$isDataFolderWritable = 1;
		}
		
		$dataPath = str_replace("\\", "/", $dataPath);
		$rightsPath = str_replace("\\", "/", $rightsPath);
		
		$isError =  !($isRightsFolder && $isRightsFolderWritable && $isDataFolder && $isDataFolderWritable);
		
		
		$c = new MContainer();
		$c->add('<div class="mMaskHeading"><span>');
		$c->add(MText::_("heading_data", "diagnostics"));
		$c->add('</span></div>');
		
		$c->add('<div style="padding-top:10px;">');
		
		
		$isErr = $isError ? " error" : "";
		$c->add('<div class="mSummary'.$isErr.'"><div style="padding: 10px;">');
		$c->add('<div class="mSummaryHeading">' . MText::_("summary","diagnostics") . '</div><br/>');
		$c->add(  MText::_("data_intro","diagnostics")  . '<br/><br/>');
		
		if($isError){
			
			if(! $isDataFolder){
				$c->add(  sprintf( MText::_("data_error_nodata","diagnostics"), $dataPath)  ."<br/><br/>");
			}
			
			if(! $isDataFolderWritable){
				$c->add(  sprintf( MText::_("data_error_nodatawrite","diagnostics"), $dataPath)  ."<br/><br/>");
			}
			
			if(! $isRightsFolder){
				$c->add(  sprintf( MText::_("data_error_norights","diagnostics"), $rightsPath)  ."<br/><br/>");
			}
			
			if(! $isRightsFolderWritable){
				$c->add(  sprintf( MText::_("data_error_norightswrite","diagnostics"), $rightsPath)  ."<br/>");
			}
			
			
		}else{
			$c->add(  MText::_("data_success","diagnostics") );
		}
		
		$c->add('</div></div></div>');
		
		return $c->get();
	}
	
	public static function checkFirstCall(){
		$path = _FM_HOME_DIR . DS."data" . DS . "diagnostic_log.php";
		if(! MFile::is($path)){
			return '<span style="font-size: 16px; font-weight: bold; color: #0B55C4;">' .  MText::_("first_call","diagnostics") . '</span><br/><br/>';
		}else return "";
	}
	
	public static function save(){
		$path = _FM_HOME_DIR . DS."data" . DS . "diagnostic_log.php";
		$buffer = '<?PHP die(); /**'."\n";
		foreach(self::$params as $key => $value){
			$buffer .= $key . "\t" . $value . "\n";
		}
		$buffer .= "*/";
		return @MFile::writeData($path,$buffer);
	}
	
	
}//EOF class