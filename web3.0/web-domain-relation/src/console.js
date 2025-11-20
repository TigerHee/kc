const rewriteConsole = function (isDebug) {
  window.console.log = (function (origConsole) {
    return function () {
      isDebug && origConsole && origConsole.apply(origConsole, arguments);
    };
  })(window.console.log);
};

export default rewriteConsole;
