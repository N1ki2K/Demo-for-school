CREATE TABLE IF NOT EXISTS `#__eventgallery_emailtemplate` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `key` varchar(255) NOT NULL DEFAULT '',
  `subject` varchar(255) NOT NULL DEFAULT '',
  `body` text,
  `language` varchar(10) NOT NULL DEFAULT '*',
  `published` tinyint(1) NOT NULL DEFAULT '0',
  `ordering` int(11) NOT NULL DEFAULT 0,
  `modified` timestamp NULL DEFAULT NULL,
  `created` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;

ALTER TABLE `#__eventgallery_staticaddress` ADD `companyname` varchar(255) DEFAULT NULL AFTER `lastname`;
ALTER TABLE `#__eventgallery_staticaddress` ADD `taxid` varchar(255) DEFAULT NULL AFTER `companyname`;
ALTER TABLE `#__eventgallery_useraddress`   ADD `companyname` varchar(255) DEFAULT NULL AFTER `lastname`;
ALTER TABLE `#__eventgallery_useraddress`   ADD `taxid` varchar(255) DEFAULT NULL AFTER `companyname`;
ALTER TABLE `#__eventgallery_order`			ADD `version` bigint DEFAULT 0 AFTER `created`;
ALTER TABLE `#__eventgallery_paymentmethod`   ADD `price_percentaged` decimal(8,2) DEFAULT 0 AFTER `price`;
ALTER TABLE `#__eventgallery_shippingmethod`  ADD `price_percentaged` decimal(8,2) DEFAULT 0 AFTER `price`;
ALTER TABLE `#__eventgallery_surcharge`       ADD `price_percentaged` decimal(8,2) DEFAULT 0 AFTER `price`;

INSERT INTO `#__content_types` (`type_id`, `type_title`, `type_alias`, `table`, `rules`, `field_mappings`, `router`, `content_history_options`) VALUES (NULL, 'Eventgallery Category', 'com_eventgallery.category', '{"special":{"dbtable":"#__categories","key":"id","type":"Category","prefix":"JTable","config":"array()"},"common":{"dbtable":"#__ucm_content","key":"ucm_id","type":"Corecontent","prefix":"JTable","config":"array()"}}', '', '{"common":{"core_content_item_id":"id","core_title":"title","core_state":"published","core_alias":"alias","core_created_time":"created_time","core_modified_time":"modified_time","core_body":"description", "core_hits":"hits","core_publish_up":"null","core_publish_down":"null","core_access":"access", "core_params":"params", "core_featured":"null", "core_metadata":"metadata", "core_language":"language", "core_images":"null", "core_urls":"null", "core_version":"version", "core_ordering":"null", "core_metakey":"metakey", "core_metadesc":"metadesc", "core_catid":"parent_id", "core_xreference":"null", "asset_id":"asset_id"}, "special": {"parent_id":"parent_id","lft":"lft","rgt":"rgt","level":"level","path":"path","extension":"extension","note":"note"}}', '', '');
