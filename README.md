Console.Log
==========

A simple script that makes debugging easier on browsers that do not support console and viewing the log on mobile/tablet devices. The script overwrites the console object and the log function. Each calling of console.log gets inserted into an li element.

**Stable Build**: Please go here (http://console.mikewgd.com/)

## How It Works/What is it?

A tool for programmers to see a viewable console in the browser. Meant to be used on mobile devices and/or browsers that do not support the console object. The script uses device detection (user agent sniffing) and if the `console` object is `undefined`; It then overwrites the `console` object and the `log` function.

### Features

*   Does not use any JavaScript libraries.
*   Hide/Show the console logs.
*   Change height of console. (added in v2)
*   Query params (added in v2.1) **NEW!**

### Limitations
*   Complex nested objects
*   Viewing HTML Elements
*   Have an issue? [Log it here!](https://github.com/mikewgd/console-log/issues)

## Implementation

Just add the script on the page before the js file(s) that contain `console.log` and your good to go! No rewriting code!

Look below for an example:

            ...
            
            <!-- Add console log script above the other script. -->
            <script type="text/javascript" src="//console.min.js"></script>

            <!-- Some random js file with console.log -->
            <script type="text/javascript" src="//test.js"></script>

        </body>
    </html>

### **NEW!** Parameters
Visibility and height are the current parameters you can implement.

Simply add '?' to the end of the src attribute on the script tag. View the example below for different implementations of usage.
            
            ...
            
            <!-- Console will be expanded with a height of 400px -->
            <script type="text/javascript" src="//console.min.js?400"></script>
    
            <!-- Console will be collapsed with a default height -->
            <script type="text/javascript" src="//console.min.js?hide"></script>
    
            <!-- Console will be collapsed with a height of 400px -->
            <script type="text/javascript" src="//console.min.js?hide&400"></script>
            
        </body>
    </html>

## Try it out! [View the demo](http://console.mikewgd.com/demo)

Remember you need to view it on a device or change your user agent.

### Future Features

*   Executing code (working on it!)
*   Clear console button (working on it!)
*   Syntax highlighting (working on it!)
*   More function support, not just log
*   Showing line numbers
*   Style like Chrome console (working on it!)