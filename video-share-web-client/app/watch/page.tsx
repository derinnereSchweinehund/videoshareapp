"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

export default function Watch() {
    const videoPrefix = "http://bankvideoshare-processed-videos.storage.googleapis.com/";
    const videoSrc = useSearchParams().get("v");
    return (
        <div>
            <h1>Watch Page</h1>
            {/*<Suspense fallback={<h1>Loading Video</h1>}>*/}
            {<video controls src={videoPrefix + videoSrc}/>}
            {/*</Suspense>*/}
        </div>
    )
}