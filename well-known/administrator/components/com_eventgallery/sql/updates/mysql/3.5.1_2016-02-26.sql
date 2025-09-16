UPDATE `#__content_types` 
set
  `table` = '{"special":{"dbtable":"#__eventgallery_folder","key":"folder","type":"Folder","prefix":"EventgalleryTable","config":"array()"},"common":{"dbtable":"#__ucm_content","key":"ucm_id","type":"Corecontent","prefix":"JTable","config":"array()"}}'
WHERE 
	type_alias='com_eventgallery.event';
