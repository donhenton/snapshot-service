* Snapshot-service

Simple node application that renders submitted html and returns an image.

** Running locally
* gulp backend
* node server.js

http://localhost:3000 includes the form page

** Requirements
The server will render what is sent, so to handle css, js, images, etc
use the <base> tag, the submitting system is responsible for setting that
tag if it is not set already. 

Overall, the submitting entity is responsible for making this service
aware of all resources needed to render the image. So if a 'special' page
is needed, the submitter composes the needed html. A special page might
contain css references that make the submission usable.

** The submission form sample
The form at http://localhost:3000 has two buttons, one to navigate to the
page that will be rendered, and one to download the image of that page.