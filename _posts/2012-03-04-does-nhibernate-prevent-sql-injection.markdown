---
layout: post
title: "Does NHibernate prevent SQL injection?"
date: 2012-03-04
categories: Security
tags: NHibernate
---

No. NHibernate can be used to execute dynamic SQL statements built with user input designed to modify the statement’s original meaning, or to execute arbitrary commands, but it depends on how you use it.

Be careful using `.CreateSQLQuery()`, if it is not parameterised then as you should expect - it's vulnerable to injection.

```csharp
var userName = "' or ''='"; // injection
var query = "SELECT * FROM users WHERE userName = '" + userName + "'";
var names = Session.CreateSQLQuery(query).List();
```

So, parametrise it:

```csharp
var userName = "' or ''='";
var query = "SELECT * FROM users WHERE userName = :userName";
query.SetString("userName", userName);
var names = Session.CreateSQLQuery(query).List();
```

A little bit of effort can go a long way.