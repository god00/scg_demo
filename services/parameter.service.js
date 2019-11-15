var parameterService = {}

parameterService.validate = function (parameter) {
    if (parameter)
        return parameter != null && parameter !== "";
    else
        return false;
}

parameterService.validateNumber = function (parameter) {
    return typeof parameter == "number" ? parseFloat(parameter) : parseFloat(parameter.trim())
}

parameterService.safelyParseJSON = (json) => {
    // This function cannot be optimised, it's best to
    // keep it small!
    var parsed

    try {
        parsed = JSON.parse(json)
    } catch (e) {
        // Oh well, but whatever...
    }

    return parsed // Could be undefined!
}


module.exports = parameterService;
