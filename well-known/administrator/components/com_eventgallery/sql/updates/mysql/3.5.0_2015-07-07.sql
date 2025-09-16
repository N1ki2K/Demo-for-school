ALTER TABLE `#__eventgallery_file`
ADD COLUMN `flickr_secret` text,
ADD COLUMN `flickr_originalsecret` text,
ADD COLUMN `flickr_server` text,
ADD COLUMN `flickr_farm` text
AFTER `picasa_url_thumbnail`;