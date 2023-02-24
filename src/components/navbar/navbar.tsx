import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import styles from "./navbar.module.css"


export const Navbar = () => {

  const [routeStatus, setRouteStatus] = useState<any>(undefined);

  //Navbar Icon Change
  const router = useRouter()
  const { status } = router.query

  const imageSize = 40;

  return (
    <nav className={styles.container}>
      <div className={styles.firstDiv}>
        <Link onClick={() => setRouteStatus(undefined)} className={routeStatus === undefined ? styles.linkActive : styles.link} href="/">
          <Image width={imageSize + 10} height={imageSize + 10} src="/logo.png" alt="Logo" className={styles.imagesNavigation} />
        </Link>
        <Link onClick={() => setRouteStatus("pending")} className={routeStatus === "pending" ? styles.linkActive : styles.link} href="/?status=pending">
          <Image width={imageSize} height={imageSize} src="/notePending.png" alt="Pending List" className={styles.imagesNavigation} />
        </Link>
        <Link onClick={() => setRouteStatus("complete")} className={routeStatus === "complete" ? styles.linkActive : styles.link} href="/?status=completed">
          <Image width={imageSize} height={imageSize} src="/checklist.png" alt="Completed List" className={styles.imagesNavigation} />
        </Link>
        <Link onClick={() => setRouteStatus("favorite")} className={routeStatus === "favorite" ? styles.linkActive : styles.link} href="/?status=favorite">
          <Image width={imageSize + 5} height={imageSize + 5} src="/noteFavorite.png" alt="Favorite List" className={styles.imagesNavigation} />
        </Link>
      </div>
      <div className={styles.secondDiv}>
        <Link href="/createnote">
          <img src="addNoteIcon.png" alt="Add Note Icon" className={styles.addIcon} />
        </Link>
      </div>
    </nav>
  );

};
