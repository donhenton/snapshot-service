var phantom = require('phantom');
var atob = require('atob');

module.exports = function (config) {


    var imageService =
            {
                /**
                 * process the image and perform the screenshot.
                 * 
                 * @param {type} req
                 * @param {type} res
                 * @returns {undefined}
                 */
                processImage: function (req, res)
                {

                    config = {
                        addWidth: 0,
                        addHeight: 0,
                        contentType: 'image/png',
                        fileName: 'screenshot.png',
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
                            // https://uggedal.com/journal/phantomjs-default-background-color/
                            config.page.evaluate(function () {
                                var style = document.createElement('style'),
                                        text = document.createTextNode('body { background: #fff }');
                                style.setAttribute('type', 'text/css');
                                style.appendChild(text);
                                document.head.insertBefore(style, document.head.firstChild);

                            });
                            return config.page.renderBase64(config.imageType);

                        }).then(imageData => {
                            console.log("image success ")
                            res.set({
                                'Cache': 'no-cache',
                                'Content-Type': config.contentType,
                                'Content-disposition': "attachment;filename=" + config.fileName
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

            }

   return imageService;

}