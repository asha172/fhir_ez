

function getTypeof(obj) {
    if (obj instanceof Array) return DataTypes.Array;
    else if (obj instanceof Object) return DataTypes.Object;
    else if (typeof obj === "string" || obj instanceof String)
        return DataTypes.String;
    else if (typeof obj === "number" || obj instanceof Number)
        return DataTypes.Number;
    else if (typeof obj === "boolean" || obj instanceof Number)
        return DataTypes.Number;
    else if (obj instanceof Boolean) return DataTypes.Boolean;
    else return DataTypes.Null;
    // return Object.prototype.toString.call(obj).slice(8, -1)
}