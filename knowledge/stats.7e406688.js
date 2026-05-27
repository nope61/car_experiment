// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"6dsC":[function(require,module,exports) {
/**
 * @author mrdoob / http://mrdoob.com/
 */
window.Stats = function () {
  var startTime = Date.now(),
      prevTime = startTime;
  var ms = 0,
      msMin = 1000,
      msMax = 0;
  var fps = 0,
      fpsMin = 1000,
      fpsMax = 0;
  var frames = 0,
      mode = 0;
  mode;
  var container = document.createElement('div');
  container.id = 'stats';
  container.addEventListener('mousedown', function (event) {
    event.preventDefault();
    setMode(++mode % 2);
  }, false);
  container.style.cssText = 'width:80px;opacity:0.9;cursor:pointer';
  var fpsDiv = document.createElement('div');
  fpsDiv.id = 'fps';
  fpsDiv.style.cssText = 'padding:0 0 3px 3px;text-align:left;background-color:#002';
  container.appendChild(fpsDiv);
  var fpsText = document.createElement('div');
  fpsText.id = 'fpsText';
  fpsText.style.cssText = 'color:#0ff;font-family:Helvetica,Arial,sans-serif;font-size:9px;font-weight:bold;line-height:15px';
  fpsText.innerHTML = 'FPS';
  fpsDiv.appendChild(fpsText);
  var fpsGraph = document.createElement('div');
  fpsGraph.id = 'fpsGraph';
  fpsGraph.style.cssText = 'position:relative;width:74px;height:30px;background-color:#0ff';
  fpsDiv.appendChild(fpsGraph);

  while (fpsGraph.children.length < 74) {
    var bar = document.createElement('span');
    bar.style.cssText = 'width:1px;height:30px;float:left;background-color:#113';
    fpsGraph.appendChild(bar);
  }

  var msDiv = document.createElement('div');
  msDiv.id = 'ms';
  msDiv.style.cssText = 'padding:0 0 3px 3px;text-align:left;background-color:#020;display:none';
  container.appendChild(msDiv);
  var msText = document.createElement('div');
  msText.id = 'msText';
  msText.style.cssText = 'color:#0f0;font-family:Helvetica,Arial,sans-serif;font-size:9px;font-weight:bold;line-height:15px';
  msText.innerHTML = 'MS';
  msDiv.appendChild(msText);
  var msGraph = document.createElement('div');
  msGraph.id = 'msGraph';
  msGraph.style.cssText = 'position:relative;width:74px;height:30px;background-color:#0f0';
  msDiv.appendChild(msGraph);

  while (msGraph.children.length < 74) {
    var bar = document.createElement('span');
    bar.style.cssText = 'width:1px;height:30px;float:left;background-color:#131';
    msGraph.appendChild(bar);
  }

  var setMode = function setMode(value) {
    mode = value;

    switch (mode) {
      case 0:
        fpsDiv.style.display = 'block';
        msDiv.style.display = 'none';
        break;

      case 1:
        fpsDiv.style.display = 'none';
        msDiv.style.display = 'block';
        break;
    }
  };

  var updateGraph = function updateGraph(dom, value) {
    var child = dom.appendChild(dom.firstChild);
    child.style.height = value + 'px';
  };

  return {
    domElement: container,
    setMode: setMode,
    current: function current() {
      return fps;
    },
    begin: function begin() {
      startTime = Date.now();
    },
    end: function end() {
      var time = Date.now();
      ms = time - startTime;
      msMin = Math.min(msMin, ms);
      msMax = Math.max(msMax, ms);
      msText.textContent = ms + ' MS (' + msMin + '-' + msMax + ')';
      updateGraph(msGraph, Math.min(30, 30 - ms / 200 * 30));
      frames++;

      if (time > prevTime + 1000) {
        fps = Math.round(frames * 1000 / (time - prevTime));
        fpsMin = Math.min(fpsMin, fps);
        fpsMax = Math.max(fpsMax, fps);
        fpsText.textContent = fps + ' FPS (' + fpsMin + '-' + fpsMax + ')';
        updateGraph(fpsGraph, Math.min(30, 30 - fps / 100 * 30));
        prevTime = time;
        frames = 0;
      }

      return time;
    },
    update: function update() {
      startTime = this.end();
    }
  };
};
},{}]},{},["6dsC"], null)
//# sourceMappingURL=stats.7e406688.map