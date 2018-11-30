"use strict";

/* jshint node: true */
/* globals slate, S */

slate.log('Config Initializing');

// Config //
S.cfga({
  "defaultToCurrentScreen" : true,
  "secondsBetweenRepeat" : 0.5,
  "checkDefaultsOnLoad" : true,
  "orderScreensLeftToRight" : true
});

// Monitors //
var monLaptop = "1440x900";

var monHomeWide = "2560x1080";
var monHomeTall = "1440x2560";

var monWorkBig = "2560x1440";
var monWorkMid = "1920x1080";

var monGeneral = "1x1";

 // Apps //
var apps = [
  "iTerm2",
  "Google Chrome",
  "Spring Tool Suite",
  "Code",
  "Atom",
  "Sublime Text",
  "Postman",
  "Finder",
  "Messenger",
  "HipChat",
  "Slack",
  "Trillian",
  "DbVisualizer",
  "Oracle SQL Developer",
  "Robomongo",
  "Spotify",
  "Kindle"
];

// Stations //
var homeScreens = [ monHomeWide, monLaptop, monHomeTall ];
var workScreens = [ monWorkBig, monLaptop, monWorkMid ];

// Operations //

// Full Screen
var makeFullScreen = function(screen) {
    return slate.op("move", {
      "screen": screen,
      "x": "screenOriginX",
      "y": "screenOriginY",
      "width": "screenSizeX",
      "height": "screenSizeY"
    });
};

var laptopFull = makeFullScreen(monLaptop);
var homeWideFull = makeFullScreen(monHomeWide);
var homeTallFull = makeFullScreen(monHomeTall);
var workBigFull = makeFullScreen(monWorkBig);
var workMidFull = makeFullScreen(monWorkMid);
var genFull = makeFullScreen(monGeneral);

// Left / Right
var halfLeft = function(screen) { return makeFullScreen(screen).dup({ "width" : "screenSizeX/2" }); };
var halfRight = function(screen) { return halfLeft(screen).dup({ "x" : "screenOriginX+screenSizeX/2" }); };
var homeWideLeft = halfLeft(monHomeWide);
var homeWideRight = halfRight(monHomeWide);
var workBigLeft = halfLeft(monWorkBig);
var workBigRight = halfRight(monWorkBig);
var laptopLeft= halfLeft(monLaptop);
var laptopRight = halfRight(monLaptop);
var genLeft= halfLeft(monGeneral);
var genRight = halfRight(monGeneral);

// Left / Mid / Right
var homeWideLeftThree = homeWideFull.dup({ "width" : "screenSizeX/3" });
var homeWideMidThree = homeWideLeftThree.dup({ "x" : "screenOriginX+screenSizeX/3" });
var homeWideRightThree = homeWideLeftThree.dup({ "x" : "screenOriginX+(screenSizeX*2/3)" });

// Top / Bottom
var halfTop = function(screen) { return makeFullScreen(screen).dup({"height" : "screenSizeY/2"}); };
var halfBottom = function(screen) { return halfTop(screen).dup({ "y" : "screenOriginY+screenSizeY/2" }); };
var homeTallTop = halfTop(monHomeTall);
var homeTallBot = halfBottom(monHomeTall);
var laptopTop = halfTop(monLaptop);
var laptopBot = halfBottom(monLaptop);
var genTop = halfTop(monGeneral);
var genBot = halfBottom(monGeneral);

// Top / Mid / Bottom
var homeTallTopThree = homeTallFull.dup({"height" : "screenSizeY/3"});
var homeTallMidThree = homeTallTopThree.dup({"y" : "screenOriginY+screenSizeY/3" });
var homeTallBotThree = homeTallTopThree.dup({ "y" : "screenOriginY+(screenSizeY*2/3)" });
var genMid = genTop.dup({"height" : "screenSizeY/3"}).dup({"y" : "screenOriginY+screenSizeY/3" });

// 1/3 Left, 2/3 Right
var oneThirdLeft = function(screen) { return makeFullScreen(screen).dup({ "width" : "screenSizeX/3" }); };
var twoThirdsRight = function(screen) { return halfLeft(screen).dup({ "x" : "screenOriginX+screenSizeX*1/3", "width": "screenSizeX*2/3" }); };
var workMidLeft = oneThirdLeft(monWorkMid);
var workMidRight = twoThirdsRight(monWorkMid);

