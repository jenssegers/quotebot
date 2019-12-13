CREATE TABLE `quotes` (
  `id` varchar(36) NOT NULL DEFAULT '',
  `channel` varchar(250) NOT NULL DEFAULT '',
  `author_id` varchar(250) NOT NULL DEFAULT '',
  `author` varchar(250) NOT NULL DEFAULT '',
  `avatar` varchar(250) DEFAULT NULL,
  `quote` varchar(2000) NOT NULL DEFAULT '',
  `added_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `authors` (
  `id` varchar(250) NOT NULL DEFAULT '',
  `name` varchar(250) NOT NULL DEFAULT '',
  `avatar` varchar(250) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
