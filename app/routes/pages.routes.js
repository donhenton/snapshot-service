

module.exports = function (app,imageService) {

    app.get('/', function (req, res) {


        res.render('index', {});

    });

    /**
     * could be used to manipulate the submission
     * @param {type} inputHtml
     * @returns {unresolved}
     */
    function composeHtml(inputHtml)
    {
        return inputHtml;
    }
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

    /*
     * the endpoint to call for the pictures 
     * if there is a variable called 'submit' and it contains
     * the word 'debug' it returns the test page, otherwise
     * it returns the rendered image
     * 
     */
    app.post('/snapShotService', function (req, res) {


        if (req.body.submit && req.body.submit.indexOf('debug') > -1)
        {
            showPageForImage(req, res)
        } else
        {
            imageService.processImage(req, res);
        }



    });

    /**
     * endpoint used interally to render the page that will become the image
     * or will be displayed in test mode
     * 
     * 
     */
    app.post('/showImage', function (req, res) {


        showPageForImage(req, res);



    });


}