import axios from "axios";
import { BASE_API_URL } from '@lib/system-constant';

const API_EXPORT_URL = `${BASE_API_URL}/export`;

interface DownloadResponse {
    msg: string;
    data?: any;
}

export async function downloadBB(id: string): Promise<DownloadResponse> {
    try {
        const response = await axios.get(`${API_EXPORT_URL}/kiemdinh/bienban/${id}`, {
            responseType: "blob", // Để xử lý tải xuống file
        });

        if (response.status === 200) {
            const blob = new Blob([response.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.click();
            window.URL.revokeObjectURL(url);

            return { msg: "Tải xuống thành công!" };
        } else {
            throw new Error("Unexpected response");
        }
    } catch (error: any) {
        console.log("Error: ", error);
        if (axios.isAxiosError(error)) {
            if (error.response?.status === 404) {
                return { msg: "Id không hợp lệ!" };
            }
            if (error.response?.status === 500) {
                return { msg: `Đã có lỗi xảy ra! Hãy thử lại sau."}` };
            }
        }
        return { msg: "Mạng hoặc API không khả dụng! Hãy thử lại sau." };
    }
}

export async function downloadGCN(id: string): Promise<DownloadResponse> {
    try {
        const response = await axios.get(`${API_EXPORT_URL}/kiemdinh/gcn/${id}`, {
            responseType: "blob", // Để xử lý tải xuống file
        });

        if (response.status === 200) {
            const blob = new Blob([response.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.click();
            window.URL.revokeObjectURL(url);

            return { msg: "Tải xuống thành công!" };
        } else {
            throw new Error("Unexpected response");
        }
    } catch (error: any) {
        console.log("Error: ", error);
        if (axios.isAxiosError(error)) {
            if (error.response?.status === 404) {
                return { msg: "Id không hợp lệ!" };
            }
            if (error.response?.status === 500) {
                return { msg: `Đã có lỗi xảy ra! Hãy thử lại sau."}` };
            }
        }
        return { msg: "Mạng hoặc API không khả dụng! Hãy thử lại sau." };
    }
}
