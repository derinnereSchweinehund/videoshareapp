import express from "express";
import ffmpeg from "fluent-ffmpeg";
import { convertVideo, deleteProcessedVideo, deleteRawVideo, downloadRawVideo, setupDirectories, uploadProcessedVideo } from "./storage";

setupDirectories();

const app = express();
app.use(express.json());

app.post("/process-video", async (req, res) => {
    //get bucket and filename from cloud pub/sub message
    let data;
    try {
        const message = Buffer.from(req.body.message.data, 'base64').toString('utf8');
        data = JSON.parse(message)
        if (!data.name) {
            throw new Error('Invalid message payload received.');
        }
    } catch (error) {
        console.error(error);
        return res.status(400).send("Bad request: missing filename.");
    }
    const inputFileName = data.name;
    const outputFileName = `processed-${inputFileName}`;

    //download raw vid from cloud storage
    await downloadRawVideo(inputFileName);
    try {
        await convertVideo(inputFileName, outputFileName);
    } catch (err) {
        Promise.all([
        deleteRawVideo(inputFileName), 
        deleteProcessedVideo(outputFileName)
    ]);
    console.error(err);
    return res.status(500).send("Error has occurred on the internal server: Video processing failed.");
    }
    //upload procesed vid to cloud storage
    await uploadProcessedVideo(outputFileName);

    Promise.all([
        deleteRawVideo(inputFileName), 
        deleteProcessedVideo(outputFileName)
    ]); //repeated code, maybe structure this file better?

    return res.status(200).send("Processing finished successfully");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Video processing service listening at http://localhost:${port}`);
})