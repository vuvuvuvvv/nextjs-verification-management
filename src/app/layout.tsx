"use client"
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

// Import global css
import "@styles/scss/globals.scss";
import 'animate.css';

// Import Bootstrap v5.3.3
import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap/dist/js/bootstrap.min.js';

//Import Fontawesome for global
import '@lib/fontawesome';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { config } from '@fortawesome/fontawesome-svg-core';
config.autoAddCss = false;


export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    return (
        <html lang="en">
            <head>
                <script src="/js/bootstrap.bundle.min.js"></script>
            </head>
            <body className={`${inter.className}`}>
                {children}
                <footer className={`shadow w-100 d-flex align-items-center text-center justify-content-center`}>
                    Copyright @ 2024 by DHT Company
                </footer>
            </body>
        </html >
    );
}
