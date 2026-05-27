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
})({"13Fo":[function(require,module,exports) {
//=========================================================================
// minimalist DOM helpers
//=========================================================================
window.Dom = {
  get: function get(id) {
    return id instanceof HTMLElement || id === document ? id : document.getElementById(id);
  },
  set: function set(id, html) {
    Dom.get(id).innerHTML = html;
  },
  on: function on(ele, type, fn, capture) {
    Dom.get(ele).addEventListener(type, fn, capture);
  },
  un: function un(ele, type, fn, capture) {
    Dom.get(ele).removeEventListener(type, fn, capture);
  },
  show: function show(ele, type) {
    Dom.get(ele).style.display = type || 'block';
  },
  blur: function blur(ev) {
    ev.target.blur();
  },
  addClassName: function addClassName(ele, name) {
    Dom.toggleClassName(ele, name, true);
  },
  removeClassName: function removeClassName(ele, name) {
    Dom.toggleClassName(ele, name, false);
  },
  toggleClassName: function toggleClassName(ele, name, on) {
    ele = Dom.get(ele);
    var classes = ele.className.split(' ');
    var n = classes.indexOf(name);
    on = typeof on == 'undefined' ? n < 0 : on;
    if (on && n < 0) classes.push(name);else if (!on && n >= 0) classes.splice(n, 1);
    ele.className = classes.join(' ');
  },
  storage: window.localStorage || {} //=========================================================================
  // general purpose helpers (mostly math)
  //=========================================================================

};
window.Util = {
  timestamp: function timestamp() {
    return new Date().getTime();
  },
  toInt: function toInt(obj, def) {
    if (obj !== null) {
      var x = parseInt(obj, 10);
      if (!isNaN(x)) return x;
    }

    return Util.toInt(def, 0);
  },
  toFloat: function toFloat(obj, def) {
    if (obj !== null) {
      var x = parseFloat(obj);
      if (!isNaN(x)) return x;
    }

    return Util.toFloat(def, 0.0);
  },
  limit: function limit(value, min, max) {
    return Math.max(min, Math.min(value, max));
  },
  randomInt: function randomInt(min, max) {
    return Math.round(Util.interpolate(min, max, Math.random()));
  },
  randomChoice: function randomChoice(options) {
    return options[Util.randomInt(0, options.length - 1)];
  },
  percentRemaining: function percentRemaining(n, total) {
    return n % total / total;
  },
  accelerate: function accelerate(v, accel, dt) {
    return v + accel * dt;
  },
  interpolate: function interpolate(a, b, percent) {
    return a + (b - a) * percent;
  },
  easeIn: function easeIn(a, b, percent) {
    return a + (b - a) * Math.pow(percent, 2);
  },
  easeOut: function easeOut(a, b, percent) {
    return a + (b - a) * (1 - Math.pow(1 - percent, 2));
  },
  easeInOut: function easeInOut(a, b, percent) {
    return a + (b - a) * (-Math.cos(percent * Math.PI) / 2 + 0.5);
  },
  exponentialFog: function exponentialFog(distance, density) {
    return 1 / Math.pow(Math.E, distance * distance * density);
  },
  increase: function increase(start, increment, max) {
    // with looping
    var result = start + increment;

    while (result >= max) {
      result -= max;
    }

    while (result < 0) {
      result += max;
    }

    return result;
  },
  project: function project(p, cameraX, cameraY, cameraZ, cameraDepth, width, height, roadWidth) {
    p.camera.x = (p.world.x || 0) - cameraX;
    p.camera.y = (p.world.y || 0) - cameraY;
    p.camera.z = (p.world.z || 0) - cameraZ;
    p.screen.scale = cameraDepth / p.camera.z;
    p.screen.x = Math.round(width / 2 + p.screen.scale * p.camera.x * width / 2);
    p.screen.y = Math.round(height / 2 - p.screen.scale * p.camera.y * height / 2);
    p.screen.w = Math.round(p.screen.scale * roadWidth * width / 2);
  },
  overlap: function overlap(x1, w1, x2, w2, percent) {
    var half = (percent || 1) / 2;
    var min1 = x1 - w1 * half;
    var max1 = x1 + w1 * half;
    var min2 = x2 - w2 * half;
    var max2 = x2 + w2 * half;
    return !(max1 < min2 || min1 > max2);
  } //=========================================================================
  // POLYFILL for requestAnimationFrame
  //=========================================================================

};

if (!window.requestAnimationFrame) {
  // http://paulirish.com/2011/requestanimationframe-for-smart-animating/
  window.requestAnimationFrame = window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback, element) {
    window.setTimeout(callback, 1000 / 60);
  };
} //=========================================================================
// GAME LOOP helpers
//=========================================================================

pause = true;
resultToDisplay = ''
window.Game = {
  // a modified version of the game loop from my previous boulderdash game - see http://codeincomplete.com/posts/2011/10/25/javascript_boulderdash/#gameloop
  run: function run(options) {
    Game.loadImages(options.images, function (images) {
      options.ready(images); // tell caller to initialize itself because images are loaded and we're ready to rumble

      Game.setKeyListener(options.keys);
      var canvas = options.canvas,
          // canvas render target is provided by caller
      update = options.update,
          // method to update game logic is provided by caller
      render = options.render,
          // method to render the game is provided by caller
      step = options.step,
          // fixed frame step (1/fps) is specified by caller
      stats = options.stats,
          // stats instance is provided by caller
      now = null,
      last = Util.timestamp(),
      dt = 0,
      gdt = 0;

      function frame() {
        now = Util.timestamp();
        if (pause === false){
          dt = Math.min(1, (now - last) / 1000); // using requestAnimationFrame have to be able to handle large delta's caused when it 'hibernates' in a background or non-visible tab
          gdt = gdt + dt;
          while (gdt > step && pause === false) {
              gdt = gdt - step;
              update(step);
          }
          render();
          // stats.update();
          last = now;
          requestAnimationFrame(frame, canvas);
        }else{
          last = now;
          render();
          setTimeout(frame, 300)
        }
        
      }

      frame(); // lets get this party started
      //Game.playMusic();
    });
  },
  //---------------------------------------------------------------------------
  loadImages: function loadImages(names, callback) {
    // load multiple images and callback when ALL images have loaded
    var result = [];
    var count = names.length;

    var onload = function onload() {
      if (--count == 0) callback(result);
    };

    for (var n = 0; n < names.length; n++) {
      var name = names[n];
      result[n] = document.createElement('img');
      Dom.on(result[n], 'load', onload);
      result[n].src = "images/" + name + ".png";
    }
  },
  //---------------------------------------------------------------------------
  setKeyListener: function setKeyListener(keys) {
    var onkey = function onkey(keyCode, mode) {
      var n, k;

      for (n = 0; n < keys.length; n++) {
        k = keys[n];
        k.mode = k.mode || 'up';

        if (k.key == keyCode || k.keys && k.keys.indexOf(keyCode) >= 0) {
          if (k.mode == mode) {
            k.action.call();
          }
        }
      }
    };

    Dom.on(document, 'keydown', function (ev) {
      onkey(ev.keyCode, 'down');
    });
    Dom.on(document, 'keyup', function (ev) {
      onkey(ev.keyCode, 'up');
    });
  },
  //---------------------------------------------------------------------------
  stats: function stats(parentId, id) {
    // construct mr.doobs FPS counter - along with friendly good/bad/ok message box
    var result = new Stats();
    result.domElement.id = id || 'stats';
    Dom.get(parentId).appendChild(result.domElement);
    var msg = document.createElement('div');
    msg.style.cssText = "border: 2px solid gray; padding: 5px; margin-top: 5px; text-align: left; font-size: 1.15em; text-align: right;";
    msg.innerHTML = "Your canvas performance is ";
    Dom.get(parentId).appendChild(msg);
    var value = document.createElement('span');
    value.innerHTML = "...";
    msg.appendChild(value);
    setInterval(function () {
      var fps = result.current();
      var ok = fps > 50 ? 'good' : fps < 30 ? 'bad' : 'ok';
      var color = fps > 50 ? 'green' : fps < 30 ? 'red' : 'gray';
      value.innerHTML = ok;
      value.style.color = color;
      msg.style.borderColor = color;
    }, 5000);
    return result;
  },
  //---------------------------------------------------------------------------
  playMusic: function playMusic() {
    var music = Dom.get('music');
    music.loop = true;
    music.volume = 0.05; // shhhh! annoying music!

    music.muted = Dom.storage.muted === "true";
    music.play();
    Dom.toggleClassName('mute', 'on', music.muted);
    Dom.on('mute', 'click', function () {
      Dom.storage.muted = music.muted = !music.muted;
      Dom.toggleClassName('mute', 'on', music.muted);
    });
  } //=========================================================================
  // canvas rendering helpers
  //=========================================================================

};
window.Render = {
  polygon: function polygon(ctx, x1, y1, x2, y2, x3, y3, x4, y4, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.lineTo(x4, y4);
    ctx.closePath();
    ctx.fill();
  },
  //---------------------------------------------------------------------------
  segment: function segment(ctx, width, lanes, x1, y1, w1, x2, y2, w2, fog, color) {
    var r1 = Render.rumbleWidth(w1, lanes),
        r2 = Render.rumbleWidth(w2, lanes),
        l1 = Render.laneMarkerWidth(w1, lanes),
        l2 = Render.laneMarkerWidth(w2, lanes),
        lanew1,
        lanew2,
        lanex1,
        lanex2,
        lane;
    ctx.fillStyle = color.grass;
    ctx.fillRect(0, y2, width, y1 - y2);
    Render.polygon(ctx, x1 - w1 - r1, y1, x1 - w1, y1, x2 - w2, y2, x2 - w2 - r2, y2, color.rumble);
    Render.polygon(ctx, x1 + w1 + r1, y1, x1 + w1, y1, x2 + w2, y2, x2 + w2 + r2, y2, color.rumble);
    Render.polygon(ctx, x1 - w1, y1, x1 + w1, y1, x2 + w2, y2, x2 - w2, y2, color.road);

    if (color.lane) {
      lanew1 = w1 * 2 / lanes;
      lanew2 = w2 * 2 / lanes;
      lanex1 = x1 - w1 + lanew1;
      lanex2 = x2 - w2 + lanew2;

      for (lane = 1; lane < lanes; lanex1 += lanew1, lanex2 += lanew2, lane++) {
        Render.polygon(ctx, lanex1 - l1 / 2, y1, lanex1 + l1 / 2, y1, lanex2 + l2 / 2, y2, lanex2 - l2 / 2, y2, color.lane);
      }
    }

    Render.fog(ctx, 0, y1, width, y2 - y1, fog);
  },
  //---------------------------------------------------------------------------
  background: function background(ctx, _background, width, height, layer, rotation, offset) {
    rotation = rotation || 0;
    offset = offset || 0;
    var imageW = layer.w / 2;
    var imageH = layer.h;
    var sourceX = layer.x + Math.floor(layer.w * rotation);
    var sourceY = layer.y;
    var sourceW = Math.min(imageW, layer.x + layer.w - sourceX);
    var sourceH = imageH;
    var destX = 0;
    var destY = offset;
    var destW = Math.floor(width * (sourceW / imageW));
    var destH = height;
    ctx.drawImage(_background, sourceX, sourceY, sourceW, sourceH, destX, destY, destW, destH);
    if (sourceW < imageW) ctx.drawImage(_background, layer.x, sourceY, imageW - sourceW, sourceH, destW - 1, destY, width - destW, destH);
  },
  //---------------------------------------------------------------------------
  sprite: function sprite(ctx, width, height, resolution, roadWidth, sprites, _sprite, scale, destX, destY, offsetX, offsetY, clipY) {
    //  scale for projection AND relative to roadWidth (for tweakUI)
    var destW = _sprite.w * scale * width / 2 * (SPRITES.SCALE * roadWidth);
    var destH = _sprite.h * scale * width / 2 * (SPRITES.SCALE * roadWidth);
    destX = destX + destW * (offsetX || 0);
    destY = destY + destH * (offsetY || 0);
    var clipH = clipY ? Math.max(0, destY + destH - clipY) : 0;
    if (clipH < destH) ctx.drawImage(sprites, _sprite.x, _sprite.y, _sprite.w, _sprite.h - _sprite.h * clipH / destH, destX, destY, destW, destH - clipH);
  },
  //---------------------------------------------------------------------------
  player: function player(ctx, width, height, resolution, roadWidth, sprites, speedPercent, scale, destX, destY, steer, updown) {
    var bounce = 1.5 * Math.random() * speedPercent * resolution * Util.randomChoice([-1, 1]);
    var sprite;
    if (steer < 0) sprite = updown > 0 ? SPRITES.PLAYER_UPHILL_LEFT : SPRITES.PLAYER_LEFT;else if (steer > 0) sprite = updown > 0 ? SPRITES.PLAYER_UPHILL_RIGHT : SPRITES.PLAYER_RIGHT;else sprite = updown > 0 ? SPRITES.PLAYER_UPHILL_STRAIGHT : SPRITES.PLAYER_STRAIGHT;
    Render.sprite(ctx, width, height, resolution, roadWidth, sprites, sprite, scale, destX, destY + bounce, -0.5, -1);
  },
  //---------------------------------------------------------------------------
  fog: function fog(ctx, x, y, width, height, _fog) {
    if (_fog < 1) {
      ctx.globalAlpha = 1 - _fog;
      ctx.fillStyle = COLORS.FOG;
      ctx.fillRect(x, y, width, height);
      ctx.globalAlpha = 1;
    }
  },
  rumbleWidth: function rumbleWidth(projectedRoadWidth, lanes) {
    return projectedRoadWidth / Math.max(6, 2 * lanes);
  },
  laneMarkerWidth: function laneMarkerWidth(projectedRoadWidth, lanes) {
    return projectedRoadWidth / Math.max(32, 8 * lanes);
  } //=============================================================================
  // RACING GAME CONSTANTS
  //=============================================================================

};
window.KEY = {
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  A: 65,
  D: 68,
  S: 83,
  W: 87,
  SPACE: 32,
  B: 66
};
window.COLORS = {
  SKY: '#72D7EE',
  TREE: '#005108',
  FOG: '#005108',
  //'#2A323A',
  LIGHT: {
    road: '#6B6B6B',
    grass: '#10AA10',
    rumble: '#555555',
    lane: '#CCCCCC'
  },
  DARK: {
    road: '#696969',
    grass: '#009A00',
    rumble: '#BBBBBB'
  },
  START: {
    road: 'white',
    grass: 'white',
    rumble: 'white'
  },
  FINISH: {
    road: 'black',
    grass: 'black',
    rumble: 'black'
  },
  RED: {
    road: '#ff1122',
    grass: '#009A00',
    rumble: '#BBBBBB'
  },
  DRKRED: {
    road: '#330000',
    grass: '#009A00',
    rumble: '#BBBBBB'
  },
  GREEN: {
    road: '#22ff11',
    grass: '#009A00',
    rumble: '#BBBBBB'
  },
  GREENLGT: {
    road: '#22ff11',
    grass: '#10AA10',
    rumble: '#555555'
  },
  BLUE: {
    road: '#1122ff'
  },
  DKRLGT: {
    road: '#3c3c3c',
    grass: '#3C4D5C',
    rumble: '#555555',
    lane: '#CCCCCC'
  },
  DKR: {
    road: '#3a3a3a',
    grass: '#323E4A',
    rumble: '#BBBBBB'
  },
  DKRGRN: {
    road: '#22ff11',
    grass: '#3C4D5C',
    rumble: '#BBBBBB'
  },
  DKRREDD: {
    road: '#ff1122',
    grass: '#3C4D5C',
    rumble: '#BBBBBB'
  },
  SINGLEGREEN: "#22ff11",
  SINGLERED: "#ff1122"
};
window.BACKGROUND = {
  HILLS: {
    x: 5,
    y: 5,
    w: 1280,
    h: 480
  },
  SKY: {
    x: 5,
    y: 495,
    w: 1280,
    h: 480
  },
  TREES: {
    x: 5,
    y: 985,
    w: 1280,
    h: 480
  }
};
window.SPRITES = {
  GREEN: {
    x: 587,
    y: 1104,
    w: 65,
    h: 223
  },
  AMBER: {
    x: 652,
    y: 1104,
    w: 65,
    h: 223
  },
  RED: {
    x: 717,
    y: 1104,
    w: 65,
    h: 223
  },
  PALM_TREE: {
    x: 5,
    y: 5,
    w: 215,
    h: 540
  },
  BILLBOARD08: {
    x: 230,
    y: 5,
    w: 385,
    h: 265
  },
  TREE1: {
    x: 625,
    y: 5,
    w: 360,
    h: 360
  },
  DEAD_TREE1: {
    x: 5,
    y: 555,
    w: 135,
    h: 332
  },
  BILLBOARD09: {
    x: 150,
    y: 555,
    w: 328,
    h: 282
  },
  BOULDER3: {
    x: 230,
    y: 280,
    w: 320,
    h: 220
  },
  COLUMN: {
    x: 995,
    y: 5,
    w: 200,
    h: 315
  },
  BILLBOARD01: {
    x: 625,
    y: 375,
    w: 300,
    h: 170
  },
  BILLBOARD06: {
    x: 488,
    y: 555,
    w: 298,
    h: 190
  },
  BILLBOARD05: {
    x: 5,
    y: 897,
    w: 298,
    h: 190
  },
  BILLBOARD07: {
    x: 313,
    y: 897,
    w: 298,
    h: 190
  },
  BILLBOARD10: {
    x: 950,
    y: 1037,
    w: 190,
    h: 450
  },
  BOULDER2: {
    x: 621,
    y: 897,
    w: 298,
    h: 140
  },
  TREE2: {
    x: 1205,
    y: 5,
    w: 282,
    h: 295
  },
  BILLBOARD04: {
    x: 1205,
    y: 310,
    w: 268,
    h: 170
  },
  DEAD_TREE2: {
    x: 1205,
    y: 490,
    w: 150,
    h: 260
  },
  BOULDER1: {
    x: 1205,
    y: 760,
    w: 168,
    h: 248
  },
  BUSH1: {
    x: 5,
    y: 1097,
    w: 240,
    h: 155
  },
  CACTUS: {
    x: 929,
    y: 897,
    w: 235,
    h: 118
  },
  BUSH2: {
    x: 255,
    y: 1097,
    w: 232,
    h: 152
  },
  BILLBOARD03: {
    x: 5,
    y: 1262,
    w: 230,
    h: 220
  },
  BILLBOARD02: {
    x: 245,
    y: 1262,
    w: 215,
    h: 220
  },
  STUMP: {
    x: 995,
    y: 330,
    w: 195,
    h: 140
  },
  SEMI: {
    x: 1365,
    y: 490,
    w: 122,
    h: 144
  },
  TRUCK: {
    x: 1365,
    y: 644,
    w: 100,
    h: 78
  },
  CAR03: {
    x: 1383,
    y: 760,
    w: 88,
    h: 55
  },
  CAR02: {
    x: 1383,
    y: 825,
    w: 80,
    h: 59
  },
  CAR04: {
    x: 1383,
    y: 894,
    w: 80,
    h: 57
  },
  CAR01: {
    x: 1205,
    y: 1018,
    w: 80,
    h: 56
  },
  PLAYER_UPHILL_LEFT: {
    x: 1383,
    y: 961,
    w: 80,
    h: 45
  },
  PLAYER_UPHILL_STRAIGHT: {
    x: 1295,
    y: 1018,
    w: 80,
    h: 45
  },
  PLAYER_UPHILL_RIGHT: {
    x: 1385,
    y: 1018,
    w: 80,
    h: 45
  },
  PLAYER_LEFT: {
    x: 995,
    y: 480,
    w: 80,
    h: 41
  },
  PLAYER_STRAIGHT: {
    x: 1085,
    y: 480,
    w: 80,
    h: 41
  },
  PLAYER_RIGHT: {
    x: 995,
    y: 531,
    w: 80,
    h: 41
  }
};
window.SPRITES.SCALE = 0.3 * (1 / SPRITES.PLAYER_STRAIGHT.w); // the reference sprite width should be 1/3rd the (half-)roadWidth

window.SPRITES.BILLBOARDS = [SPRITES.BILLBOARD01, SPRITES.BILLBOARD02, SPRITES.BILLBOARD03, SPRITES.BILLBOARD04, SPRITES.BILLBOARD05, SPRITES.BILLBOARD06, SPRITES.BILLBOARD07, SPRITES.BILLBOARD08, SPRITES.BILLBOARD09];
window.SPRITES.PLANTS = [SPRITES.TREE1, SPRITES.TREE2, SPRITES.DEAD_TREE1, SPRITES.DEAD_TREE2, SPRITES.PALM_TREE, SPRITES.BUSH1, SPRITES.BUSH2, SPRITES.CACTUS, SPRITES.STUMP, SPRITES.BOULDER1, SPRITES.BOULDER2, SPRITES.BOULDER3];
window.SPRITES.CARS = [SPRITES.CAR01, SPRITES.CAR02, SPRITES.CAR03, SPRITES.CAR04, SPRITES.SEMI, SPRITES.TRUCK]; // training-related stuff

window.trainingData = new Array();
window.actionBuffer = new Array();
window.model = undefined;
window.mode = 'train';
window.amberTime = 3;
window.weather = "normal";
},{}]},{},["13Fo"], null)
//# sourceMappingURL=common.3c19e41e.map