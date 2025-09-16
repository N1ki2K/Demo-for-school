DROP TABLE IF EXISTS `#__eventgallery_sequence`;
CREATE TABLE IF NOT EXISTS `#__eventgallery_sequence` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `value` int(1) DEFAULT NULL,
   PRIMARY KEY (`id`)
);
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
  `taxrate` int(3) DEFAULT 0,
  `price` decimal(8,2) NOT NULL,
  `singleprice` decimal(8,2) NOT NULL,
  `currency` varchar(3) NOT NULL,
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
  `taxrate` int(3) DEFAULT 0,
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
  `address1` varchar(255) DEFAULT NULL,
  `address2` varchar(255) DEFAULT NULL,
  `address3` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
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
  `address1` varchar(255) DEFAULT NULL,
  `address2` varchar(255) DEFAULT NULL,
  `address3` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
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
  `taxrate` int(3) DEFAULT 0,
  `price` decimal(8,2) DEFAULT NULL,
  `currency` varchar(3) NOT NULL,
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
  `displayname` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `data` text DEFAULT NULL,
  `classname` varchar(255) DEFAULT NULL,
  `taxrate` int(3) DEFAULT 0,
  `price` decimal(8,2) NOT NULL,
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
  `displayname` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `data` text DEFAULT NULL,
  `classname` varchar(255) DEFAULT NULL,
  `taxrate` int(3) DEFAULT 0,
  `price` decimal(8,2) NOT NULL,
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
  `taxrate` int(3) DEFAULT 0,
  `price` decimal(8,2) NOT NULL,
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
-- Daten für Tabelle `#__eventgallery_imagetype`
--

INSERT INTO `#__eventgallery_imagetype` (`id`, `published`, `type`, `isdigital`, `size`, `taxrate`, `price`, `currency`, `name`, `displayname`, `description`, `note`, `modified`, `created`) VALUES
(1, 1, 'paper', 0, '13x18', 19, 0.70, 'EUR', 'Fotoabzug 13x18', '{"en-GB":"Print 5x7","de-DE":"Foto 13x18"}', '{"en-GB":"A print with the size of 5x7 on premium photo paper","de-DE":"Ein Abzug der Größe 13x18 auf Premium-Fotopapier"}', 'I''ll order this using my favorit print service.', '0000-00-00 00:00:00', NULL),
(2, 1, 'paper', 0, '10x15', 19, 0.90, 'EUR', 'Fotoabzug 10x15', '{"en-GB":"Print 4x5","de-DE":"Foto 11x13"}', '{"en-GB":"A print with the size of 4x5 on premium photo paper","de-DE":"Ein Abzug der Größe 11x13 auf Premium-Fotopapier"}', 'I''ll order this using my favorit print service', NULL, NULL),
(3, 1, 'digital', 1, '20 MP', 19, 12.40, 'EUR', 'Digitale Kopie', '{"en-GB":"Digital Copy","de-DE":"Digitale Kopie"}', '{"en-GB":"A digital copy of the original image","de-DE":"Eine Kopie des originalen Bildes."}', 'Copy from my hard drive', '0000-00-00 00:00:00', NULL),
(4, 1, 'paper', 0, '13x18', 19, 2.00, 'EUR', 'Fotoabzug Premium 13x18', '{"en-GB":"Premium Print 5x7","de-DE":"Premium Foto 13x18"}', '{"en-GB":"A print with the size of 5x7 on premium photo paper","de-DE":"Ein Abzug der Größe 13x18 auf Premium-Fotopapier"}', 'I''ll order this using my favorit print service.', '0000-00-00 00:00:00', NULL),
(5, 1, 'paper', 0, '10x15', 19, 2.50, 'EUR', 'Fotoabzug 10x15', '{"en-GB":"Premium Print 4x5","de-DE":"Foto 11x13"}', '{"en-GB":"A print with the size of 4x5 on premium photo paper","de-DE":"Ein Abzug der Größe 11x13 auf Premium-Fotopapier"}', 'I''ll order this using my favorit print service', NULL, NULL),
(6, 1, 'digital exp', 1, '20 MP', 19, 25.00, 'EUR', 'Digitale Kopie', '{"en-GB":"Digital Copy","de-DE":"Digitale Kopie"}', '{"en-GB":"A digital copy of the original image","de-DE":"Eine Kopie des originalen Bildes."}', 'Copy from my hard drive', '0000-00-00 00:00:00', NULL);
--
-- Daten für Tabelle `#__eventgallery_imagetypeset`
--

INSERT INTO `#__eventgallery_imagetypeset`  (`id`, `name`, `description`, `note`, `default`, `published`, `modified`, `created`) VALUES
(1, 'Cheap images', NULL, NULL, 0, 1, '0000-00-00 00:00:00', NULL),
(2, 'Expensive images', NULL, NULL, 1, 1, NULL, NULL);
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
(2, 6, 1, 3, '0000-00-00 00:00:00', NULL);

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


ALTER TABLE  `#__eventgallery_folder` ADD  `imagetypesetid` int AFTER `folder`;