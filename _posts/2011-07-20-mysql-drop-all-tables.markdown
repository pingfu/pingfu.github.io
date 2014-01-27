---
layout: post
title: "MySQL: Drop all tables"
date: 2000-01-01 00:00:00
categories: xxxxxxxxxxx xxxxxxxxxxx
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
DROP TABLE IF EXISTS `bug_status`;
DROP TABLE IF EXISTS `bugs`;
DROP TABLE IF EXISTS `bugs_activity`;
DROP TABLE IF EXISTS `bugs_fulltext`;
DROP TABLE IF EXISTS `bz_schema`;
DROP TABLE IF EXISTS `category_group_map`;
DROP TABLE IF EXISTS `cc`;
DROP TABLE IF EXISTS `classifications`;
DROP TABLE IF EXISTS `component_cc`;
DROP TABLE IF EXISTS `components`;
DROP TABLE IF EXISTS `dependencies`;
DROP TABLE IF EXISTS `duplicates`;
DROP TABLE IF EXISTS `email_setting`;
DROP TABLE IF EXISTS `fielddefs`;
DROP TABLE IF EXISTS `flagexclusions`;
DROP TABLE IF EXISTS `flaginclusions`;
DROP TABLE IF EXISTS `flags`;
DROP TABLE IF EXISTS `flagtypes`;
DROP TABLE IF EXISTS `group_control_map`;
DROP TABLE IF EXISTS `group_group_map`;
DROP TABLE IF EXISTS `groups`;
DROP TABLE IF EXISTS `keyworddefs`;
DROP TABLE IF EXISTS `keywords`;
DROP TABLE IF EXISTS `logincookies`;
DROP TABLE IF EXISTS `longdescs`;
DROP TABLE IF EXISTS `milestones`;
DROP TABLE IF EXISTS `namedqueries`;
DROP TABLE IF EXISTS `namedqueries_link_in_footer`;
DROP TABLE IF EXISTS `namedquery_group_map`;
DROP TABLE IF EXISTS `op_sys`;
DROP TABLE IF EXISTS `priority`;
DROP TABLE IF EXISTS `products`;
DROP TABLE IF EXISTS `profile_setting`;
DROP TABLE IF EXISTS `profiles`;
DROP TABLE IF EXISTS `profiles_activity`;
DROP TABLE IF EXISTS `quips`;
DROP TABLE IF EXISTS `rep_platform`;
DROP TABLE IF EXISTS `resolution`;
DROP TABLE IF EXISTS `series`;
DROP TABLE IF EXISTS `series_categories`;
DROP TABLE IF EXISTS `series_data`;
DROP TABLE IF EXISTS `setting`;
DROP TABLE IF EXISTS `setting_value`;
DROP TABLE IF EXISTS `status_workflow`;
DROP TABLE IF EXISTS `tokens`;
DROP TABLE IF EXISTS `user_group_map`;
DROP TABLE IF EXISTS `versions`;
DROP TABLE IF EXISTS `votes`;
DROP TABLE IF EXISTS `watch`;
DROP TABLE IF EXISTS `whine_events`;
DROP TABLE IF EXISTS `whine_queries`;
DROP TABLE IF EXISTS `whine_schedules`;
```

If you’re feeling brave you can pipe this this straight back in

```
$ mysqldump -u root -p --add-drop-table --no-data bugzilla3 | grep ^DROP | mysql -u username -p password
```