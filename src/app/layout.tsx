"use client"
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

import "@styles/scss/globals.scss";
import 'animate.css';

import 'bootstrap/dist/css/bootstrap.min.css';

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
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta name="description" content="Phần mềm quản lý biên bản kiểm định của DHT Company. Quản lý kiểm định đồng hồ nước hiệu quả." />
                <meta name="keywords" content="DHT, FMS, quản lý biên bản, quản lý pdm, quản lý phê duyệt mẫu, đồng hồ nước" />
                <meta name="author" content="DHT Company" />
                <title>Quản lý Biên bản Kiểm định - DHT Company</title>
                <script src="/js/bootstrap.bundle.min.js"></script>
            </head>
            <body className={`${inter.className}`}>
                {children}
                <footer className={`shadow w-100 d-flex align-items-center text-center justify-content-center`}>
                    Copyright @ 2024 by DHT Company
                </footer>
            </body>
        </html>
    );
}