function getOpsArray(ops) {
  if (!Array.isArray(ops)) ops = [ ops ];
  return ops;
}

// Layout Configs
var defaultConf = function(ops) {
  ops = getOpsArray(ops);
  return {
      "operations": ops,
      "ignore-fail" : true,
      "main-first": true,
      "repeat": true
    };
};


function chromeConf(chromeOps, mainOp) {
  var ops = getOpsArray(chromeOps);
  var numOps = ops.length;
  return {
    "operations": [function(win) {
      var title = win.title();
      if (_.isEmpty(title)) return;
      if (~title.indexOf('Cloud9')) {
        win.doOperation(mainOp);
      } else if (~title.indexOf('Mail' || ~title.indexOf('Gmail'))) {
        win.doOperation(ops[0]);
      } else if (~title.indexOf('Force.com Developer Console')) {
        win.doOperation(mainOp);
      } else {
        if (currChromeOp >= numOps) currChromeOp = 0;
        win.doOperation(ops[currChromeOp]);
        currChromeOp++;
      }
    }],
  "ignore-fail": true,
  "main-first": true,
  "repeat": true
  };
}

var currChromeOp = 0;
// Layouts //
var homeThreeMonitorName = 'homeThreeMonitorLayout';
var homeThreeMonitorLayout = slate.layout(homeThreeMonitorName, {
  "iTerm2": defaultConf(laptopFull),
  "Google Chrome": chromeConf([ homeTallBot, homeTallTop ], homeWideFull),
  "Spring Tool Suite": defaultConf(homeWideFull),
  "Atom": defaultConf(homeWideFull),
  "Code": defaultConf(homeWideFull),
  "Sublime Text": defaultConf(homeWideFull),
  "Finder": defaultConf(homeTallMidThree),
  "Messenger": defaultConf(homeTallMidThree),
  "HipChat": defaultConf(homeTallMidThree),
  "Slack": defaultConf(homeTallMidThree),
  "Trillian": defaultConf(homeTallBotThree),
  "Oracle SQL Developer": defaultConf(homeTallTop),
  "Sequel Pro": defaultConf(homeTallBot),
  "Robomongo": defaultConf(homeTallBot),
  "Spotify": defaultConf(homeTallBot),
  "Advanced REST client": defaultConf(homeTallBot),
  "Postman": defaultConf(homeTallBot),
  "Kindle": defaultConf(laptopFull)
});

var workThreeMonitorName = 'workThreeMonitorLayout';
var workThreeMonitorLayout = slate.layout(workThreeMonitorName, {
  "iTerm2": defaultConf(laptopFull),
  "Google Chrome": chromeConf(workMidRight, workBigFull),
  "Spring Tool Suite": defaultConf(workBigFull),
  "Atom": defaultConf(workBigFull),
  "Code": defaultConf(workBigFull),
  "Sublime Text": defaultConf(workBigFull),
  "Finder": defaultConf(workMidLeft),
  "Messenger": defaultConf(workMidLeft),
  "HipChat": defaultConf(workMidLeft),
  "Slack": defaultConf(workMidLeft),
  "Trillian": defaultConf(workMidLeft),
  "Oracle SQL Developer": defaultConf(workMidRight),
  "Robomongo": defaultConf(workMidRight),
  "Sequel Pro": defaultConf(workMidRight),
  "Spotify": defaultConf(laptopFull),
  "Advanced REST client": defaultConf(workMidRight),
  "Postman": defaultConf(workMidRight),
  "Kindle": defaultConf(workMidLeft)
});

var laptopMonitorName = "laptopMonitorLayout";
var laptopMonitorLayout = slate.layout(laptopMonitorName, {
  "iTerm2": defaultConf(laptopFull),
  "Google Chrome": defaultConf(laptopFull),
  "Spring Tool Suite": defaultConf(laptopFull),
  "Atom": defaultConf(laptopFull),
  "Sublime Text": defaultConf(laptopFull),
  "Finder": defaultConf(laptopTop),
  "Messenger": defaultConf(laptopBot),
  "HipChat": defaultConf(laptopBot),
  "Slack": defaultConf(laptopBot),
  "Trillian": defaultConf(laptopBot),
  "Oracle SQL Developer": defaultConf(laptopFull),
  "Robomongo": defaultConf(laptopFull),
  "Spotify": defaultConf(laptopFull),
  "Postman": defaultConf(laptopFull)
});

