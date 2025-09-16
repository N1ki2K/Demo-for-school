ALTER TABLE `#__eventgallery_folder`
ADD COLUMN `sortattribute` varchar(100),
ADD COLUMN `sortdirection` varchar(10)
AFTER `language`;