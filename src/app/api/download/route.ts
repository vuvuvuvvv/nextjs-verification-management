import axios from "axios";
import { BASE_API_URL } from '@lib/system-constant';
import { getFullNameFileDownload } from "@lib/system-function";
import { DongHo } from "@lib/types";

const API_EXPORT_URL = `${BASE_API_URL}/export`;

interface DownloadResponse {
    msg: string;
    data?: any;
    status?:number
}

export async function downloadBB(dongHo: DongHo): Promise<DownloadResponse> {
    try {
        const response = await axios.get(`${API_EXPORT_URL}/kiemdinh/bienban/${dongHo.id}`, {
            responseType: "blob", // Để xử lý tải xuống file
        });

        if (response.status === 200) {
            const blob = new Blob([response.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.download = "KĐ_BB_" + getFullNameFileDownload(dongHo) + ".xlsx";
            link.href = url;
            link.click();
            window.URL.revokeObjectURL(url);

            return { msg: "Tải xuống thành công!", status: 200 };
        } else {
            throw new Error("Unexpected response");
        }
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            if (error.response?.status === 404) {
                return { msg: "Id không hợp lệ!", status: 404 };
            }
            if (error.response?.status === 500) {
                return { msg: `Đã có lỗi xảy ra! Hãy thử lại sau.`, status: 500 };
            }
            if (error.response?.status === 400) {
                return { msg: `Có lỗi xảy ra khi trích xuất dữ liệu! Hãy thử lại.`, status: 400 };
            }
            if (error.response?.status === 422) {
                return { msg: `Đồng hồ không đạt tiêu chuẩn xuất biên bản!`, status: 422 };
            }
        }
        return { msg: "Mạng hoặc API không khả dụng! Hãy thử lại sau." };
    }
}

export async function downloadGCN(dongHo: DongHo): Promise<DownloadResponse> {
    try {
        const response = await axios.get(`${API_EXPORT_URL}/kiemdinh/gcn/${dongHo.id}`, {
            responseType: "blob", // Để xử lý tải xuống file
        });

        if (response.status === 200) {
            const blob = new Blob([response.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.download = "KĐ_GCN_" + getFullNameFileDownload(dongHo) + ".xlsx";
            link.href = url;
            link.click();
            window.URL.revokeObjectURL(url);

            return { msg: "Tải xuống thành công!" };
        } else {
            throw new Error("Unexpected response");
        }
    } catch (error: any) {
        // console.log("Error: ", error);
        if (axios.isAxiosError(error)) {
            if (error.response?.status === 404) {
                return { msg: "Id không hợp lệ!" };
            }
            if (error.response?.status === 500) {
                return { msg: `Đã có lỗi xảy ra! Hãy thử lại sau."}` };
            }
            if (error.response?.status === 400) {
                return { msg: `Có lỗi xảy ra khi trích xuất dữ liệu! Hãy thử lại.` };
            }
            if (error.response?.status === 422) {
                return { msg: `Đồng hồ không đạt tiêu chuẩn xuất biên bản!` };
            }
        }
        return { msg: "Mạng hoặc API không khả dụng! Hãy thử lại sau." };
    }
}
