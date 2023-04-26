---
layout: post
title: "Forcing uniqueness in a single column on a Google Spreadsheet"
date: 2023-04-26
categories: 
tags: 
permalink: /:title
---

Row numbers change. Sometimes you want to assign a unique number to a row in your spreadsheet and hope it stays unique as its subsequently edited.

However, as soon as you're working with few hundred rows (or more) with filter options on the row headings to sort in different ways, it's easy to forget to re-sort the rows and check the highest row id before adding more.

In such cases, a Data Validation rule can help. Select the column you want to use for unique values (for example, column A) and apply a Data Validation rule to it with a Custom Formula.

```
=COUNTIF($A:$A,"="&A1)  < 2
```

If you use this Custom Formula as a Data Validation rule on column A, column A will reject all duplicates.

You can safely apply this to columns which already contain duplicate values, it will just add a warning to cells with duplicates.
