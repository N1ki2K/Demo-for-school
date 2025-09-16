ALTER TABLE `#__eventgallery_shippingmethod` ADD `needsaddressdata` int(1) DEFAULT 1 after `supportsdigital`;
ALTER TABLE `#__eventgallery_paymentmethod` ADD  `supportsdigital` int(1) DEFAULT 1 after `name`;
