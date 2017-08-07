function CleanJSONObject (JSONInput){
    return JSON.parse(JSON.stringify(JSONInput).toLowerCase());
}

module.exports.CleanJSONObject = CleanJSONObject;

