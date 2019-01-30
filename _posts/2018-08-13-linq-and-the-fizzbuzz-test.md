---
layout: post
title: "The FizzBuzz test, LINQ and code golf"
date: 2018-08-13
categories: csharp
tags: 
permalink: /:title
---

In February of 2007, Jeff Atwood wrote [Why Can't Programmers.. Program](https://blog.codinghorror.com/why-cant-programmers-program/) in which he devises the FizzBuzz test.

> Write a program that prints the numbers from 1 to 100. But for multiples of three print "Fizz" instead of the number and for the multiples of five print "Buzz". For numbers which are multiples of both three and five print "FizzBuzz".

Regardless of how effective FizzBuzz tests may, or may not be as an indicator of long-term developer performance in an interview situation, it has inspired code golf implementations in almost every conceivable programming language.

A common approach to code golf solutions is predicated on the understanding that numbers which are multiples of both three and five are also divisible by 15. So `mod 15` is a great way to infer if a number is divisible by both three, and five and meet the challenge requirement.

I enjoy code golf solutions that are concise, demonstrate thorough understanding of the problem. While mod 15 is an elegant solution, and meets the challenge requirements, I'd argue that using mod 15 as a shortcut to understand if a number is divisible by three isn't obvious to readers without supporting comments. 

At the risk of missing the point, I feel brevity for brevities sake and loss of code readability against the spec is something to avoid at all costs. So for my code golf solution to the FizzBuzz test I'm inclined to preserve the (slightly) longer, but far more understandable version that makes two comparisons instead of one. With that in mind, here's my FizzBuzz solution formatted for readability leaning on LINQ, string interpolation and the inline if feature of C#.

{% highlight csharp linenos %}
{% raw %}
foreach (var n in Enumerable.Range(1, 100).Select(i =>
    i % 3 == 0 && i % 5 == 0 ? "FizzBuzz"
        : i % 3 == 0 ? "Fizz"
            : i % 5 == 0 ? "Buzz"
                : $"{i}"))
{
    Console.WriteLine(n);
}
{% endraw %}
{% endhighlight %}

After formatting and extraneous spaces are removed, the same code, golfed onto a single line weighs in at 137 characters:

{% highlight csharp linenos %}
{% raw %}
foreach(var n in Enumerable.Range(1, 100).Select(i=>i%3==0&&i%5==0?"FizzBuzz":i%3==0?"Fizz":i%5==0?"Buzz":$"{i}")){Console.WriteLine(n);}
{% endraw %}
{% endhighlight %}