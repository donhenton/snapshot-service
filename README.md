# Snapshot-service

Simple node application that renders submitted html and returns an image.

## Running locally
* gulp backend
* node server.js

http://localhost:3000 includes the form page

## Requirements
The server will render what is sent, so to handle css, js, images, etc
use the &lt;base&gt; tag, the submitting system is responsible for setting that
tag if it is not set already. 

Overall, the submitting entity is responsible for making this service
aware of all resources needed to render the image. So if a 'special' page
is needed, the submitter composes the needed html. A special page might
contain css references that make the submission usable. It can use the the
base tag to get relative urls to resolve.

## The submission form sample
The form at http://localhost:3000 has two buttons, one to navigate to the
page that will be rendered, and one to download the image of that page.

##Chrome view of the debug
Chrome browser will strip any absolute hrefs in a base tag, which is 
addressed in pages.routes here:
```
function showPageForImage(req, res)
    {

        //you want to see the test page
        res.setHeader("Content-Type", "text/html");
        //needed for the test display in chrome only       
        res.setHeader("X-XSS-Protection", "0");
        res.writeHead(200);
        var html = composeHtml(req.body.html);
        res.end(html);
    }
```
with the X-XSS-Protection header. In the above code, this is wide open, so it should probably be set to something sane in the real world.
