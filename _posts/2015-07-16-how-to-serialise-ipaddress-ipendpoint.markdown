---
layout: post
title: "How to serialise classes which include IPAddress or IPEndPoint"
date: 2015-07-16
categories: csharp
tags: 
---

The two most popular formats for text-based serialisation are Xml and Json, often using the built-in `XmlSerializer` and `Json.Net` library respectively. There are others of course, but many seem to have some objection to serialising `IPAddress`, or objects containing references to that class.

In the case of the XmlSerializer, during de-serialization an instance of the target class is created before the serialised fields and properties are populated. Without a public parameterless constructor (as is the case with `System.Net.IPAddress`) the XmlSerializer refuses to populate the values and throws an exception. This is actually a limitation of `XmlSerializer`, `BinaryFormatter` and `DataContractSerializer` do not require a parameterless constructors, they create uninitalised objects.

Talking of other serialisers, the `BinaryFormatter` is not without its quirks. It throws a `SerializationException` exception if classes have not been decorated with the `[Serializable]` attribute. Thankfully `System.Net.IPAddress` is decorated as [Serializable].

<!--excerpt-->

Let's take a quick look at binary serialisation of the IPAddress class using the `BinaryFormatter`...

~~~c#
using System.Runtime.Serialization.Formatters.Binary;

..

using (var writer = new MemoryStream())
{
    new BinaryFormatter().Serialize(writer, IPAddress.Parse("170.187.204.221"));
    Console.WriteLine(BitConverter.ToString(writer.ToArray()));
}
~~~

I've used the IP address `170.187.204.221` because it converts to an easy to spot value in hexadecimal. In decimal it is 2,864,434,397 and in hexadecimal its written as `AA-BB-CC-DD`. Can you spot the four bytes of our IPv4 address in this mess? As you might expect, the `BinaryFormatter` produces trademark Microsoft bloat (for great alternatives that can produce concise binary output see [MessagePack](http://msgpack.org/), [CBOR](http://cbor.io/), [Protobuf](https://github.com/google/protobuf) and [CapNProto](https://capnproto.org/)).

~~~text
Offset(h) 00 01 02 03 04 05 06 07 08 09 0A 0B 0C 0D 0E 0F
--------  -----------------------------------------------
00000000  00 01 00 00 00 FF FF FF FF 01 00 00 00 00 00 00  .....ÿÿÿÿ.......
00000010  00 0C 02 00 00 00 49 53 79 73 74 65 6D 2C 20 56  ......ISystem, V
00000020  65 72 73 69 6F 6E 3D 34 2E 30 2E 30 2E 30 2C 20  ersion=4.0.0.0, 
00000030  43 75 6C 74 75 72 65 3D 6E 65 75 74 72 61 6C 2C  Culture=neutral,
00000040  20 50 75 62 6C 69 63 4B 65 79 54 6F 6B 65 6E 3D   PublicKeyToken=
00000050  62 37 37 61 35 63 35 36 31 39 33 34 65 30 38 39  b77a5c561934e089
00000060  05 01 00 00 00 14 53 79 73 74 65 6D 2E 4E 65 74  ......System.Net
00000070  2E 49 50 41 64 64 72 65 73 73 05 00 00 00 09 6D  .IPAddress.....m
00000080  5F 41 64 64 72 65 73 73 08 6D 5F 46 61 6D 69 6C  _Address.m_Famil
00000090  79 09 6D 5F 4E 75 6D 62 65 72 73 09 6D 5F 53 63  y.m_Numbers.m_Sc
000000A0  6F 70 65 49 64 0A 6D 5F 48 61 73 68 43 6F 64 65  opeId.m_HashCode
000000B0  00 04 07 00 00 09 20 53 79 73 74 65 6D 2E 4E 65  ...... System.Ne
000000C0  74 2E 53 6F 63 6B 65 74 73 2E 41 64 64 72 65 73  t.Sockets.Addres
000000D0  73 46 61 6D 69 6C 79 02 00 00 00 0E 09 08 02 00  sFamily.........
000000E0  00 00 AA BB CC DD 00 00 00 00 05 FD FF FF FF 20  ..ª»ÌÝ.....ýÿÿÿ 
000000F0  53 79 73 74 65 6D 2E 4E 65 74 2E 53 6F 63 6B 65  System.Net.Socke
00000100  74 73 2E 41 64 64 72 65 73 73 46 61 6D 69 6C 79  ts.AddressFamily
00000110  01 00 00 00 07 76 61 6C 75 65 5F 5F 00 08 02 00  .....value__....
00000120  00 00 02 00 00 00 09 04 00 00 00 00 00 00 00 00  ................
00000130  00 00 00 00 00 00 00 0F 04 00 00 00 08 00 00 00  ................
00000140  0E 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
00000150  00 0B                                            ..
~~~

