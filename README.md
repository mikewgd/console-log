Console Log
==========

A simple script that makes debugging easier on browsers that do not support the console and viewing the console on mobile/tablet devices. The script overwrites the console object and the log function. Each calling of console.log gets inserted into an li element.

### How It Works
The script uses device detection (user agent sniffing) and if the console object is undefined. It then overwrites the console object and the log function to show a viewable console in the browser.

### Implementation
1. Include the JS file on the page before any js files that have console.log in them
2. That's it!

### To Do's
- Other functions of belonging to console object.
- Executing code 
- Set default height by query param (work in progress)
- Hide/show by default query param

### Features
- Does not use any libraries, raw js!
- Hide/Show the logs
- **new** Change the height of the console


Go see the [demo page](http://console.mikewgd.com/demo.html) and/or the [site](http://console.mikewgd.com)

