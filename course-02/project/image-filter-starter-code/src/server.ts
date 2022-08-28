
import express from 'express';
import bodyParser from 'body-parser';
import { filterImageFromURL, deleteLocalFiles } from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */
  function getStringValue (value: any): string{
    return value.toString()
  }
  //! END @TODO1
  app.get("/filteredimage", async (req: express.Request, res: express.Response) => {
    try {
      let {image_url}= req.query;
      image_url = getStringValue(image_url)
      if (!image_url) {
        return res.status(404).json({ message: "image url is required" });
      }
      let imagePath = await filterImageFromURL(image_url);

      console.log(imagePath);

      return res.status(200).sendFile(imagePath, () => {
        deleteLocalFiles([imagePath]);
      });
    } catch (error) {
      return res.status(422).send("ERROR: Image could not be downloaded, Try Again");
    }
  });
  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (req:express.Request,  res: express.Response) => {
    res.send("try GET /filteredimage?image_url={{}}")
  });


  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  }); 
})().catch(error =>{
  express.response.status(500).send(`server is down, please try again : ${error}`)
});
