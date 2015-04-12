Console.Log
==========

A simple script that makes debugging easier on browsers that do not support console and viewing the log on mobile/tablet devices. The script overwrites the console object and the log function. Each calling of console.log gets inserted into an li element.

**Stable Build:** Please go here (http://console.mikewgd.com/)  
**CDN:** `<script src="http://cdn.jsdelivr.net/console-log/latest/console.min.js"></script>`

## How It Works/What is it?  
A tool for programmers to see a viewable console in the browser. Meant to be used on mobile devices and/or browsers that do not support the console object. The script uses device detection (user agent sniffing) and if the `console` object is `undefined`; It then overwrites the `console` object and the `log` function.

### Features
*	Doesn't use JavaScript libraries
*	Toggle console
*	Adjust console height
*	Query params
*	Recognizable theme **NEW!**
*	Syntax highlighting **NEW!**
*	Clear console **NEW!**
*	New supported functions: `time` & `timeEnd` **NEW!**


### Limitations/Issues
*   Nested objects (window, document)
*   Have an issue? [Log it here!](https://github.com/mikewgd/console-log/issues)

## Implementation
Just add the script on the page before the js file(s) that contain `console.log` and your good to go! No rewriting code!

### Parameters
You may also use parameters to set default settings for the console (visibility and height). Simply add '?' to the end of the src attribute on the script tag.

**EXAMPLE:**

            ...
        
             <!-- Add console log script above the other script. (with default settings) -->
             <script type="text/javascript" src="//console.min.js"></script>
             <script type="text/javascript" src="//console.min.js?400"></script> <!--console expanded, height 400px-->
             <script type="text/javascript" src="//console.min.js?hide&400"></script> <!-- console collapsed, height 400px-->

             <!-- Some random js file with console.log -->
             <script type="text/javascript" src="//test.js"></script>

        </body>
    </html>

## Try it out! [View the demo](http://console.mikewgd.com/demo)
Remember you need to view it on a device or change your user agent.