var homeTwoMonitorName = 'homeTwoMonitorLayout';
var homeTwoMonitorNoWideMonLayout = slate.layout(homeTwoMonitorName, {
  "iTerm2": defaultConf(homeTallBot),
  "Google Chrome": defaultConf(homeTallTop),
  "Spring Tool Suite": defaultConf(laptopFull),
  "Atom": defaultConf(laptopFull),
  "Sublime Text": defaultConf(laptopFull),
  "Spotify": defaultConf(homeTallTopThree),
  "Finder": defaultConf(homeTallMidThree),
  "Messenger": defaultConf(homeTallBot),
  "HipChat": defaultConf(homeTallBot),
  "Slack": defaultConf(homeTallBot),
  "Oracle SQL Developer": defaultConf(homeTallTop),
  "Robomongo": defaultConf(homeTallBot),
  "Postman": defaultConf(laptopFull)
});

var workTwoMonitorName = 'workTwoMonitorLayout';
var workTwoMonitorLayout = slate.layout(workTwoMonitorName, {
  "iTerm2": defaultConf(laptopFull),
  "Google Chrome": defaultConf(homeTallBot),
  "Spring Tool Suite": defaultConf(homeWideFull),
  "Atom": defaultConf(homeWideFull),
  "Sublime Text": defaultConf(homeWideFull),
  "Spotify": defaultConf(homeTallBot),
  "Finder": defaultConf(homeTallMidThree),
  "Messenger": defaultConf(homeTallBot),
  "HipChat": defaultConf(homeTallBot),
  "Slack": defaultConf(homeTallBotThree),
  "Oracle SQL Developer": defaultConf(homeWideLeft),
  "Robomongo": defaultConf(homeTallBot),
  "Postman": defaultConf(laptopFull)
});

// Screen Defaults
slate.default(homeScreens, homeThreeMonitorName);
//slate.default([ monLaptop, monHomeTall ], homeTwoMonitorNoWideMonLayout);
slate.default(workScreens, workThreeMonitorName);
slate.default(monLaptop, laptopMonitorName);

// Bind Ops To Keys
var homeThreeMonitorOp = slate.op("layout", { "name" : homeThreeMonitorLayout });
var workThreeMonitorOp = slate.op("layout", { "name" : workThreeMonitorLayout });

S.bnda({
  // Layouts
  'h:ctrl,alt,cmd': homeThreeMonitorOp,
  'w:ctrl,alt,cmd': workThreeMonitorOp,

  // Resize
  'f:ctrl,alt,cmd': genFull,
  't:ctrl,alt,cmd': genTop,
  'm:ctrl,alt,cmd': genMid,
  'b:ctrl,alt,cmd': genBot,
  'l:ctrl,alt,cmd': genLeft,
  'r:ctrl,alt,cmd': genRight,
  "f:ctrl,alt": laptopFull,

  // Modals
  "f:h,ctrl,alt:toggle": homeWideFull,
  "l:h,ctrl,alt:toggle": homeWideLeft,
  "r:h,ctrl,alt:toggle": homeWideRight,
  "t:h,ctrl,alt:toggle": homeTallTop,
  "b:h,ctrl,alt:toggle": homeTallBot,
  "up:h,ctrl,alt:toggle": homeTallMidThree,
  "left:h,ctrl,alt:toggle": homeWideLeftThree,
  "down:h,ctrl,alt:toggle": homeWideMidThree,
  "right:h,ctrl,alt:toggle": homeWideRightThree,

  "f:w,ctrl,alt:toggle": workBigFull,
  "l:w,ctrl,alt:toggle": workMidLeft,
  "r:w,ctrl,alt:toggle": workMidRight,
  "left:w,ctrl,alt:toggle": workBigLeft,
  "right:w,ctrl,alt:toggle": workBigRight
});

slate.log('Config Initialized');
