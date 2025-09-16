DROP TABLE IF EXISTS `#__eventgallery_auth_token`;
CREATE TABLE IF NOT EXISTS `#__eventgallery_auth_token` (
  `refresh_token_hash` varchar(255) NOT NULL DEFAULT '',
  `access_token` varchar(255) NOT NULL DEFAULT '',
  `valid_until` timestamp NULL DEFAULT NULL,
    PRIMARY KEY (`refresh_token_hash`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;