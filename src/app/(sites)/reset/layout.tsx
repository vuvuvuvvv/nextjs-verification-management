import { Metadata } from 'next'
export const metadata: Metadata = {
    title: "Bảo mật",
}

import layout from '@styles/scss/layouts/reset-layout.module.scss'

export default function ResetLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className={`container-fluid ${layout['wrap-container']}`}>
            <div className={`row m-0 p-0 d-flex justify-content-center`}>
                <div className={`col-12 col-sm-10 col-lg-7 col-xl-6 ${layout.wrapper}`}>
                    <div className={`${layout['box-form']} p-4 p-sm-5 w-100`}>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}