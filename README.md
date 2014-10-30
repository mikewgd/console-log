Console Log
==========

A simple script that makes debugging easier on browsers that do not support console and viewing the log on mobile/tablet devices. The script overwrites the console object and the log function. Each calling of console.log gets inserted into an li element.

### Implementation

1. Include the JS file on the page before any js files that have console.log in them
2. That's it!

## Parameters
Visibility and height are the current paramaters you can implement. Simply add '?' to the end of the src attribute on the script tag. Add <HeightInPixel>&<Hide/Show> (Show is default).

Ex: /js/console.min.js?400 // Custom height of 400px, console is expanded
Ex: /js/console.min.js?hide // Default height, console is collapsed
Ex: /js/console.min.js?hide&400 // Custom height of 400px, console is collapsed.

Since the script overwrites the log function for console, rewriting of any code is not necessary! 

Go see the [demo page](http://console.mikewgd.com/demo.html) and/or the [site](http://console.mikewgd.com)

### To Do's
1. Other functions of belonging to console object.
2. Real-time debugging using sockets
