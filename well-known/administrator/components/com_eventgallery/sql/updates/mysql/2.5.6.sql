ALTER TABLE  `#__eventgallery_folder` ADD  `password` VARCHAR( 250 ) NOT NULL AFTER  `picasakey` ,
ADD  `cartable` TINYINT( 1 ) NOT NULL DEFAULT  '1' AFTER  `password`