Console.Log
==========

A simple script that makes debugging easier on browsers that do not support console and viewing the log on mobile/tablet devices. The script overwrites the console object and the log function. Each calling of console.log gets inserted into an li element.

**Stable Build:** Please go here (http://console.mikewgd.com/)  
**CDN:** `<script src="http://cdn.jsdelivr.net/gh/mikewgd/console-log@push-to-cdn-v4.0/dist/js/console.min.js"></script>`

## What is this?  
A tool for programmers to see a viewable console in the browser. Meant to be used on mobile devices and/or browsers that do not support the console object. The script uses device detection (user agent sniffing) and if the console object is undefined; It then overwrites the console object. This is a bare bones console, not a replacement for the browsers console. Certain limitations and functionality that the browser's console has will not be implemented in order to keep the script file size down.



### Features
* No JavaScript libraries
* Toggle console
* Adjust console height / Clear console
* Query params (height/toggle/override)
* Recognizable theme / Syntax highlighting
* Show timestamp toggle
* Supported functions: `log`, `time`, `timeEnd`, `assert`,
`clear`, `count`, `warn`, `error` (does not include trace functionality)


### Limitations/Issues
* Nested objects (window, document)
* Autocomplete commands
* String substitution and formatting, Format specifiers
* Styling console output
* Formatting DOM elements as JavaScript objects
* Filtering, Settings, Command Line API
* Monitoring events
*   Have an issue? [Log it here!](https://github.com/mikewgd/console-log/issues)

## Implementation
Just add the script on the page before the js file(s) that contain `console` and you're good to go! No rewriting code!

### Parameters
You may also use parameters to set default settings for the console (visibility and height). Simply add '?' to the end of the src attribute on the script tag. You can also use the override setting, which overrides the device detection and if the console is undefined or not.

#### Visibility
By default it will be expanded/visible. You can hide the console by clicking on the top bar that says "Click to hide". You can override this default setting by adding a query parameter to the script tag: `console.min.js?hide`.

#### Height Adjustment
By default the console height (height of the log entries specifically) will be 1/3 of the window height. You can also adjust the height of the console by typing into the input field next to "CLEAR". As well as with visibility, you can also set the height of the console through query parameter: `console.min.js?200`

_NOTE: Height must be >= 90 and >= to the window height - 150 (magic number). Applies to using the input and query parameter. If the value does not meet the requirement it will be set to the default._

#### Override
Currently the custom console will only appear if console is not supported. However you can change that with a query parameter to ensure that it always appears: `console.min.js?override`

**Full Example:**

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