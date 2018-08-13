---
layout: post
title: "LINQ and the FizzBuzz test"
date: 2018-08-13
categories: csharp
tags: 
permalink: /:title
---

In February of 2007, Jeff Atwood wrote [Why Can't Programmers.. Program](https://blog.codinghorror.com/why-cant-programmers-program/) in which he devises the FizzBuzz test.

> Write a program that prints the numbers from 1 to 100. But for multiples of three print "Fizz" instead of the number and for the multiples of five print "Buzz". For numbers which are multiples of both three and five print "FizzBuzz".

Regardless of your position on how suitable the FizzBuzz test is in an interview situation, it has inspired code golf implementations in almost every conceivable programming language.

I enjoy code golf solutions that are concise, demonstrate thorough understanding of the problem, and most importantly maintain code readability. A wide-held realisation in FizzBuzz solutions is the realisation that numbers which are both multiples of three and five are also divisible by 15. So it’s common in code golf solutions including a mod 15 operation. However, that's not part of Jeff's spec.

In the spirit of code-golf, the `i % 15` realisation is an elegant solution, but what is the cost relative to `(i % 3 && i % 5)`? I believe readability and code comprehension is important, so given that `i % 15` is a arguably departure from the spec, I'd be inclined to preserve the slightly longer evaluation in this case.

With that in mind, here's my FizzBuzz solution formatted for readability leaning on LINQ, string interpolation and the inline if feature of C#.

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

After formatting and extraneous spaces are removed, the same code, golfed onto a single line weighs in at 138 characters:

{% highlight csharp linenos %}
{% raw %}
foreach(var n in Enumerable.Range(1, 100).Select(i=>i%3==0&&i%5==0?"FizzBuzz":i%3==0?"Fizz":i%5==0?"Buzz":$"{i}")){Console.WriteLine(n);}
{% endraw %}
{% endhighlight %}