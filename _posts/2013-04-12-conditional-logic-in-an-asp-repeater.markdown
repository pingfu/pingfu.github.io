---
layout: post
title: "Conditional logic in an Asp:Repeater"
date: 2013-04-12
categories: Programming
tags: c#
---

We want to put neat conditional logic into our asp:repeater on our asp.net web page. The input value from the data source which is evaluated on data bind will have little connection to the resulting output in our item template.

In this example, our datasource returns an integer representing how many attachments an object has. Instead of displaying that number, if it’s greater than zero we want to display an image. If that number is zero we display nothing.

We don’t want to implement this logic mess on the aspx page itself, so for brevity and to keep separated display and business logic , we abstract it to code behind:

```html
<table>
	<tr>
		<asp:Repeater ID="Repeater1" runat="server">
			<ItemTemplate>
				<td><%# DisplayAttachmentIcon(Eval("AttachmentCount"))%></td>
			</ItemTemplate>
		</asp:Repeater>
	</tr>
</table>
```

The code-behind then looks like this:

```csharp
protected string DisplayAttachmentIcon(object attachmentCount)
{
	return (Convert.ToInt32(attachmentCount) > 0) ? "<img src=\"image.png\" />" : string.Empty;
}
```
