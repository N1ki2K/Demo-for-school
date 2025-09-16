ALTER TABLE  `#__eventgallery_watermark` ADD  `image_thumbthresholdsize` int(4) NOT NULL DEFAULT '0' AFTER `image_opacity`;
ALTER TABLE  `#__eventgallery_watermark` ADD  `default` int(1) NOT NULL DEFAULT 0 AFTER `published`;
ALTER TABLE  `#__eventgallery_file` ADD  `url` text NOT NULL AFTER `title`;
ALTER TABLE  `#__eventgallery_staticaddress` ADD  `state` varchar(255) NOT NULL AFTER `city`;
ALTER TABLE  `#__eventgallery_useraddress` ADD  `state` varchar(255) NOT NULL AFTER `city`;
ALTER TABLE  `#__eventgallery_folder` ADD  `foldertypeid` int(11) DEFAULT '0' AFTER `id`;
ALTER TABLE  `#__eventgallery_folder` ADD `metadata` TEXT NOT NULL AFTER `attribs`;

ALTER TABLE `#__eventgallery_imagetype` ADD `weight` DECIMAL( 4, 2 ) DEFAULT  '0' AFTER `size`;
ALTER TABLE `#__eventgallery_imagetype` ADD `depth` DECIMAL( 4, 2 ) DEFAULT  '0' AFTER `size`;
ALTER TABLE `#__eventgallery_imagetype` ADD `height` DECIMAL( 4, 2 ) DEFAULT  '0' AFTER `size`;
ALTER TABLE `#__eventgallery_imagetype` ADD `width` DECIMAL( 4, 2 ) DEFAULT  '0' AFTER `size`;

CREATE TABLE IF NOT EXISTS `#__eventgallery_foldertype` (
  `id` int(11) NOT NULL,
  `name` varchar(45) DEFAULT NULL,
  `folderhandlerclassname` varchar(200) DEFAULT NULL,
  `displayname` varchar(125) DEFAULT NULL,
  `default` int(1) NOT NULL DEFAULT 0,
  `ordering` int NULL DEFAULT NULL,
  `published` int(1) NULL DEFAULT NULL,
  `modified` timestamp NULL DEFAULT NULL,
  `created` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
);


INSERT INTO `#__eventgallery_foldertype`  (`id`, `name`, `folderhandlerclassname`, `displayname`, `default`, `ordering`, `published`, `modified`, `created`) VALUES
(0, 'local', 'EventgalleryLibraryFolderLocal', 'Local Images', 1, 1, 1, '0000-00-00 00:00:00', NULL),
(1, 'picasa', 'EventgalleryLibraryFolderPicasa', 'Google Photos Images', 0, 2, 1, '0000-00-00 00:00:00', NULL);


update `#__eventgallery_folder` set foldertypeid=1 where folder like '%@%';

