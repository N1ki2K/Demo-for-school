CREATE TABLE IF NOT EXISTS `#__eventgallery_watermark` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `image` text DEFAULT NULL,
  `image_position` varchar(4) DEFAULT NULL,
  `image_margin_horizontal` int(4) DEFAULT NULL,
  `image_margin_vertical` int(4) DEFAULT NULL,
  `image_mode` varchar(45) DEFAULT NULL,
  `image_mode_prop` int(4) DEFAULT NULL,
  `image_opacity` int(4) DEFAULT NULL,
  `published` tinyint(1) NOT NULL DEFAULT '0',
  `ordering` int(11) NOT NULL DEFAULT 0,
  `modified` timestamp NULL DEFAULT NULL,
  `created` timestamp NULL DEFAULT NULL,
  
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

ALTER TABLE  `#__eventgallery_folder` ADD  `watermarkid` int(11) AFTER  `imagetypesetid`;