ALTER TABLE  `#__eventgallery_file` ADD  `modified` TIMESTAMP NOT NULL;
ALTER TABLE  `#__eventgallery_file` ADD  `created` TIMESTAMP NOT NULL;
update `#__eventgallery_file` set created=lastmodified, modified=lastmodified;
ALTER TABLE `#__eventgallery_file` DROP `lastmodified`;


ALTER TABLE  `#__eventgallery_folder` ADD  `modified` TIMESTAMP NOT NULL;
ALTER TABLE  `#__eventgallery_folder` ADD  `created` TIMESTAMP NOT NULL;
update `#__eventgallery_folder` set created=lastmodified, modified=lastmodified;
ALTER TABLE `#__eventgallery_folder` DROP `lastmodified`;

ALTER TABLE  `#__eventgallery_comment` ADD  `modified` TIMESTAMP NOT NULL;
ALTER TABLE  `#__eventgallery_comment` ADD  `created` TIMESTAMP NOT NULL;

