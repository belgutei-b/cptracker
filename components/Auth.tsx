"use client";
import { Brain } from "lucide-react";
import Image from "next/image";
import { githubSignIn, googleSignIn } from "@/lib/auth-client";
import styles from "./Auth.module.css";

// https://developers.google.com/identity/branding-guidelines

export default function Auth() {
  const handleGoogleSignIn = async () => {
    await googleSignIn();
  };

  const handleGithubSignIn = async () => {
    await githubSignIn();
  };

  return (
    <div className="bg-neutral-900 flex flex-col items-center justify-center p-6 text-center mt-20">
      <div className="mb-8 p-4 bg-neutral-800 rounded-full shadow-[0_0_50px_-12px_rgba(255,161,22,0.5)]">
        <Brain size={64} className="text-amber-500" />
      </div>
      <h1 className="text-5xl font-bold mb-8 tracking-tight text-white">
        CP <span className="text-amber-500">Pulse</span>
      </h1>
      <div className="bg-neutral-800 p-8 rounded-2xl border border-neutral-600 w-full max-w-md shadow-2xl">
        <h2 className="text-lg font-semibold mb-6 text-white">
          Start Tracking Your Progress
        </h2>
        <div className={`${styles.authButtons} flex flex-col gap-3`}>
          <button
            type="button"
            className={styles.gsiMaterialButton}
            onClick={handleGoogleSignIn}
          >
            <div className={styles.gsiMaterialButtonState}></div>
            <div className={styles.gsiMaterialButtonContentWrapper}>
              <div className={styles.gsiMaterialButtonIcon}>
                <svg
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 48 48"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  style={{ display: "block" }}
                  aria-hidden="true"
                >
                  <path
                    fill="#EA4335"
                    d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                  ></path>
                  <path
                    fill="#4285F4"
                    d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                  ></path>
                  <path
                    fill="#FBBC05"
                    d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                  ></path>
                  <path
                    fill="#34A853"
                    d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                  ></path>
                  <path fill="none" d="M0 0h48v48H0z"></path>
                </svg>
              </div>
              <span className={styles.gsiMaterialButtonContents}>
                Continue with Google
              </span>
              <span style={{ display: "none" }}>Continue with Google</span>
            </div>
          </button>
          <button
            type="button"
            className={styles.gsiMaterialButton}
            onClick={handleGithubSignIn}
          >
            <div className={styles.gsiMaterialButtonState}></div>
            <div className={styles.gsiMaterialButtonContentWrapper}>
              <div className={styles.gsiMaterialButtonIcon}>
                <Image
                  src="/github.svg"
                  alt=""
                  width={20}
                  height={20}
                  aria-hidden="true"
                />
              </div>
              <span className={styles.gsiMaterialButtonContents}>
                Continue with GitHub
              </span>
              <span style={{ display: "none" }}>Continue with GitHub</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
