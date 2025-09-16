ALTER TABLE `#__eventgallery_imagetype` ADD `scaleprice` text AFTER `price`;
ALTER TABLE `#__eventgallery_imagetype` ADD `scalepricescope` varchar(32) AFTER `scaleprice`;
ALTER TABLE `#__eventgallery_imagetype` ADD `scalepricetype` varchar(32) AFTER `scalepricescope`;