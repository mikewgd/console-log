Console Log
==========

A simple script that makes debugging easier on browsers that do not support console and viewing the log on mobile/tablet devices. The script overwrites the console object and the log function. Each calling of console.log gets inserted into an li element.

### Implementation

1. Include the JS file on the page before any js files that have console.log in them
2. That's it!

## Parameters
Currently, height is the only available parameter. Simple append ?<HeightInPixels> to the src attribute in the script tag for Console Log.

Ex: /js/console.min.js?400

Since the script overwrites the log function for console, rewriting of any code is not necessary! 

Go see the [demo page](http://console.mikewgd.com/demo.html) and/or the [site](http://console.mikewgd.com)

### To Do's
1. Other functions of belonging to console object.
2. Real-time debugging using sockets
