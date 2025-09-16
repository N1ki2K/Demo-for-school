DROP TABLE IF EXISTS `#__eventgallery_comment`;
CREATE TABLE IF NOT EXISTS `#__eventgallery_comment` (
  `id` int(11) NOT NULL auto_increment,
  `file` varchar(125) NOT NULL,
  `folder` varchar(125) NOT NULL,
  `text` text NOT NULL,
  `name` varchar(255) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `ip` varchar(15) NOT NULL,
  `published` tinyint(4) NOT NULL default '1',
  `date` datetime NOT NULL,
  `email` varchar(255) NOT NULL,
  `link` varchar(255) NOT NULL,
  `modified` timestamp NULL DEFAULT NULL,
  `created` timestamp NULL DEFAULT NULL, 
  PRIMARY KEY  (`id`),
  KEY `filefolderkey` (`folder`,`file`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;

DROP TABLE IF EXISTS `#__eventgallery_file`;
CREATE TABLE IF NOT EXISTS `#__eventgallery_file` (
  `id` int(11) NOT NULL auto_increment,
  `folder` varchar(125) NOT NULL,
  `file` varchar(125) NOT NULL,
  `width` int(10),
  `height` int(10),
  `caption` text,
  `title` text,
  `creation_date` varchar(100),
  `picasa_url_image` text,
  `picasa_url_originalimage` text,
  `picasa_url_thumbnail` text,
  `flickr_secret` text,
  `flickr_secret_h` text,
  `flickr_secret_k` text,
  `flickr_secret_o` text,
  `flickr_server` text,
  `flickr_farm` text,
  `s3_etag` text,
  `s3_etag_thumbnails` text,
  `url` text,
  `exif` text,
  `ordering` int(10),
  `ismainimage` tinyint(4) NOT NULL default '0',
  `ismainimageonly` tinyint(4) NOT NULL default '0',
  `hits` int(11) NOT NULL default '0',
  `published` tinyint(4) NOT NULL default '1',
  `allowcomments` tinyint(4) NOT NULL default '1',
  `userid` int(11) NOT NULL,
  `modified` timestamp NULL DEFAULT NULL,
  `created` timestamp NULL DEFAULT NULL,
  PRIMARY KEY  (`id`),
  UNIQUE KEY `file` (`folder`,`file`),
  KEY `index_file` (`file`),
  KEY `index_folder` (`folder`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;

DROP TABLE IF EXISTS `#__eventgallery_foldertype`;
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

DROP TABLE IF EXISTS `#__eventgallery_folder`;
CREATE TABLE IF NOT EXISTS `#__eventgallery_folder` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `foldertypeid` int(11) DEFAULT '0',
  `picasakey` varchar(125) DEFAULT NULL,
  `password` VARCHAR( 250 ) NOT NULL,
  `passwordhint` text,
  `cartable` TINYINT( 1 ) NOT NULL DEFAULT  '1',
  `foldertags` text,
  `description` varchar(255) NOT NULL,
  `date` datetime NOT NULL,
  `published` tinyint(4) NOT NULL DEFAULT '1',
  `folder` varchar(125) NOT NULL,
  `imagetypesetid` int(11) DEFAULT NULL,
  `watermarkid` int(11) DEFAULT NULL,
  `text` text,
  `hits` int(11) NOT NULL default '0',
  `userid` int(11) NOT NULL,
  `modified` timestamp NULL DEFAULT NULL,
  `created` timestamp NULL DEFAULT NULL,
  `ordering` int(10) unsigned NOT NULL DEFAULT '0',
  `usergroupids` text,
  `attribs` text,
  `metadata` text,
  `catid` int(11) NOT NULL DEFAULT '0',
  `language` varchar(125) NOT NULL DEFAULT '*',
  `sortattribute` varchar(100),
  `sortdirection` varchar(10),
  `shuffle_images` tinyint(4) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `folder` (`folder`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;


DROP TABLE IF EXISTS `#__eventgallery_sequence`;
CREATE TABLE IF NOT EXISTS `#__eventgallery_sequence` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `value` int(1) DEFAULT NULL,
   PRIMARY KEY (`id`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;
--
-- Tabellenstruktur für Tabelle `#__eventgallery_imagelineitem`
--
DROP TABLE IF EXISTS `#__eventgallery_imagelineitem`;
CREATE TABLE IF NOT EXISTS `#__eventgallery_imagelineitem` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `folder` varchar(255) NOT NULL,
  `file` varchar(255) NOT NULL,
  `quantity` int(10) unsigned NOT NULL DEFAULT '1',
  `imagetypeid` int(11) DEFAULT NULL,
  `taxrate` DECIMAL( 4, 2 ) DEFAULT  '0',
  `price` decimal(8,2) NOT NULL,
  `singleprice` decimal(8,2) NOT NULL,
  `currency` varchar(3) NOT NULL,
  `buyernote` text,
  `sellernote` text,
  `lineitemcontainerid` varchar(50) DEFAULT NULL,
  `modified` timestamp NULL DEFAULT NULL,
  `created` timestamp NULL DEFAULT NULL,  
  PRIMARY KEY (`id`),
  KEY `id_idx1` (`lineitemcontainerid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

--
-- Tabellenstruktur für Tabelle `#__eventgallery_servicelineitem`
--
DROP TABLE IF EXISTS `#__eventgallery_servicelineitem`;
CREATE TABLE IF NOT EXISTS `#__eventgallery_servicelineitem` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `methodid` int(4) DEFAULT NULL,
  `lineitemcontainerid` varchar(50) DEFAULT NULL,
  `type` int(4) DEFAULT NULL,
  `quantity` int(10) unsigned NOT NULL DEFAULT '1',
  `name` varchar(45) DEFAULT NULL,
  `displayname` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `data` text DEFAULT NULL,
  `taxrate` DECIMAL( 4, 2 ) DEFAULT  '0',
  `price` decimal(8,2) NOT NULL,
  `singleprice` decimal(8,2) NOT NULL,
  `currency` varchar(3) NOT NULL,
  `ordering` int(11) NOT NULL DEFAULT 0,
  `modified` timestamp NULL DEFAULT NULL,
  `created` timestamp NULL DEFAULT NULL,  
  PRIMARY KEY (`id`),
  KEY `id_idx1` (`lineitemcontainerid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------
DROP TABLE IF EXISTS `#__eventgallery_imagetypeset`;
CREATE TABLE IF NOT EXISTS `#__eventgallery_imagetypeset` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `note` text DEFAULT NULL,
  `default` int(1) NOT NULL DEFAULT 0,
  `ordering` int NULL DEFAULT NULL,
  `published` int(1) NULL DEFAULT NULL,
  `modified` timestamp NULL DEFAULT NULL,
  `created` timestamp NULL DEFAULT NULL,

  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;


DROP TABLE IF EXISTS `#__eventgallery_useraddress`;
CREATE TABLE IF NOT EXISTS `#__eventgallery_useraddress` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userid` varchar(45) NOT NULL,
  `firstname` varchar(255) DEFAULT NULL,
  `lastname` varchar(255) DEFAULT NULL,
  `companyname` varchar(255) DEFAULT NULL,
  `taxid` varchar(255) DEFAULT NULL,
  `address1` varchar(255) DEFAULT NULL,
  `address2` varchar(255) DEFAULT NULL,
  `address3` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `state` varchar(255) DEFAULT NULL,
  `country` varchar(255) DEFAULT NULL,
  `zip` varchar(10) DEFAULT NULL,
  `default` int(1) NOT NULL DEFAULT 0,
  `modified` timestamp NULL DEFAULT NULL,
  `created` timestamp NULL DEFAULT NULL,

  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

DROP TABLE IF EXISTS `#__eventgallery_staticaddress`;
CREATE TABLE IF NOT EXISTS `#__eventgallery_staticaddress` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `firstname` varchar(255) DEFAULT NULL,
  `lastname` varchar(255) DEFAULT NULL,
  `companyname` varchar(255) DEFAULT NULL,
  `taxid` varchar(255) DEFAULT NULL,
  `address1` varchar(255) DEFAULT NULL,
  `address2` varchar(255) DEFAULT NULL,
  `address3` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `state` varchar(255) DEFAULT NULL,
  `country` varchar(255) DEFAULT NULL,
  `zip` varchar(10) DEFAULT NULL,
  `valid` int(1) DEFAULT 0,
  `modified` timestamp NULL DEFAULT NULL,
  `created` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

DROP TABLE IF EXISTS `#__eventgallery_imagetypeset_imagetype_assignment`;
CREATE TABLE IF NOT EXISTS `#__eventgallery_imagetypeset_imagetype_assignment` (
  `imagetypesetid` int(11) NOT NULL,
  `imagetypeid` int(11) NOT NULL,
  `default` int(1) NOT NULL DEFAULT 0,
  `ordering` int(11) NOT NULL DEFAULT 0,
  `modified` timestamp NULL DEFAULT NULL,
  `created` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`imagetypesetid`,`imagetypeid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ;


--
-- Tabellenstruktur für Tabelle `#__eventgallery_imagetype`
--
DROP TABLE IF EXISTS `#__eventgallery_imagetype`;
CREATE TABLE IF NOT EXISTS `#__eventgallery_imagetype` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` varchar(45) DEFAULT NULL,
  `isdigital` int(1) DEFAULT 0,
  `size` varchar(45) DEFAULT NULL,
  `width` DECIMAL( 4, 2 ) DEFAULT  '0',
  `height` DECIMAL( 4, 2 ) DEFAULT  '0',
  `depth` DECIMAL( 4, 2 ) DEFAULT  '0',
  `weight` DECIMAL( 4, 2 ) DEFAULT  '0',
  `taxrate` DECIMAL( 4, 2 ) DEFAULT  '0',
  `price` decimal(8,2) DEFAULT NULL,
  `scaleprice` text DEFAULT NULL,
  `scalepricescope` varchar(32) DEFAULT NULL,
  `scalepricetype` varchar(32) DEFAULT NULL,
  `flatprice` DECIMAL( 8, 2 ) DEFAULT  '0',
  `currency` varchar(3) NOT NULL,
  `maxorderquantity` int DEFAULT  '0',
  `name` varchar(255) DEFAULT NULL,
  `displayname` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `published` int(1) NULL DEFAULT NULL,
  `note` text DEFAULT NULL,
  `modified` timestamp NULL DEFAULT NULL,
  `created` timestamp NULL DEFAULT NULL,

  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `#__eventgallery_cart`
--
DROP TABLE IF EXISTS `#__eventgallery_cart`;
CREATE TABLE IF NOT EXISTS `#__eventgallery_cart` (
  `id` varchar(50) NOT NULL ,
  `documentno` int(11) DEFAULT NULL,
  `userid` varchar(45) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `statusid` int(11) DEFAULT NULL,
  `subtotal` decimal(8,2) DEFAULT NULL,
  `subtotalcurrency` varchar(3) NOT NULL,
  `total` decimal(8,2) DEFAULT NULL,
  `totalcurrency` varchar(3) NOT NULL,
  `billingaddressid` int(11) DEFAULT NULL,
  `shippingaddressid` int(11) DEFAULT NULL,
  `message` text DEFAULT NULL,
  `modified` timestamp NULL DEFAULT NULL,
  `created` timestamp NULL DEFAULT NULL,

  PRIMARY KEY (`id`),
  KEY `id_idx` (`statusid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

DROP TABLE IF EXISTS `#__eventgallery_order`;
CREATE TABLE IF NOT EXISTS `#__eventgallery_order` (
  `id` varchar(50) NOT NULL ,
  `documentno` varchar(45) DEFAULT NULL,
  `orderstatusid` int(11) DEFAULT NULL,
  `paymentstatusid` int(11) DEFAULT 0,
  `shippingstatusid` int(11) DEFAULT 0,
  `userid` varchar(45) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `subtotal` decimal(8,2) DEFAULT NULL,
  `subtotalcurrency` varchar(3) NOT NULL,
  `total` decimal(8,2) DEFAULT NULL,
  `totalcurrency` varchar(3) NOT NULL,
  `billingaddressid` int(11) DEFAULT NULL,
  `shippingaddressid` int(11) DEFAULT NULL,
  `message` text DEFAULT NULL,
  `modified` timestamp NULL DEFAULT NULL,
  `created` timestamp NULL DEFAULT NULL,
  `version` bigint DEFAULT 0,
  `token` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_idx` (`orderstatusid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `#__eventgallery_orderstatus`
--
DROP TABLE IF EXISTS `#__eventgallery_orderstatus`;
CREATE TABLE IF NOT EXISTS `#__eventgallery_orderstatus` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `default` int(1) NOT NULL DEFAULT 0,
  `systemmanaged` int(1) NOT NULL DEFAULT 0,
  `type` int(2) NOT NULL DEFAULT 0,
  `ordering` int(11) NOT NULL DEFAULT 0,
  `displayname` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `modified` timestamp NULL DEFAULT NULL,
  `created` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `#__eventgallery_paymentmethod`
--
DROP TABLE IF EXISTS `#__eventgallery_paymentmethod`;
CREATE TABLE IF NOT EXISTS `#__eventgallery_paymentmethod` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  `supportsdigital` int(1) DEFAULT 0,
  `displayname` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `data` text DEFAULT NULL,
  `classname` varchar(255) DEFAULT NULL,
  `taxrate` DECIMAL( 4, 2 ) DEFAULT  '0',
  `price` decimal(8,2) NOT NULL DEFAULT 0,
  `price_percentaged` decimal(8,2) DEFAULT 0,
  `currency` varchar(3) NOT NULL,
  `published` tinyint(1) NOT NULL DEFAULT '0',
  `default` int(1) NOT NULL DEFAULT 0,
  `ordering` int(11) NOT NULL DEFAULT 0,
  `modified` timestamp NULL DEFAULT NULL,
  `created` timestamp NULL DEFAULT NULL,  
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `#__eventgallery_shippingmethod`
--
DROP TABLE IF EXISTS `#__eventgallery_shippingmethod`;
CREATE TABLE IF NOT EXISTS `#__eventgallery_shippingmethod` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  `supportsdigital` int(1) DEFAULT 0,
  `needsaddressdata` int(1) DEFAULT 1,
  `displayname` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `data` text DEFAULT NULL,
  `classname` varchar(255) DEFAULT NULL,
  `taxrate` DECIMAL( 4, 2 ) DEFAULT  '0',
  `price` decimal(8,2) NOT NULL DEFAULT 0,
  `price_percentaged` decimal(8,2) DEFAULT 0,
  `currency` varchar(3) NOT NULL,
  `published` tinyint(1) NOT NULL DEFAULT '0',
  `default` int(1) NOT NULL DEFAULT 0,
  `ordering` int(11) NOT NULL DEFAULT 0,
  `modified` timestamp NULL DEFAULT NULL,
  `created` timestamp NULL DEFAULT NULL,
  
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `#__eventgallery_surcharge`
--
DROP TABLE IF EXISTS `#__eventgallery_surcharge`;
CREATE TABLE IF NOT EXISTS `#__eventgallery_surcharge` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  `displayname` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `data` text DEFAULT NULL, 
  `classname` varchar(255) DEFAULT NULL,
  `taxrate` DECIMAL( 4, 2 ) DEFAULT  '0',
  `price` decimal(8,2) NOT NULL DEFAULT 0,
  `price_percentaged` decimal(8,2) DEFAULT 0,
  `currency` varchar(3) NOT NULL,
  `published` tinyint(1) NOT NULL DEFAULT '0',
  `ordering` int(11) NOT NULL DEFAULT 0,
  `default` int(1) NOT NULL DEFAULT 0,
  `rule` int(11) DEFAULT NULL,
  `modified` timestamp NULL DEFAULT NULL,
  `created` timestamp NULL DEFAULT NULL,
  
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

--
-- Tabellenstruktur für Tabelle `#__eventgallery_watermark`
--
DROP TABLE IF EXISTS `#__eventgallery_watermark`;
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
  `image_thumbthresholdsize` int(4) DEFAULT '0',
  `published` tinyint(1) NOT NULL DEFAULT '0',
  `default` int(1) NOT NULL DEFAULT 0,
  `ordering` int(11) NOT NULL DEFAULT 0,
  `modified` timestamp NULL DEFAULT NULL,
  `created` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

--
-- Tabellenstruktur für Tabelle `#__eventgallery_emailtemplate`
--
DROP TABLE IF EXISTS `#__eventgallery_emailtemplate`;
CREATE TABLE IF NOT EXISTS `#__eventgallery_emailtemplate` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `key` varchar(255) NOT NULL DEFAULT '',
  `subject` varchar(255) NOT NULL DEFAULT '',
  `body` text,
  `attachments` text,
  `language` varchar(10) NOT NULL DEFAULT '*',
  `published` tinyint(1) NOT NULL DEFAULT '0',
  `ordering` int(11) NOT NULL DEFAULT 0,
  `modified` timestamp NULL DEFAULT NULL,
  `created` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;

--
-- Tabellenstruktur für Tabelle `#__eventgallery_auth_token`
--
DROP TABLE IF EXISTS `#__eventgallery_auth_token`;
CREATE TABLE IF NOT EXISTS `#__eventgallery_auth_token` (
  `refresh_token_hash` varchar(255) NOT NULL DEFAULT '',
  `access_token` varchar(255) NOT NULL DEFAULT '',
  `valid_until` timestamp NULL DEFAULT NULL,
    PRIMARY KEY (`refresh_token_hash`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


DROP TABLE IF EXISTS `#__eventgallery_state`;
CREATE TABLE IF NOT EXISTS `#__eventgallery_state` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `countrycode` varchar(3) NOT NULL DEFAULT '',
  `statecode` varchar(10) NOT NULL DEFAULT '',
  `statename` varchar(255) NOT NULL DEFAULT '',
  `language` varchar(10) NOT NULL DEFAULT '*',
  `published` tinyint(1) NOT NULL DEFAULT '0',
  `ordering` int(11) NOT NULL DEFAULT 0,
  `modified` timestamp NULL DEFAULT NULL,
  `created` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `statecodekey` (`statecode`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;

--
-- Daten für Tabelle `#__eventgallery_imagetype`
--
INSERT INTO `#__eventgallery_imagetype` (`id`, `published`, `type`, `isdigital`, `maxorderquantity`, `size`, `taxrate`, `price`, `scaleprice`, `scalepricescope`, `scalepricetype`, `currency`, `name`, `displayname`, `description`, `note`, `modified`, `created`) VALUES
(1, 1, 'paper', 0, 0,'13x18', 19, 0.70, '[{"quantity":"10","price":"2.00"},{"quantity":"20","price":"1.49"},{"quantity":"50","price":"1.00"}]', 'imagetype', 'discount', 'EUR', 'Fotoabzug 13x18', '{"en-GB":"Print 5x7","de-DE":"Foto 13x18"}', '{"en-GB":"A print with the size of 5x7 on premium photo paper","de-DE":"Ein Abzug der Größe 13x18 auf Premium-Fotopapier"}', 'I''ll order this using my favorite print service.', '0000-00-00 00:00:00', NULL),
(2, 1, 'paper', 0, 0,'10x15', 19, 0.90, '', '', '', 'EUR', 'Fotoabzug 10x15', '{"en-GB":"Print 4x5","de-DE":"Foto 11x13"}', '{"en-GB":"A print with the size of 4x5 on premium photo paper","de-DE":"Ein Abzug der Größe 11x13 auf Premium-Fotopapier"}', 'I''ll order this using my favorite print service', NULL, NULL),
(3, 0, 'digital', 1, 1,'0', 19, 12.40, '', '', '', 'EUR', 'Digitale Kopie', '{"en-GB":"Digital Copy","de-DE":"Digitale Kopie"}', '{"en-GB":"A digital copy of the original image","de-DE":"Eine Kopie des originalen Bildes."}', 'Copy from my hard drive', '0000-00-00 00:00:00', NULL),
(4, 1, 'paper', 0, 0,'13x18', 19, 2.00, '[{"quantity":"10","price":"2.00"},{"quantity":"20","price":"1.49"},{"quantity":"50","price":"1.00"}]', 'imagetype', 'discount', 'EUR', 'Fotoabzug Premium 13x18', '{"en-GB":"Premium Print 5x7","de-DE":"Premium Foto 13x18"}', '{"en-GB":"A print with the size of 5x7 on premium photo paper","de-DE":"Ein Abzug der Größe 13x18 auf Premium-Fotopapier"}', 'I''ll order this using my favorite print service.', '0000-00-00 00:00:00', NULL),
(5, 1, 'paper', 0, 0,'10x15', 19, 2.50, '', '', '', 'EUR', 'Fotoabzug 10x15', '{"en-GB":"Premium Print 4x5","de-DE":"Foto 11x13"}', '{"en-GB":"A print with the size of 4x5 on premium photo paper","de-DE":"Ein Abzug der Größe 11x13 auf Premium-Fotopapier"}', 'I''ll order this using my favorite print service', NULL, NULL),
(6, 0, 'digital exp', 1, 1,'0', 19, 25.00, '', '', '', 'EUR', 'Digitale Kopie', '{"en-GB":"Digital Copy","de-DE":"Digitale Kopie"}', '{"en-GB":"A digital copy of the original image","de-DE":"Eine Kopie des originalen Bildes."}', 'Copy from my hard drive', '0000-00-00 00:00:00', NULL);
--
-- Daten für Tabelle `#__eventgallery_imagetypeset`
--

INSERT INTO `#__eventgallery_imagetypeset`  (`id`, `name`, `description`, `note`, `default`, `published`, `modified`, `created`) VALUES
(1, 'Cheap Image Set', NULL, NULL, 0, 1, '0000-00-00 00:00:00', NULL),
(2, 'Expensive Image Set', NULL, NULL, 1, 1, NULL, NULL),
(3, 'Single Choice Image Set', NULL, NULL, 0, 1, NULL, NULL);

--
-- Daten für Tabelle `#__eventgallery_imagetypeset_imagetype_assignment`
--

INSERT INTO `#__eventgallery_imagetypeset_imagetype_assignment` (`imagetypesetid`, `imagetypeid`, `default`, `ordering`, `modified`, `created`) VALUES
(1, 1, 0, 1, '0000-00-00 00:00:00', NULL),
(1, 2, 1, 2, NULL, NULL),
(1, 3, 0, 4, '0000-00-00 00:00:00', NULL),
(1, 4, 0, 3, '0000-00-00 00:00:00', NULL),
(2, 4, 0, 1, '0000-00-00 00:00:00', NULL),
(2, 5, 0, 2, NULL, NULL),
(2, 6, 1, 3, '0000-00-00 00:00:00', NULL),
(3, 4, 0, 1, '0000-00-00 00:00:00', NULL);

--
-- Daten für Tabelle `#__eventgallery_paymentmethod`
--

INSERT INTO `#__eventgallery_paymentmethod` (`id`, `classname`, `name`, `displayname`, `description`, `taxrate`, `price`, `currency`, `published`, `default`, `ordering`, `modified`, `created`, `data`) VALUES
(1, 'EventgalleryPluginsPaymentStandard', 'Cash on Pickup', '{"en-GB":"Cash on pickup","de-DE":"Zahlung bei Abholung"}', '{"en-GB":"Pay when you pick up your order","de-DE":"Die Bezahlung erfolgt bei Abholung"}', 19, 0.00, 'EUR', '1', '0', '1', '0000-00-00 00:00:00', NULL, ''),
(2, 'EventgalleryPluginsPaymentStandard', 'COD', '{"en-GB":"Cash on Delivery","de-DE":"Nachnahme"}', '{"en-GB":"Pay per Cash on Delivery","de-DE":"Zahlung per Nachnahme"}', 19, 2.00, 'EUR', '1','0', '2',  '0000-00-00 00:00:00', NULL, '');

--
-- Daten für Tabelle `#__eventgallery_shippingmethod`
--

INSERT INTO `#__eventgallery_shippingmethod` (`id`, `classname`, `name`, `displayname`, `description`, `taxrate`, `price`, `currency`, `published`, `default`, `ordering`, `modified`, `created`) VALUES
(3, 'EventgalleryPluginsShippingStandard', 'ground', '{"en-GB":"Mail","de-DE":"Post"}', '{"en-GB":"Shipping of your items in a parcel","de-DE":"Versand mit Post"}', 19, 6.00, 'EUR','1', '0', '3',  '0000-00-00 00:00:00', NULL);

--
-- Daten für Tabelle `#__eventgallery_orderstatus`
--

INSERT INTO `#__eventgallery_orderstatus` (`id`, `ordering`, `type`, `systemmanaged`, `name`, `default`, `displayname`, `description`, `modified`, `created`) VALUES
(1, 1, '0', '0', 'new', 1, '{"en-GB":"New","de-DE":"Neu"}', '{"en-GB":"New","de-DE":"Neu"}', '0000-00-00 00:00:00', NULL),
(2, 2, '0', '0', 'refused', 0, '{"en-GB":"Refused","de-DE":"Abgelehnt"}', '{"en-GB":"Refused by merchant","de-DE":"Vom Anbieter abgelehnt"}', NULL, NULL),
(3, 3, '0', '0', 'canceled', 0, '{"en-GB":"Canceled","de-DE":"Storniert"}', '{"en-GB":"Canceled by customer","de-DE":"Durch Nutzer storniert"}', '0000-00-00 00:00:00', NULL),
(4, 4, '0', '0', 'in progress', 0, '{"en-GB":"In progress","de-DE":"In Bearbeitung"}', '{"en-GB":"In progress","de-DE":"In Bearbeitung"}', NULL, NULL),
(5, 5, '0', '0', 'completed', 0, '{"en-GB":"Completed","de-DE":"Abgeschlossen"}', '{"en-GB":"Order is completed","de-DE":"Die Bestellung ist abgeschlossen."}', '0000-00-00 00:00:00', NULL),
(6, 6, '1', '1', 'not shipped', 1, '{"en-GB":"Not Shipped","de-DE":"Noch nicht versendet"}', '{"en-GB":"Shipping of the order id pending.","de-DE":"Die Bestellung wurde noch nicht verschickt."}', NULL, NULL),
(7, 7, '1', '1', 'shipped', 0, '{"en-GB":"Shipped","de-DE":"Versendet"}', '{"en-GB":"Die Bestellung wurde versendet.","de-DE":"Die Bestellung wurde versandt."}', NULL, NULL),
(8, 8, '2', '1', 'not paid', 1, '{"en-GB":"Not paid","de-DE":"Nicht bezahlt"}', '{"en-GB":"The order is not paid yet.","de-DE":"Die Bestellung wurde noch nicht bezahlt"}', NULL, NULL),
(9, 9, '2', '1', 'paid', 0, '{"en-GB":"Paid","de-DE":"Bezahlt"}', '{"en-GB":"The order is paid.","de-DE":"Die Bestellung wurde bezahlt."}', NULL, NULL);


INSERT INTO `#__eventgallery_foldertype`  (`id`, `name`, `folderhandlerclassname`, `displayname`, `default`, `ordering`, `published`, `modified`, `created`) VALUES
(0, 'local', 'EventgalleryLibraryFolderLocal', 'Local Images', 1, 1, 1, '0000-00-00 00:00:00', NULL),
(1, 'picasa', 'EventgalleryLibraryFolderPicasa', 'Google Photos Images', 0, 2, 1, '0000-00-00 00:00:00', NULL),
(2, 'flickr', 'EventgalleryLibraryFolderFlickr', 'Flickr Images', 0, 3, 1, '0000-00-00 00:00:00', NULL),
(3, 's3', 'EventgalleryLibraryFolderS3', 'Amazon S3 Images', 0, 4, 1, '0000-00-00 00:00:00', NULL);


INSERT INTO `#__content_types` (`type_id`, `type_title`, `type_alias`, `table`, `rules`, `field_mappings`, `router`, `content_history_options`) 
VALUES (NULL, 
		'Eventgallery Category', 
		'com_eventgallery.category', 
		'{"special":{"dbtable":"#__categories","key":"id","type":"Category","prefix":"JTable","config":"array()"},"common":{"dbtable":"#__ucm_content","key":"ucm_id","type":"Corecontent","prefix":"JTable","config":"array()"}}', 
		'', 
		'{"common":{"core_content_item_id":"id","core_title":"title","core_state":"published","core_alias":"alias","core_created_time":"created_time","core_modified_time":"modified_time","core_body":"description", "core_hits":"hits","core_publish_up":"null","core_publish_down":"null","core_access":"access", "core_params":"params", "core_featured":"null", "core_metadata":"metadata", "core_language":"language", "core_images":"null", "core_urls":"null", "core_version":"version", "core_ordering":"null", "core_metakey":"metakey", "core_metadesc":"metadesc", "core_catid":"parent_id", "core_xreference":"null", "asset_id":"asset_id"}, "special": {"parent_id":"parent_id","lft":"lft","rgt":"rgt","level":"level","path":"path","extension":"extension","note":"note"}}', 
		'', 
		'');

INSERT INTO `#__content_types` (
  `type_id`,
  `type_title`,
  `type_alias`,
  `table`,
  `rules`,
  `field_mappings`,
  `router`,
  `content_history_options`)
VALUES (NULL,
        'Eventgallery Event',
        'com_eventgallery.event',
        '{"special":{"dbtable":"#__eventgallery_folder","key":"folder","type":"Folder","prefix":"EventgalleryTable","config":"array()"},"common":{"dbtable":"#__ucm_content","key":"ucm_id","type":"Corecontent","prefix":"JTable","config":"array()"}}',
        '',
        '{"common":{"core_content_item_id":"id","core_title":"description","core_state":"published","core_alias":"null","core_created_time":"created_time","core_modified_time":"modified_time","core_body":"text", "core_hits":"hits","core_publish_up":"null","core_publish_down":"null","core_access":"access", "core_params":"params", "core_featured":"null", "core_metadata":"metadata", "core_language":"null", "core_images":"null", "core_urls":"null", "core_version":"version", "core_ordering":"null", "core_metakey":"metakey", "core_metadesc":"metadesc", "core_catid":"catid", "core_xreference":"null", "asset_id":"asset_id"}, "special": {"parent_id":"parent_id","lft":"lft","rgt":"rgt","level":"level","path":"path","extension":"extension","note":"note"}}',
        'EventgalleryHelperRoute::getEventRoute',
        '');

DELETE FROM `#__eventgallery_state`;
INSERT INTO `#__eventgallery_state` (`id`, `countrycode`, `statecode`, `statename`, `published`)
VALUES
	(1,'US','AL','Alabama',1),
	(2,'US','AK','Alaska',1),
	(3,'US','AZ','Arizona',1),
	(4,'US','AR','Arkansas',1),
	(5,'US','CA','California',1),
	(6,'US','CO','Colorado',1),
	(7,'US','CT','Connecticut',1),
	(8,'US','DE','Delaware',1),
	(9,'US','DC','District of Columbia',1),
	(10,'US','FL','Florida',1),
	(11,'US','GA','Georgia',1),
	(12,'US','HI','Hawaii',1),
	(13,'US','ID','Idaho',1),
	(14,'US','IL','Illinois',1),
	(15,'US','IN','Indiana',1),
	(16,'US','IA','Iowa',1),
	(17,'US','KS','Kansas',1),
	(18,'US','KY','Kentucky',1),
	(19,'US','LA','Louisiana',1),
	(20,'US','ME','Maine',1),
	(21,'US','MD','Maryland',1),
	(22,'US','MA','Massachusetts',1),
	(23,'US','MI','Michigan',1),
	(24,'US','MN','Minnesota',1),
	(25,'US','MS','Mississippi',1),
	(26,'US','MO','Missouri',1),
	(27,'US','MT','Montana',1),
	(28,'US','NE','Nebraska',1),
	(29,'US','NV','Nevada',1),
	(30,'US','NH','New Hampshire',1),
	(31,'US','NJ','New Jersey',1),
	(32,'US','NM','New Mexico',1),
	(33,'US','NY','New York',1),
	(34,'US','NC','North Carolina',1),
	(35,'US','ND','North Dakota',1),
	(36,'US','OH','Ohio',1),
	(37,'US','OK','Oklahoma',1),
	(38,'US','OR','Oregon',1),
	(39,'US','PA','Pennsylvania',1),
	(40,'US','RI','Rhode Island',1),
	(41,'US','SC','South Carolina',1),
	(42,'US','SD','South Dakota',1),
	(43,'US','TN','Tennessee',1),
	(44,'US','TX','Texas',1),
	(45,'US','UT','Utah',1),
	(46,'US','VT','Vermont',1),
	(47,'US','VA','Virginia',1),
	(48,'US','WA','Washington',1),
	(49,'US','WV','West Virginia',1),
	(50,'US','WI','Wisconsin',1),
	(51,'US','WY','Wyoming',1),
	(52,'CA','AB','Alberta',0),
	(53,'CA','BC','British Columbia',0),
	(54,'CA','MB','Manitoba',0),
	(55,'CA','NB','New Brunswick',0),
	(56,'CA','NL','Newfoundland and Labrador',0),
	(57,'CA','NT','Northwest Territories',0),
	(58,'CA','NS','Nova Scotia',0),
	(59,'CA','NU','Nunavut',0),
	(60,'CA','ON','Ontario',0),
	(61,'CA','PE','Prince Edward Island',0),
	(62,'CA','QC','Quebec',0),
	(63,'CA','SK','Saskatchewan',0),
	(64,'CA','YT','Yukon',0),
	(65,'AU','ACT','Australian Capital Territory',0),
	(66,'AU','NSW','New South Wales',0),
	(67,'AU','AU-NT','Northern Terittory',0),
	(68,'AU','QLD','Queensland',0),
	(69,'AU','AU-SA','South Australia',0),
	(70,'AU','TAS','Tasmania',0),
	(71,'AU','VIC','Victoria',0),
	(72,'AU','AU-WA','Western Australia',0),
	(73,'GR','GR-ATT','Αττική',0),
	(74,'GR','GR-EFV','Εύβοια',0),
	(75,'GR','GR-EVT','Ευρυτανία',0),
	(76,'GR','GR-FOK','Φωκίδα',0),
	(77,'GR','GR-FTH','Φθιώτιδα',0),
	(78,'GR','GR-VIO','Βοιωτία',0),
	(79,'GR','GR-HAL','Χαλκιδική',0),
	(80,'GR','GR-IMA','Ημαθία',0),
	(81,'GR','GR-KIL','Κιλκίς',0),
	(82,'GR','GR-PEL','Πέλλα',0),
	(83,'GR','GR-PIE','Πιερία',0),
	(84,'GR','GR-SER','Σέρρες',0),
	(85,'GR','GR-THE','Θεσσαλονίκη',0),
	(86,'GR','GR-CHA','Χανιά',0),
	(87,'GR','GR-IRA','Ηράκλειο',0),
	(88,'GR','GR-LAS','Λασίθι',0),
	(89,'GR','GR-RET','Ρέθυμνο',0),
	(90,'GR','GR-DRA','Δράμα',0),
	(91,'GR','GR-EVR','Έβρος',0),
	(92,'GR','GR-KAV','Καβάλα',0),
	(93,'GR','GR-ROD','Ροδόπη',0),
	(94,'GR','GR-XAN','Ξάνθη',0),
	(95,'GR','GR-ART','Άρτα',0),
	(96,'GR','GR-IOA','Ιωάννινα',0),
	(97,'GR','GR-PRE','Πρέβεζα',0),
	(98,'GR','GR-THS','Θεσπρωτία',0),
	(99,'GR','GR-KER','Κέρκυρα',0),
	(100,'GR','GR-KEF','Κεφαλληνία',0),
	(101,'GR','GR-LEF','Λευκάδα',0),
	(102,'GR','GR-ZAK','Ζάκυνθος',0),
	(103,'GR','GR-CHI','Χίος',0),
	(104,'GR','GR-LES','Λέσβος',0),
	(105,'GR','GR-SAM','Σάμος',0),
	(106,'GR','GR-ARK','Αρκαδία',0),
	(107,'GR','GR-ARG','Αργολίδα',0),
	(108,'GR','GR-KOR','Κορινθία',0),
	(109,'GR','GR-LAK','Λακωνία',0),
	(110,'GR','GR-MES','Μεσσηνία',0),
	(111,'GR','GR-KYK','Κυκλάδες',0),
	(112,'GR','GR-DOD','Δωδεκάνησα',0),
	(113,'GR','GR-KAR','Καρδίτσα',0),
	(114,'GR','GR-LAR','Λάρισα',0),
	(115,'GR','GR-MAG','Μαγνησία',0),
	(116,'GR','GR-TRI','Τρίκαλα',0),
	(117,'GR','GR-ACH','Αχαΐα',0),
	(118,'GR','GR-AIT','Αιτωλοακαρνανία',0),
	(119,'GR','GR-ILI','Ηλεία',0),
	(120,'GR','GR-FLO','Φλώρινα',0),
	(121,'GR','GR-GRE','Γρεβενά',0),
	(122,'GR','GR-KAS','Καστοριά',0),
	(123,'GR','GR-KOZ','Κοζάνη',0),
	(124,'GR','GR-AGO','Άγιο Όρος',0),
	(125,'DE','DE-BW','Baden-Württemberg',0),
	(126,'DE','DE-BY','Bayern',0),
	(127,'DE','DE-BE','Berlin',0),
	(128,'DE','DE-BB','Brandenburg',0),
	(129,'DE','DE-HB','Freie Hansestadt Bremen',0),
	(130,'DE','DE-HH','Hamburg',0),
	(131,'DE','DE-HE','Hessen',0),
	(132,'DE','DE-MV','Mecklenburg-Vorpommern',0),
	(133,'DE','DE-NI','Niedersachsen',0),
	(134,'DE','DE-NW','Nordrhein-Westfalen',0),
	(135,'DE','DE-RP','Rheinland-Pfalz',0),
	(136,'DE','DE-SL','Saarland',0),
	(137,'DE','DE-SN','Sachsen',0),
	(138,'DE','DE-ST','Sachsen-Anhalt',0),
	(139,'DE','DE-SH','Schleswig-Holstein',0),
	(140,'DE','DE-TH','Thüringen',0),
	(181,'CN','CN-BJ','Beijing Municipality',0),
	(182,'CN','CN-TJ','Tianjin Municipality',0),
	(183,'CN','CN-HE','Hebei Province',0),
	(184,'CN','CN-SX','Shanxi Province',0),
	(185,'CN','CN-NM','Nei Mongol Autonomous Region',0),
	(186,'CN','CN-LN','Liaoning Province',0),
	(187,'CN','CN-JL','Jilin Province',0),
	(188,'CN','CN-HL','Heilongjiang Province',0),
	(189,'CN','CN-SH','Shanghai Municipality',0),
	(190,'CN','CN-JS','Jiangsu Province',0),
	(191,'CN','CN-ZJ','Zhejiang Province',0),
	(192,'CN','CN-AH','Anhui Province',0),
	(193,'CN','CN-FJ','Fujian Province',0),
	(194,'CN','CN-JX','Jiangxi Province',0),
	(195,'CN','CN-SD','Shandong Province',0),
	(196,'CN','CN-HA','Henan Province',0),
	(197,'CN','CN-HB','Hubei Province',0),
	(198,'CN','CN-HN','Hunan Province',0),
	(199,'CN','CN-GD','Guangdong Province',0),
	(200,'CN','CN-GX','Guangxi Zhuang Autonomous Region',0),
	(201,'CN','CN-HI','Hainan Province',0),
	(202,'CN','CN-CQ','Chongqing Municipality',0),
	(203,'CN','CN-SC','Sichuan Province',0),
	(204,'CN','CN-GZ','Guizhou Province',0),
	(205,'CN','CN-YN','Yunnan Province',0),
	(206,'CN','CN-XZ','Xizang Autonomous Region',0),
	(207,'CN','CN-SN','Shaanxi Province',0),
	(208,'CN','CN-GS','Gansu Province',0),
	(209,'CN','CN-QH','Qinghai Province',0),
	(210,'CN','CN-NX','Ningxia Hui Autonomous Region',0),
	(211,'CN','CN-XJ','Xinjiang Uyghur Autonomous Region',0),
	(212,'CN','CN-HK','Xianggang Special Administrative Region',0),
	(213,'CN','CN-MC','Aomen Special Administrative Region',0),
	(214, 'ES', 'ES-VI', 'Álava', 1),
	(215, 'ES', 'ES-AB', 'Albacete', 1),
	(216, 'ES', 'ES-A', 'Alicante', 1),
	(217, 'ES', 'ES-AL', 'Almería', 1),
	(218, 'ES', 'ES-O', 'Asturias', 1),
	(219, 'ES', 'ES-AV', 'Ávila', 1),
	(220, 'ES', 'ES-BA', 'Badajoz', 1),
	(221, 'ES', 'ES-IB', 'Islas Baleares', 1),
	(222, 'ES', 'ES-B', 'Barcelona', 1),
	(223, 'ES', 'ES-BU', 'Burgos', 1),
	(224, 'ES', 'ES-CC', 'Cáceres', 1),
	(225, 'ES', 'ES-CA', 'Cádiz', 1),
	(226, 'ES', 'ES-S', 'Cantabria', 1),
	(227, 'ES', 'ES-CS', 'Castellón', 1),
	(228, 'ES', 'ES-CE', 'Ceuta', 1),
	(229, 'ES', 'ES-CR', 'Ciudad Real', 1),
	(230, 'ES', 'ES-CO', 'Córdoba', 1),
	(231, 'ES', 'ES-CU', 'Cuenca', 1),
	(232, 'ES', 'ES-GI', 'Gerona', 1),
	(233, 'ES', 'ES-GR', 'Granada', 1),
	(234, 'ES', 'ES-GU', 'Guadalajara', 1),
	(235, 'ES', 'ES-SS', 'Guipúzcoa', 1),
	(236, 'ES', 'ES-H', 'Huelva', 1),
	(237, 'ES', 'ES-HU', 'Huesca', 1),
	(238, 'ES', 'ES-J', 'Jaén', 1),
	(239, 'ES', 'ES-C', 'La Coruña', 1),
	(240, 'ES', 'ES-LO', 'La Rioja', 1),
	(241, 'ES', 'ES-GC', 'Las Palmas', 1),
	(242, 'ES', 'ES-LE', 'León', 1),
	(243, 'ES', 'ES-L', 'Lérida', 1),
	(244, 'ES', 'ES-LU', 'Lugo', 1),
	(245, 'ES', 'ES-M', 'Madrid', 1),
	(246, 'ES', 'ES-MA', 'Málaga', 1),
	(247, 'ES', 'ES-ML', 'Melilla', 1),
	(248, 'ES', 'ES-MU', 'Murcia', 1),
	(249, 'ES', 'ES-NA', 'Navarra', 1),
	(250, 'ES', 'ES-OU', 'Orense', 1),
	(251, 'ES', 'ES-P', 'Palencia', 1),
	(252, 'ES', 'ES-PO', 'Pontevedra', 1),
	(253, 'ES', 'ES-SA', 'Salamanca', 1),
	(254, 'ES', 'ES-TF', 'Santa Cruz de Tenerife', 1),
	(255, 'ES', 'ES-SG', 'Segovia', 1),
	(256, 'ES', 'ES-SE', 'Sevilla', 1),
	(257, 'ES', 'ES-SO', 'Soria', 1),
	(258, 'ES', 'ES-T', 'Tarragona', 1),
	(259, 'ES', 'ES-TE', 'Teruel', 1),
	(260, 'ES', 'ES-TO', 'Toledo', 1),
	(261, 'ES', 'ES-V', 'Valencia', 1),
	(262, 'ES', 'ES-VA', 'Valladolid', 1),
	(263, 'ES', 'ES-BI', 'Vizcaya', 1),
	(264, 'ES', 'ES-ZA', 'Zamora', 1),
	(265, 'ES', 'ES-Z', 'Zaragoza', 1);