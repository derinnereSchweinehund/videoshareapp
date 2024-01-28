'use client';

//could put the interactive code into sign-in.tsx so that image and other aspects of navbar can be rendered server side

import Image from "next/image";
import Link from "next/link";
import styles from "./navbar.module.css";
import SignIn from "./sign-in"
import { onAuthStateChangedHelper } from "../utils/firebase";
import { useEffect, useState } from "react";
import { User } from "firebase/auth"

export default function Navbar() {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
         const unsubscribe = onAuthStateChangedHelper((user) => {
            setUser(user);
        })
        //cleans up subscription on umount
        return () => unsubscribe();
    });
    return (
        <nav className={styles.nav}>
            <Link href="/">
                <Image width={500} height={100}
                    src="/logo.svg" alt="Website logo" />
            </Link>
            <SignIn user={user} />
        </nav>
    )
}