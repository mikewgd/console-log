Console Log
==========

A simple script that makes debugging easier on browsers that do not support console and viewing the log on mobile/tablet devices. The script overwrites the console object and the log function. Each calling of console.log gets inserted into an li element.

### Implementation

1. Include the JS file on the page before any js files that have console.log in them
2. That's it!

Since the script overwrites the log function for console, rewriting of any code is not necessary! 

Go see the [demo page](http://console.mikewgd.com/demo.html)

### Limitations
If you console.log window/this or any type of complex object it will fail. It has to do with too much recursion. Another feature which has not been added are string substitutions. 
They may be added in a future release.
