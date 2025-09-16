ALTER TABLE `#__eventgallery_file`
  ADD COLUMN `picasa_url_image` text,
  ADD COLUMN `picasa_url_originalimage` text,
  ADD COLUMN `picasa_url_thumbnail` text
  AFTER `title`;