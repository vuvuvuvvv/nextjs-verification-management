// Import Layout css
import layout from "@styles/scss/layouts/home-layout.module.scss";

// Import UI
import Navbar from "@/ui/navbar";

import { UserProvider } from "@/context/user-context";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
    return (
        <UserProvider>
            <Navbar />
            <main className={layout["wraper"]}>
                <div className={layout['content']}>
                    {children}
                </div>
            </main>
        </UserProvider>
    );
}
