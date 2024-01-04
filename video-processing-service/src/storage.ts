import { Storage } from "@google-cloud/storage";
import fs from "fs";
import ffmpeg from "fluent-ffmpeg";

const storage = new Storage();

const rawVideoBucketName = "bankvideoshare-raw-videos";
const processedVideoBucketName = "bankvideoshare-processed-videos";

const localRawVideoPath = "./raw-videos";
const localProcessedVideoPath = "./processed-videos";
/**
 * create local dir for raw + processed videos
 */
export function setupDirectories() {
    ensureDirectoryExists(localRawVideoPath);
    ensureDirectoryExists(localProcessedVideoPath);
}

/**
 * @param rawVideoName - the name of video file to convert from {@link localRawVideoPath}
 * @param processedVideoName - the name for the processed video file to add to {@link localProcessedVideoPath}
 * @returns a promise that resolved when the video has been converted
 */
export function convertVideo(rawVideoName: string, processedVideoName: string) {
    return new Promise<void>((resolve, reject) => {
        ffmpeg(`${localRawVideoPath}/${rawVideoName}`)
        .outputOptions("-vf", "scale=-1:360") //360p video quality
        .on("end", () => {
            console.log("Processing completed without error");
            resolve();
            //res.status(200).send("Processing completed without error.");
        })
        .on("error", (err) => {
            console.log(`An error occurred: ${err.message}`);
            reject(err);
            //res.status(500).send(`Internal Server Error: ${err.message}`);
        })
        .save(`${localProcessedVideoPath}/${processedVideoName}`);
    });
}
/**
 * @param fileName - name of file to download from the
 * {@link rawVideoBucketName} bucket into the {@link localRawVideoPath} folder.
 * @returns a promise that resolves when the video is downloaded
 */
export async function downloadRawVideo(fileName: string) {
    await storage.bucket(rawVideoBucketName)
    .file(fileName)
    .download({destination: `${localRawVideoPath}/${fileName}`});

    console.log(`gs://${rawVideoBucketName}/${fileName} downloaded to ${localRawVideoPath}/${fileName}.`);
}


/**
 * @param fileName - name of file to upload from the
 * {@link localVideoBucketName} bucket into the {@link processedVideoBucketName} folder.
 * @returns a promise that resolves when the video is uploaded
 */
export async function uploadProcessedVideo(fileName: string) {
    const bucket = storage.bucket(processedVideoBucketName);
    await bucket.upload(`${localRawVideoPath}/${fileName}`, {
        destination : fileName
    });

    console.log(`gs://${localProcessedVideoPath}/${fileName} uploaded to ${processedVideoBucketName}/${fileName}.`);

    await bucket.file(fileName).makePublic();
}

/**
 * @param filePath - the path of file to delete from the server
 * @returns a promise that resolved upon deletion of the file
 */
function deleteFile(filePath: string) {
    return new Promise<void>((resolve, reject) => {
        if (fs.existsSync(filePath)) {
            fs.unlink(filePath, err => {
                if (err) {
                    console.log(`Failed to delete the file at ${filePath}`, err);
                    reject();
                } else {
                    console.log(`Successfully deleted the file at ${filePath}`);
                    resolve();
                }
            })
        } else {
            console.log(`File was not found at ${filePath}, the delete will not be carried out.`);
            resolve();
        }
    })
}

/**
 * @param fileName - name of file to delete from 
 * {@link localRawVideoPath} local raw videos (server side)
 * @returns promise that resolves upon deletion of file
 */
export function deleteRawVideo(fileName: string) {
    return deleteFile(`${localRawVideoPath}/${fileName}`);
}

/**
 * @param fileName - name of file to delete from
 * {@link localProcessedVideoPath} local processed videos (server side)
 * @returns promise that resolves upon deletion of file
 */
export function deleteProcessedVideo(fileName: string) {
    return deleteFile(`${localProcessedVideoPath}/${fileName}`);
}

/**
 * ascertain that a directory exists
 * @param {string} dirPath the path of the directory to check
 * 
 */
function ensureDirectoryExists(dirPath: string) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, {recursive: true});
        console.log(`Directory initialised at ${dirPath}`);
    }
}