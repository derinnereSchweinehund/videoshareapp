import styles from "./page.module.css";
import { getVideos } from "./utils/functions";
import Link from "next/link";
import Image from "next/image";

export default async function Home() {
  const videos = await getVideos();

  return (
    <main className={styles.main}>
      {
        videos.map((video) => (
          <Link href={`/watch?v=${video.filename}`} key={video.id}>
            <Image src={"/fireinthehole.jpg"} alt="Video" width={120} height={80}
              className={styles.thumbnail}/>
          </Link>
        ))
      }
      {/*<div className={styles.description}>
        <p>
          Get started by editing&nbsp;-->
          <code className={styles.code}>app/page.tsx</code>
        </p>
      </div>*/}
    </main>
  );
}

export const revalidate = 30; //  need to re-render to notice new uploads, can set to 30 for 30 seconds, if 0 though it calls a server side function (the page itself is client) which put load on server