ALTER TABLE `#__eventgallery_file`
ADD COLUMN `s3_etag` text,
ADD COLUMN `s3_etag_thumbnails` text
AFTER `flickr_farm`;