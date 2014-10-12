---
layout: post
title: "Exchange 2003 and 0xFFFFFD9A"
date: 2011-07-20
categories: Troubleshooting
tags: exchange
---

Problem: you regularly use BackupExec, or a comparable product to take backups of Exchange. Occasionally all of the Outlook clients throughout the organisation simultaneously start to crash, hang, or otherwise report failure in connecting to Exchange. In the Exchange server’s application event log you discover a series of errors (similar to those listed below and probably in an equally similar order) and find your Mailbox Store and Public Folder Store marked offline:

```
Type: Error
Source: MSExchangeIS
Event ID: 1159
Database error 0xfffffd9a occurred in function JTAB_BASE::EcUpdate while accessing the database "First Storage Group\Mailbox Store (localhost)".
```

followed by

```
Type: Error
Source: ESE
Event ID: 226
Information Store (5496) First Storage Group: The backup has been stopped prematurely (possibly because the instance is terminating).
```

followed by

```
Type: Error
Source: MSExchangeSA
Event ID: 9175
The MAPI call 'OpenMsgStore' failed with the following error: The attempt to log on to the Microsoft Exchange Server computer has failed. The MAPI provider failed. Microsoft Exchange Server Information Store ID no: 8004011d-0512-00000000
```

<!--excerpt-->

The initial `0xFFFFFD9A` error code indicates that the maximum number of uncommitted log files have been reached.  This happens when a backup has been started that does not complete for an excessive amount of time. Excessive in this case is un-defined, but we take it to mean continuing longer than planned or expected.

When a backup operation against Exchange commences it puts the Exchange database into a state where it cannot commit log files. There is a limit on the volume of un-committed log files that can accumulate before Exchange will un-mount the store to prevent further loss of synchronisation.

The problem appeared because backups were scheduled to start at 9pm, and the on-line maintenance intervals for the Mail Store were scheduled in Exchange to run between 2am and 6am (Right click Mailbox Store -> Properties -> Database tab -> Maintenance interval) . As the backups can take an indeterminable amount of time, depending on network conditions and varying size, our scheduling produced an opportunity for these tasks to frequently overlap. Put simply, our backup job would exceed 8 hours.

Due to the timing overlap, each day we edged closer towards the uncommitted log file limit in Exchange depending on the duration of the job, and eventually caused Exchange to unmount the store. As the online maintenance interval a fixed duration, and the back-up job is open-ended, it made sense for us to simply reverse the scheduled in this case.

To address what we thought was the cause of our problems we changed the on-line maintenance window to run in Exchange on a custom time schedule, daily, between 7pm and midnight. We then updated the Backup Exec job based on our Exchange maintenance interval to kick off a 12:10am.

There is an excellent related article [here][windowsitpro].

[windowsitpro]: http://www.windowsitpro.com/article/email/finding-the-cause-of-event-id-1159