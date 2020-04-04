## NO-LONGER-MAINTAINED
> Just use [alfred-tabs](https://www.npmjs.com/package/alfred-tabs) instead, without Firefox and Opera support.  
> I can't manage addons anymore.  
> It's still possible with addons if you need that much!  

## Changes
> Publish extensions to ~~[AMO]~~(https://addons.mozilla.org/en-US/firefox/addon/alfred-tabs-ff/) and ~~[AOC]()~~  
> Add `tabs.alfredworkflow` and `tabs-pkg.alfredworkflow` for someone don't have/wanna node/npm  
> Feature support `Firefox`, `Opera` with browser extension.  
> Update list all tabs first you input keyword `t`, which means `argument optional` in Alfred  
> Update supported browsers work with JXA(applescript) e.g `Yandex`, `Vivaldi` and variants of `Safari` and `Chrome`.  
> Change use app's default icon.  
> Change JXA app activation with file path instead of app name.  
> Remove activation effect

## Caveats
> It works OOB with `Safari`, `Chrome`, or `Chromium` based browser which supports `applescript` well. If it's not working, just add your browser name to `SUPPORTED_BROWSER` and `CHROMIUM` section in the `tabs.js` for jxa and `constants.js` for node   
----
> **Install browser extension**  
> Firefox: https://addons.mozilla.org/en-US/firefox/addon/alfred-tabs-ff/  
> Opera: Awaiting moderation, install it manually.  
> Opera: It's easy. Go to `Extensions` page. Enable `Developer Mode` - `Load Unpacked Extension...` and locate `/usr/local/lib/node_modules/alfred-tabs-improved/messaging/addon-opera/`, press `Select` button.  
> (Default node global path: `/usr/local/lib/node_modules/`)  
----
> **somewhat messy and basic**  
> installation size is bigger than original one. because of `uws`, it takes about `10 MB` alone.  
> Firefox rises again, after `Quantum` launched. (but I'll stick with `Chrome`)  

## Epilogue
> Asynchronous!??? had fun with node and js. (I don't know it well)  
> Who cares? I hope this helpful to you.  

# <div align="center"><img src="./icon.png" width=256><br>alfred-tabs</div>

> :mag: Find/Activate/Close browser tabs you want easily


## Install

```
$ npm i -g alfred-tabs-improved
```

*Requires [Node.js](https://nodejs.org) 4+ and the Alfred [Powerpack](https://www.alfredapp.com/powerpack/).*


## Usage

In Alfred, type `t`, <kbd>Space</kbd>, and your query.
Then select the tab you want and hit <kbd>Enter</kbd>!
You will be able to see the tab :)

![screenshot1](https://cloud.githubusercontent.com/assets/1744446/21936734/9bb8e4dc-d9f5-11e6-8dc2-5773a82b6228.png)

![screenshot2](https://cloud.githubusercontent.com/assets/1744446/21936735/9bf65812-d9f5-11e6-803b-17e4e6bbbc8b.png)


## License
MIT © [luceat-lux-vestra](https://learnbydoing.ml/)  
MIT © [Jaewe Heo](http://importre.com)

