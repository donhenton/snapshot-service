var phantom = require('phantom');
var atob = require('atob');

module.exports = function (app) {

    app.get('/', function (req, res) {


        res.render('index', {});

    });

/**
 * process the image and perform the screenshot.
 * 
 * @param {type} req
 * @param {type} res
 * @returns {undefined}
 */
    function processImage(req, res)
    {

        config = {
            addWidth: 0,
            addHeight: 0,
            contentType: 'image/png',
            imageType: 'png',
            renderUrl: 'http://localhost:3000/showImage/',
            viewportSize: {
                width: 1200,
                height: 500
            },
            clipRect: null,
            html: 'NO HTML PROVIDED'
        };
        if (req.body.html)
        {
            config.html = req.body.html;
        }

        try
        {
            var self = this;
            phantom.create().then(instance => {
                config['phInstance'] = instance;
                return instance.createPage();

            }).then(page => {

                page.property('viewportSize', config.viewportSize);
                page.clipRect = config.clipRect;
                config['page'] = page;
                return page.open(config.renderUrl, 'post', "html=" + config.html);

            }).then(status => {

                return config.page.renderBase64(config.imageType);
                ;
            }).then(imageData => {
                console.log("image success ")
                res.set({
                    'Cache': 'no-cache',
                    'Content-Type': config.contentType
                });
                res.writeHead(200);
                res.end(atob(imageData), 'binary');
                config.page.close();
                config.phInstance.exit();
            }).catch(error => {
                console.log('error in phantom ' + error)
                res.writeHead(500)
                res.end("Error in Phantom chain: " + error);
                config.phInstance.exit();
            });

        } catch (err)
        {
            console.log("error " + err)
            res.writeHead(500)
            res.end("Error in general chain: " + err);
            if (config.phInstance)
            {
                config.phInstance.exit();
            }

        }




    }

    function composeHtml(inputHtml)
    {
        var head = "<head><style> #message { color:red  }</style></head>";
        //var html = "the man says <span id=\"message\">\"get a job!!!!!\"</span>";
        //html =  html.replace(/"/g, "\\\"");
        var html = "<html>" + head + "<body>" + inputHtml + "</body></html>";

        return html;
    }
    function showPageForImage(req, res)
    {

        //console.log(JSON.stringify(req.body.html))

        //you want to see the test page
        res.setHeader("Content-Type", "text/html");
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
            processImage(req, res);
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