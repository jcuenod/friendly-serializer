
// List the entire space of the object, separating each property with "&"
// The prop name will be the sum of the parent keys separated by "."
const serialize = (obj, keyName = "") =>
    Object.keys(obj).map((key) => {
        const value = obj[key]
        if (typeof value === "object") {
            return serialize(value, `${keyName}.${key}`)
        }
        return `${keyName}.${key}=${value}`
    }).join("&")

// Convert objects that have numeric keys to an arrays recursively
const convert = (obj) => {
    if (typeof obj !== "object") {
        return obj
    }
    const isArray = Object.keys(obj).every((key) => !isNaN(parseInt(key)))
    return isArray
        ? Object.keys(obj).map((key) => convert(obj[key]))
        : Object.keys(obj).reduce((acc, key) => {
            acc[key] = convert(obj[key])
            return acc
        }, {})
}
const deserialize = (str) => {
    const obj = {}
    str.split("&").forEach((item) => {
        const [key, value] = item.split("=")
        const keys = key.split(".")
        const lastKey = keys.pop()
        const parent = keys.reduce((acc, key) => {
            acc[key] = acc[key] || {}
            return acc[key]
        }, obj)
        parent[lastKey] = value
    })
    return convert(obj)
}

module.exports = {
    serialize,
    deserialize
}