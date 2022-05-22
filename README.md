# Friendly (De)Serializer

## Introduction

Normal JSON serialization involves a lot of braces and quotation marks. These clutter up urls and make them far less human readable. This library uses `encodeURIComponent()` to encode values but aims to make objects more accessible in urls.

The object `{ "a": "b", "c": "d" }` becomes `a=b&c=d`.

Nested objects are marked by dots. 
```javascript
serialize({ "a": { "b": "c" } })
// "a.b=c"
```

Arrays are just numeric keys (also marked by dots). The deserializer will create an array if the key is numeric. For this reason, the deserializer does not support objects that have only numeric keys because it will assume they are arrays.
```javascript
serialize({ "a": [ "b", "c" ] })
// a.0=b&a.1=c
```

Arrays can contain objects.
```javascript
serialize({ "a": [ { "b": "c" }, { "d": "e" } ] })
// a.0.b=c&a.1.d=e
```

## Installation

Install [`friendly-serializer`](https://www.npmjs.com/package/friendly-serializer) from npm.

```
npm install friendly-serializer
```

## Usage

If you are controlling to GET on the client and are handling deserialization on the server, you can do something like this:

```javascript
import { serialize, deserialize } from "friendly-serializer"

const str = serialize({
    "name": "John Doe",
    "age": 42,
    "address": {
        "street": "123 Main Street",
        "city": "Anytown",
        "state": "CA",
        "phoneNumbers": [
            "123-456-7890",
            "234-567-8901"
        ]
    }
})
// name=John%20Doe&age=42&address.street=123%20Main%20Street&address.city=Anytown&address.state=CA&address.phoneNumbers.0=123-456-7890&address.phoneNumbers.1=234-567-8901

deserialize(str)
// {
//     "name": "John Doe",
//     "age": 42,
//     "address": {
//         "street": "123 Main Street",
//         "city": "Anytown",
//         "state": "CA",
//         "phoneNumbers": [
//             "123-456-7890",
//             "234-567-8901"
//         ]
//     }
// }
```

If you are using `express`, the `req.query` object will be available to you. But express doesn't know about *friendly* serialization so the object will be deserialized incorrectly. To handle this, you can use the `convertDeserializedQueryObject()` helper function.

```javascript
import { convertDeserializedQueryObject } from "friendly-serializer"

const handleGet = async (req, res) => {
    console.log(req.query)
    // {
    //     "name": "John Doe",
    //     "age": 42,
    //     "address.street": "123 Main Street",
    //     "address.city": "Anytown",
    //     "address.state": "CA",
    //     "address.phoneNumbers.0": "123-456-7890",
    //     "address.phoneNumbers.1": "234-567-8901"
    // }
    const query = convertDeserializedQueryObject(req.query)
    console.log(query)
    // {
    //     "name": "John Doe",
    //     "age": 42,
    //     "address": {
    //         "street": "123 Main Street",
    //         "city": "Anytown",
    //         "state": "CA",
    //         "phoneNumbers": [
    //             "123-456-7890",
    //             "234-567-8901"
    //         ]
    //     }
    // }
}
```