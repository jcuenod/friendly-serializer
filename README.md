# Friendly (De)Serializer

## Introduction

Normal JSON serialization involves a lot of braces and quotation marks. These are not great in urls. This library aims to make it easier to use JSON in urls, but use `encodeURIComponent()` as well if necessary.

The object `{ "a": "b", "c": "d" }` becomes `a=b&c=d` (note the `&` separator).

Nested objects are marked by dots. 
```javascript
serialize({ "a": { "b": "c" } })
// "a.b=c"
```

Arrays are just numeric keys (also marked by dots). The deserializer will create an array if the key is numeric (so the deserializer does not support objects that have only numeric keys because it will assume they are arrays).
```javascript
serialize({ "a": [ "b", "c" ] })
// a.0=b&a.1=c
```

Arrays can contain objects.
```javascript
serialize({ "a": [ { "b": "c" }, { "d": "e" } ] })
// a.0.b=c&a.1.d=e
```

Note that spaces are not encoded. For use in urls, you may want `%20`—this may be accomplished using `encodeURIComponent()`.

## Installation

Install [`friendly-serializer`](https://www.npmjs.com/package/friendly-serializer) from npm.

```
npm install friendly-serializer
```

## Usage
    
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
// str == "name=John Doe&age=42&address.street=123 Main Street&address.city=Anytown&address.state=CA&address.phoneNumbers=123-456-7890&address.phoneNumbers=234-567-8901"

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
