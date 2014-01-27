---
layout: post
title: "MySQL: Drop all tables"
date: 2011-07-20
categories: Troubleshooting
tags: MySQL
---

There are drop table and drop database commands in MySQL but you cannot drop as multiple objects in a single command. We can ask MySQL to produce a database dump for us, and grep for the DROP command which is part of the IF EXISTS check for each table.

```
$ mysqldump -u root -p --add-drop-table --no-data bugzilla3 | grep ^DROP
```

This will produce output that resembles the following:

```
$ mysqldump -u root -p --add-drop-table --no-data bugzilla3 | grep ^DROP
Enter password:
DROP TABLE IF EXISTS `attach_data`;
DROP TABLE IF EXISTS `attachments`;
DROP TABLE IF EXISTS `bug_group_map`;
DROP TABLE IF EXISTS `bug_severity`;
...
DROP TABLE IF EXISTS `watch`;
DROP TABLE IF EXISTS `whine_events`;
DROP TABLE IF EXISTS `whine_queries`;
DROP TABLE IF EXISTS `whine_schedules`;
```

If you’re feeling brave you can pipe this this straight back in

```
$ mysqldump -u root -p --add-drop-table --no-data bugzilla3 | grep ^DROP | mysql -u username -p
```