The IPAddress object represents both IPv4 addresses at 32 bits in length, and IPv6 addresses at 128 bits in length. Of course, an IPAddress is just a number, but what matters is the representation (See [endianness](https://en.wikipedia.org/wiki/Endianness) and host or network order for further reading).

For example, this is the IP address of my local gateway device in several different representations.

~~~text
Binary                              1100 0000 1010 1000 0000 0001 0000 0001
Decimal                             3,232,235,777
Hexadecimal                         0xC0A80101
Base64 encoded                      wKgBAQ==
IPv4 dotted decimal notation        192.168.1.1
IPv6                                0:0:0:0:0:ffff:c0a8:101
Byte array                          0xC0, 0xA8, 0x01, 0x01
~~~

There is no correct way to represent an IP address, and IPv6 can complicate the representation element further. The `IPAddress` class is a complex object which stores more than just the address component. So arguably, there is a good reason why `System.Net.IPAddress` and classes which include references to it are not serialisable by default, but its annoying as hell - so lets fix that.

Lets look at a simple program which should produce some JSON for us.

~~~csharp
using System;
using System.Net;
using Newtonsoft.Json;

namespace ConsoleApplication1
{
    class Program
    {
        static void Main()
        {
            // build an instance of the class we want to serialise
            var sampleObject = new SampleClass
            {
                Machine1 = IPAddress.Parse("8.8.8.8"),
                Machine2 = IPAddress.Parse("8.8.4.4")
            };

            // serialise the sampleObject into JSON
            var json = JsonConvert.SerializeObject(sampleObject);

            // show the JSON
            Console.WriteLine(json);

            // deserialise the JSON
            var reversed = JsonConvert.DeserializeObject<SampleClass>(json);

            // show the values
            Console.WriteLine(reversed.Machine1);
            Console.WriteLine(reversed.Machine2);
            Console.ReadLine();
        }
    }

    public class SampleClass
    {
        public IPAddress Machine1 { get; set; }
        public IPAddress Machine2 { get; set; }
    }
}
~~~

Predictably, this throws a `Newtonsoft.Json.JsonSerializationException` exception at line 19, as we call `SerializeObject()`: "Error getting value from 'ScopeId' on 'System.Net.IPAddress'". Put simply, Json.Net doesn't know how best to represent the IPAddress object as JSON, so we need to help it.

The `JsonConverter` class in the `Newtonsoft.Json` namespace is our saviour, it defines three important virtual methods which we can override, `WriteJson()`, `ReadJson()` and `CanConvert()`. Collectively we can use these methods of to control the serialisation and deserialisation process.

We'll start by creating a new class called `IPAddressConverter` which inherits from `JsonConverter` and override these three methods.

~~~csharp
using System;
using Newtonsoft.Json;

namespace ConsoleApplication1
{
    public class IPAddressConverter : JsonConverter
    {
        public override bool CanConvert(Type objectType)
        {
        }
        
        public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
        {
        }
        
        public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
        {
        }
    }
}
~~~

The `WriteJson()` method will define how our IPAddress object translates into JSON. The `ReadJson()` method is be responsible for converting JSON values back into IPAddress objects. `CanConvert()` allows us to define if the object type being passed into our custom converter class is a type we're expecting, but more importantly a type we're able to understand and convert.

In order to wire up this class so that Json.Net will use it when it encounters an IPAddress we need go back to the class we wanted serialised, and decorate the IPAddress properties as follows;

~~~csharp
public class SampleClass
{
    [JsonConverter(typeof(IPAddressConverter))]
    public IPAddress Machine1 { get; set; }
    
    [JsonConverter(typeof(IPAddressConverter))]
    public IPAddress Machine2 { get; set; }
}
~~~

In keeping with JSON's readability we'll represent our IPAddress object in JSON as a simple string value in dotted decimal notation. What we want is neat JSON that looks like this:

~~~javascript
{
    "Machine1":"8.8.8.8",
    "Machine2":"8.8.4.4"
}
~~~

When `WriteJson()` is called, the `value` argument contains an IPAddress object, all we have to do is convert that object to the representation of our choice, create a `JToken` from it, and then write it to the `JsonWriter`, also passed in as an argument (`writer`). In this case then, we are just converting the IPAddress object into a string and writing it back to Json.Net.

~~~csharp
public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
{
    var address = value.ToString();
    JToken.FromObject(address).WriteTo(writer);
}

Equally, when `ReadJson()` is invoked the `reader` argument contains the Json string and the `objectType` argument contains a reference to the type of object Json.Net is expecting us to convert the `reader` value into.

~~~csharp
public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
{
    var address = JToken.Load(reader).ToString();
    return IPAddress.Parse(address);
}
~~~

That's all there is to it.

The full `IPAddressConverter.cs` class is shown below. It is capable of serialising both `IPAddress` and `List<IPAddress>` objects, but you can extend it as required.

~~~csharp
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace ConsoleApplication1
{
    public class IPAddressConverter : JsonConverter
    {
        /// <summary>
        /// 
        /// </summary>
        /// <param name="objectType"></param>
        /// <returns></returns>
        public override bool CanConvert(Type objectType)
        {
            if (objectType == typeof(IPAddress)) return true;
            if (objectType == typeof(List<IPAddress>)) return true;

            return false;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="reader"></param>
        /// <param name="objectType"></param>
        /// <param name="existingValue"></param>
        /// <param name="serializer"></param>
        /// <returns></returns>
        public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
        {
            // convert an ipaddress represented as a string into an IPAddress object and return it to the caller
            if (objectType == typeof(IPAddress))
            {
                return IPAddress.Parse(JToken.Load(reader).ToString());
            }

            // convert an array of IPAddresses represented as strings into a List<IPAddress> object and return it to the caller
            if (objectType == typeof(List<IPAddress>))
            {
                return JToken.Load(reader).Select(address => IPAddress.Parse((string) address)).ToList();
            }

            throw new NotImplementedException();
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="writer"></param>
        /// <param name="value"></param>
        /// <param name="serializer"></param>
        public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
        {
            // convert an IPAddress object to a string representation of itself and Write it to the serialiser
            if (value.GetType() == typeof(IPAddress))
            {
                JToken.FromObject(value.ToString()).WriteTo(writer);
                return;
            }

            // convert a List<IPAddress> object to a string[] representation of itself and Write it to the serialiser
            if (value.GetType() == typeof(List<IPAddress>))
            {
                JToken.FromObject((from n in (List<IPAddress>) value select n.ToString()).ToList()).WriteTo(writer);
                return;
            }
            
            throw new NotImplementedException();
        }
    }
}
~~~

As promised (in the post title) I've written an `IPEndPointConverter` for `IPEndPoint` typed objects too which [lives here as a GitHub gist](https://gist.github.com/marcbarry/2e7a64fed2ae539cf415) along with the `IPAddressConverter` too.

Note that for the `IPEndPointConverter.cs` class I've included an extension method in a third class, `IPAddressExtensions.cs` which takes a string in the format of "127.0.0.1:80" and returns an `IPEndPoint` for better readability in the converter class.

The source code from this post is [available on Github](https://gist.github.com/marcbarry/2e7a64fed2ae539cf415).



