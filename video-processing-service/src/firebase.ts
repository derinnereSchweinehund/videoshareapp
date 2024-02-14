import { credential } from "firebase-admin";
import { initializeApp } from "firebase-admin/app";
import { Firestore } from "firebase-admin/firestore";

initializeApp({credential: credential.applicationDefault()});

const firestore = new Firestore();

const videoCollectionId = "videos";

export interface Video {
    id?: string,
    uid?: string,
    filename?: string,
    status?: "processing" | "processed",
    title?: string,
    description?: string,
}

/**
 * Obtains a video from the bucket based on attributes in firebasestore through using the videoId
 * @param videoId a unique string for a video based off the uid and time posted
 * @returns an object that either contains the video interface or is empty
 */
async function getVideo(videoId: string) {
    const snapshot  = await firestore.collection(videoCollectionId).doc(videoId).get()
    return (snapshot.data() as Video) ?? {};
}

/**
 * Sets the attributes of a Video in the database
 * @param videoId a unique string for a video based off the uid and time posted
 * @param video a defined interface
 * @see Video
 */
export function setVideo(videoId: string, video: Video) {
    return firestore.collection(videoCollectionId).doc(videoId).set(video, {merge: true});
}


/**
 * Checks if a video with the same videoId exists in the firebasestore
 * @param videoId a unique string for a video based off the uid and time posted
 * @returns boolean
 */
export async function isVideoNew(videoId: string) {
    const video = await getVideo(videoId);
    return video?.status === undefined;
}