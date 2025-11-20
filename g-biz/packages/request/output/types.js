export var RuntimeEnvironment;
(function (RuntimeEnvironment) {
    RuntimeEnvironment[RuntimeEnvironment["BROWSER"] = 1] = "BROWSER";
    RuntimeEnvironment[RuntimeEnvironment["SSR"] = 2] = "SSR";
    RuntimeEnvironment[RuntimeEnvironment["APP"] = 3] = "APP";
    RuntimeEnvironment[RuntimeEnvironment["WEBWORKER"] = 4] = "WEBWORKER";
    RuntimeEnvironment[RuntimeEnvironment["RN"] = 5] = "RN";
})(RuntimeEnvironment || (RuntimeEnvironment = {}));
