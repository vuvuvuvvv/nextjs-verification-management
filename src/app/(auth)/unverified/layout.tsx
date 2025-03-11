import { AppProvider } from "@/context/AppContext";

export default function UnverifiedLayout({ children }: { children: React.ReactNode }) {

    return (
        <AppProvider>
            {children}
        </AppProvider>
    );
}