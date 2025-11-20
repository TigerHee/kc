function getVersion(url, callback) {
  const xhr = new XMLHttpRequest();
  xhr.overrideMimeType("application/json");
  xhr.open("GET", url, true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      callback(xhr.responseText);
    }
  };

  xhr.send(null);
}

window._KC_CHECK_VERSION_ = function checkVersion(url, config, handler) {
  if (!config) {
    return;
  }

  if (config.env === "development") {
    return;
  }

  getVersion(url, function (data) {
    try {
      const { release } = JSON.parse(data);
      if (release && config.version && config.version !== release) {
        const refresh = sessionStorage.getItem("refresh_version");
        if (!refresh) {
          if (typeof handler === "function") {
            handler(release);
          }
          sessionStorage.setItem("refresh_version", 1);
          window.location.reload(true);
        }
      }
    } catch (e) {
      console.error(e);
    }
  });
};
