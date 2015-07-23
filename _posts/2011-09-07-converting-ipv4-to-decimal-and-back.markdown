---
layout: post
title: "Converting IPv4 to decimal, and back"
date: 2011-09-07
categories: Programming
tags: c#
---

After reading this [post][hinky-hack-ipconvc] by [mrhinkydink][mrhinkydink] I thought I’d share a c# way to accomplish the same thing; converting an IP address between dotted decimal notation and its numeric format. There are pre-written libraries and name spaces available everywhere to accomplish this task, but I’m going to show you the raw maths of the conversion process.

First, let's construct a method to accept a string representation of an ipv4 address in dotted decimal notation (that’s 127.0.0.1) and convert it into numeric, or "long" format (2,130,706,433):

{% highlight csharp linenos %}
public Double IpStringToLong( String ipString )
{
    var octets = ipString.Split('.');
    
    return Double.Parse( octets[3] ) 
         + Double.Parse( octets[2] ) * 256 
         + Double.Parse( octets[1] ) * 65536 
         + Double.Parse( octets[0] ) * 16777216;
}
{% endhighlight %}

Okay, and back the other way:

<!--excerpt-->

{% highlight csharp linenos %}
public string LongToString(Double ipAsLong)
{
    var ip = String.Empty;

    for (var n = 1; n < 5; n++)
    {
        var octet = Convert.ToInt32(Math.Truncate(ipAsLong / Math.Pow(256, 4 - n)));
        ipAsLong = ipAsLong - (octet * Math.Pow(256, 4 - n));

        if (octet > 255) return "0.0.0.0";

        if (n == 1)
        {
            ip = octet.ToString(CultureInfo.InvariantCulture);
        }
        else
        {
            ip += "." + octet;
        }
    }
    return ip;
}
{% endhighlight %}

Finally if the input is either a string- or a long and we don’t know which but we want the opposite:

{% highlight csharp linenos %}
var value = "127.0.0.1";
var value = 2130706433;

if (value.IndexOf(".") != -1)
{
    return String.Format("{0} in decimal is {1}", value, StringToLong(value));
}
return String.Format("{0} in dotted decimal is {1}", value, LongToString(value));
{% endhighlight %}

[hinky-hack-ipconvc]: http://mrhinkydink.blogspot.com/2011/08/hinky-hack-ipconvc.html
[mrhinkydink]: http://mrhinkydink.blogspot.com/