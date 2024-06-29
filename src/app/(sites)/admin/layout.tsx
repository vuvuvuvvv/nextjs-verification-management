import x from '@styles/scss/layouts/auth-layout.module.scss'
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className='container'>
            <div className={`row m-0 p-0 justify-content-center`}>
                <div className={`col-12 col-sm-10 col-xl-8 col-xl-6 d-flex align-items-center justify-content-center ${x.wrapper}`}>
                    <div className={`${x['box-form']} w-100 shadow`}>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}