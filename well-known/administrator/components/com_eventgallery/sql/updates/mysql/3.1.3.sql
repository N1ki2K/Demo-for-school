ALTER TABLE  `#__eventgallery_imagetype` CHANGE  `taxrate`  `taxrate` DECIMAL(4,2) NULL DEFAULT  '0';
ALTER TABLE  `#__eventgallery_surcharge` CHANGE  `taxrate`  `taxrate` DECIMAL(4,2) NULL DEFAULT  '0';
ALTER TABLE  `#__eventgallery_paymentmethod` CHANGE  `taxrate`  `taxrate` DECIMAL(4,2) NULL DEFAULT  '0';
ALTER TABLE  `#__eventgallery_shippingmethod` CHANGE  `taxrate`  `taxrate` DECIMAL(4,2) NULL DEFAULT  '0';
ALTER TABLE  `#__eventgallery_servicelineitem` CHANGE  `taxrate`  `taxrate` DECIMAL(4,2) NULL DEFAULT  '0';
ALTER TABLE  `#__eventgallery_imagelineitem` CHANGE  `taxrate`  `taxrate` DECIMAL(4,2) NULL DEFAULT  '0';
