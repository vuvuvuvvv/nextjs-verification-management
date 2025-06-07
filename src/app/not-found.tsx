import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ACCESS_LINKS } from "@/lib/system-constant";
import Link from "next/link";


const NotFound = () => {
    return <div className="container-fluid">
        <div className="row m-0 py-5">
            <div className="col-12 col-md-6 d-flex align-items-center justify-content-center justify-content-md-end m-0 p-0">
                <img className="w-50" style={{ maxWidth: "200px" }} src="/images/logo.png" alt="Kiểm định DHT" />
            </div>
            <div className="col-12 col-md-6 d-flex align-items-center m-0 p-0">
                <div className="w-100 d-flex d-md-block gap-3 align-items-center justify-content-center justify-content-md-start">
                    <h1 className="m-0 text-dark-blue fw-bold">404</h1>
                    <p className="m-0 text-dark-blue">Trang không tồn tại</p>
                </div>
            </div>
            <div className="w-100 mt-5 d-flex justify-content-center">
                <Link href={ACCESS_LINKS.HOME.src} className="btn text-dark-blue m-0 p-0 text-decoration-underline">
                    Quay lại trang chủ
                </Link>
            </div>
        </div>
    </div>
}

export default NotFound;