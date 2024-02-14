"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function View() {
    const videoPrefix = "https://bankvideoshare-processed-videos.storage.googleapis.com/";
    const videoSrc = useSearchParams().get("v");
    return <video controls src={videoPrefix + videoSrc}/>
}
export default function Watch() {

    return (
        <div>
            <h1>Watch Page</h1>
            {/*<Suspense fallback={<h1>Loading Video</h1>}>*/}
            <Suspense>
                <View />
            </Suspense>
            {/*</Suspense>*/}
        </div>
    )
}