const serialize = (obj, namespace = "") =>
    Object.keys(obj).map((key) => {
        const newNamespace = namespace ? `${namespace}.${key}` : key
        const value = obj[key]
        if (typeof value === "object") {
            return serialize(value, `${newNamespace}`)
        }
        return `${newNamespace}=${encodeURIComponent(value)}`
    }).join("&")

const _convertObjectsWithNumericKeysToArrays = (obj) => {
    if (typeof obj !== "object") {
        return obj
    }
    const keys = Object.keys(obj)
    const isArray = keys.every(k => !isNaN(parseInt(k)))
    return isArray
        ? keys.map(k => _convertObjectsWithNumericKeysToArrays(obj[k]))
        : keys.reduce((acc, k) => {
            acc[k] = _convertObjectsWithNumericKeysToArrays(obj[k])
            return acc
        }, {})
}
const _deserialize = kvPairs => {
    const obj = {}
    kvPairs.forEach(([key, value]) => {
        const keys = key.split(".")
        const lastKey = keys.pop()
        const parent = keys.reduce((acc, key) => {
            acc[key] = acc[key] || {}
            return acc[key]
        }, obj)
        parent[lastKey] = value
    })
    return _convertObjectsWithNumericKeysToArrays(obj)
}

const deserialize = str => {
    return _deserialize(str.split("&")
        .map(item => item.split("="))
        .map(([k, v]) => [k, decodeURIComponent(v)])
    )
}
const convertDeserializedQueryObject = obj => {
    return _deserialize(Object.entries(obj))
}

module.exports = {
    serialize,
    deserialize,
    convertDeserializedQueryObject,
}