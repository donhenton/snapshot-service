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
contain css references that make the submission usable. It can use the  base tag to get relative urls to resolve.

## The submission form sample
The form at http://localhost:3000 has two buttons, one to navigate to a
version of the page that will be rendered that exists on this server, 
and one to download the image of that page. The debug is the page that
the image capture will be 'viewing' and can be used for debugging
purposes.

## Example Submission
In the docs section of the app is a sample web page that will contact a 
third party app for image and css resources, then allow for the image
to be downloaded on this app. It illustrates the use of the base tag.

## Chrome view of the debug
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
with the X-XSS-Protection header. In the above code, this is wide open, 
so it should probably be set to something sane in the real world. The
zero values turns the protection off, and is the only viable value for chrome
here. A production version of this app might enforce white-listing of 
requesting servers.

