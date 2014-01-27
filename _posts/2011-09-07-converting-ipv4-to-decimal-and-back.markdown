---
layout: post
title: "Converting ipv4 to decimal, and back"
date: 2000-01-01 00:00:00
categories: Programming
tags: c#
---

After reading this [post][hinky-hack-ipconvc] by [mrhinkydink][mrhinkydink] I thought I’d share a c# way to accomplish the same thing, to convert an IP address between dotted decimal notation and its numeric format. There are pre-written libraries and name spaces available everywhere to accomplish this task, but I’m going to show you the raw maths of the conversion process.

Firstly, lets construct a method to accept a string representation of an ipv4 address in dotted decimal notation (that’s 127.0.0.1) and convert it into numeric, or "long" format (2,130,706,433):

```csharp
public Double IpStringToLong( String ipString )
{
    var octets = ipString.Split('.');
    
    return Double.Parse( octets[3] ) 
         + Double.Parse( octets[2] ) * 256 
         + Double.Parse( octets[1] ) * 65536 
         + Double.Parse( octets[0] ) * 16777216;
}
```

Okay, and back the other way:

```csharp
public string LongToString( Double m_IpLong )
{    
    var m_octet = 0;
    var m_ip = String.Empty;
    
    for (var x = 1; x < 5; x++)
    {
        m_octet = Convert.ToInt32( Math.Truncate( IpAsLong / Math.Pow( (Double)256, (Double)( 4 - x ) ) ) );
        m_IpLong = m_IpLong - ( m_octet * Math.Pow( (Double)256, (Double)( 4 - x ) ) );

        if ( m_octet > 255 ) return "0.0.0.0";

        if ( x == 1 )
        {
        	m_ip = m_octet.ToString();
        }            
        else
        {
        	m_ip += "." + m_octet;
        }
    }
    return m_ip;
}
```

And finally if the input is either a string, or a long and we don’t know which – but whatever it is we want the opposite:

```csharp
var ip = "127.0.0.1";
var ip = "4294967295";

if ( ip.IndexOf(".") != -1 )
{
	return ip + " in decimal is " + StringToLong( ip ).ToString();
}    
else
{
	return ip + " as a string is " + LongToString( Convert.ToDouble( ip ) );
}
```

[hinky-hack-ipconvc]: http://mrhinkydink.blogspot.com/2011/08/hinky-hack-ipconvc.html
[mrhinkydink]: http://mrhinkydink.blogspot.com/