import dayjs from "dayjs";
import { DongHo, DuLieuMotLanChay, PDMData, TinhSaiSoValueTabs } from "./types";
import { getAllDongHoNamesExist } from "@/app/api/dongho/route";
import { INDEXED_DB_DH_OBJ_NAME, INDEXED_DB_NAME } from "./system-constant";

export const getSaiSoDongHo = (formValue: DuLieuMotLanChay) => {
    if (formValue) {
        if ((formValue.V2 == 0 && formValue.V1 == 0) || (formValue.V2 - formValue.V1 == 0)) {
            return null;
        };

        const VDHCT = formValue.V2 - formValue.V1;
        const VDHC = parseFloat(formValue.Vc2.toString()) - parseFloat(formValue.Vc1.toString());
        if (VDHC !== 0) {
            const error = ((VDHCT - VDHC) / VDHC) * 100;
            return Number((Math.round(error * 10000) / 10000).toFixed(3));
        }
    }
    return null;
};

export const getFullSoGiayCN = (soGiayCN: string, ngayThucHien: Date) => {
    return "FMS.KĐ." + (soGiayCN || "-----") + "." + dayjs(ngayThucHien).format("YY");
}

export const getQ2OrQtAndQ1OrQMin = (isDHDienTu: boolean, ccx: string | null, q: string | null, r: string | null) => {
    if (isDHDienTu != null && ccx && q) {
        const heso = {
            "A": {
                "qt": (parseFloat(q) < 15) ? 0.1 : 0.3,
                "qmin": (parseFloat(q) < 15) ? 0.04 : 0.08,
            },
            "B": {
                "qt": (parseFloat(q) < 15) ? 0.08 : 0.2,
                "qmin": (parseFloat(q) < 15) ? 0.02 : 0.03,
            },
            "C": {
                "qt": (parseFloat(q) < 15) ? 0.015 : 0.015,
                "qmin": (parseFloat(q) < 15) ? 0.01 : 0.006,
            },
            "D": {
                "qt": (parseFloat(q) < 15) ? 0.0115 : null,
                "qmin": (parseFloat(q) < 15) ? 0.0075 : null,
            }
        }
        if (isDHDienTu && q && r) {
            const qmin = parseFloat(q) / parseFloat(r);
            const qt = 1.6 * qmin;
            return {
                getQ1OrMin: parseFloat(qmin.toFixed(3)),
                getQ2OrQt: parseFloat(qt.toFixed(3))
            };
        } else {
            if (ccx && heso.hasOwnProperty(ccx)) {
                const heso_qt = heso[ccx as keyof typeof heso].qt;
                const heso_qmin = heso[ccx as keyof typeof heso].qmin;
                return {
                    getQ1OrMin: (heso_qmin) ? parseFloat(q) * heso_qmin : null,
                    getQ2OrQt: (heso_qt) ? parseFloat(q) * heso_qt : null,
                };
            }
        }
    }
    return {
        getQ1OrMin: null,
        getQ2OrQt: null,
    };
};

export const getVToiThieu = (q: string | number, d: string | number) => {
    // q: m3/h 
    // d: mm
    if (q && d) {
        let qNum = parseFloat(typeof q === 'string' ? q : q.toString());
        const dNum = parseFloat(typeof d === 'string' ? d : d.toString());

        if (isNaN(qNum) || isNaN(dNum)) {
            return 0;
        }

        const ll_90s = qNum * 90 / 3600 * 1000;
        const ll_200d = 200 * dNum;
        return Number(Math.max(ll_200d, ll_90s).toFixed(3));
    } else {
        return 0;
    }
}

export const getHieuSaiSo = (formValues: TinhSaiSoValueTabs) => {
    try {
        const hasZeroValues = Object.values(formValues).some(({ V1, V2 }) => V1 === 0 && V2 === 0);
        if (hasZeroValues) return null;

        const values = Object.values(formValues)
            .map(getSaiSoDongHo)
            .filter(value => value !== null);

        if (values.length === 0) return null;

        const result = values.reduce((acc, curr, index) => {
            return index === 0 ? curr : acc - curr;
        }, 0);

        return Number(result.toFixed(3));
    } catch (e) {
        // console.log(e)
        return null;
    }
}


// TODO: Check 
export const isDongHoDatTieuChuan = (formHieuSaiSo: { hss: number | null }[]) => {
    const lan1 = formHieuSaiSo[0].hss;
    const lan2 = formHieuSaiSo[1].hss;
    const lan3 = formHieuSaiSo[2].hss;

    if (lan1 !== null && lan2 !== null && lan3 !== null) {
        // return (isQ3) ? (lan1 >= -2 && lan2 >= -2 && lan3 >= -5) : (lan1 <= 2 && lan2 <= 2 && lan3 <= 5)
        return (lan1 >= -2 && lan2 >= -2 && lan3 >= -5 && lan1 <= 2 && lan2 <= 2 && lan3 <= 5)
    }
    return null;
}

export const getLastDayOfMonthInFuture = (isDHDienTu: boolean | null, date?: Date | null): Date | null => {
    if (isDHDienTu != null) {
        const years = isDHDienTu ? 3 : 5;
        const today = date instanceof Date && !isNaN(date.getTime()) ? date : new Date(); // Ensure 'today' is a valid Date object
        const futureDate = new Date(today.getFullYear() + years, today.getMonth() + 1, 0);
        return futureDate;
    }
    return new Date();
}

export const convertToUppercaseNonAccent = (str: string) => {
    // Chuẩn hóa chuỗi ký tự tiếng Việt thành không dấu
    const map = {
        'á': 'a', 'à': 'a', 'ả': 'a', 'ã': 'a', 'ạ': 'a',
        'ă': 'a', 'ắ': 'a', 'ằ': 'a', 'ẳ': 'a', 'ẵ': 'a', 'ặ': 'a',
        'â': 'a', 'ấ': 'a', 'ầ': 'a', 'ẩ': 'a', 'ẫ': 'a', 'ậ': 'a',
        'é': 'e', 'è': 'e', 'ẻ': 'e', 'ẽ': 'e', 'ẹ': 'e',
        'ê': 'e', 'ế': 'e', 'ề': 'e', 'ể': 'e', 'ễ': 'e', 'ệ': 'e',
        'í': 'i', 'ì': 'i', 'ỉ': 'i', 'ĩ': 'i', 'ị': 'i',
        'ó': 'o', 'ò': 'o', 'ỏ': 'o', 'õ': 'o', 'ọ': 'o',
        'ô': 'o', 'ố': 'o', 'ồ': 'o', 'ổ': 'o', 'ỗ': 'o', 'ộ': 'o',
        'ơ': 'o', 'ớ': 'o', 'ờ': 'o', 'ở': 'o', 'ỡ': 'o', 'ợ': 'o',
        'ú': 'u', 'ù': 'u', 'ủ': 'u', 'ũ': 'u', 'ụ': 'u',
        'ư': 'u', 'ứ': 'u', 'ừ': 'u', 'ử': 'u', 'ữ': 'u', 'ự': 'u',
        'ý': 'y', 'ỳ': 'y', 'ỷ': 'y', 'ỹ': 'y', 'ỵ': 'y',
        'đ': 'd',
    };

    // Thay thế các ký tự có dấu bằng ký tự không dấu
    const nonAccentStr = str
        .toLowerCase()
        .split('')
        .map(char => map[char as keyof typeof map] || char)
        .join('');

    // Chuyển thành chữ in hoa và loại bỏ khoảng trắng
    return nonAccentStr.toUpperCase().replace(/\s+/g, '');
}

export const getFullNameFileDownload = (dongho: DongHo) => {
    return (dongho.so_giay_chung_nhan || "") +
        (dongho.ten_khach_hang ? "_" + dongho.ten_khach_hang : "") +
        (dongho.ten_dong_ho ? "_" + dongho.ten_dong_ho : "") +
        (dongho.dn ? "_" + dongho.dn : "") +
        (dongho.ngay_thuc_hien ? "_" + dayjs(dongho.ngay_thuc_hien).format('DD-MM-YYYY') : "")
}

export const getListDongHoNamesExist = async () => {
    const res = await getAllDongHoNamesExist();
    if (res.status == 200 || res.status == 201) {
        const listNames: string[] = [...res.data.map((pdm: PDMData) => pdm["ten_dong_ho"])]
        const uniqueNames = listNames.filter((value, index, self) => self.indexOf(value) === index);
        const sortedNames = uniqueNames.sort((a, b) => a.localeCompare(b));
        return sortedNames;
    }
    return []
}

export function openDB() {
    return new Promise((resolve, reject) => {
        if (typeof window === "undefined") return;

        const request = indexedDB.open(INDEXED_DB_NAME, 1);
        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            if (!db.objectStoreNames.contains(INDEXED_DB_DH_OBJ_NAME)) {
                db.createObjectStore(INDEXED_DB_DH_OBJ_NAME, { keyPath: 'id' });
            }
        };
        request.onsuccess = (event) => {
            const target = event.target as IDBOpenDBRequest;
            resolve(target.result);
        };

        request.onerror = (event) => {
            const target = event.target as IDBOpenDBRequest;
            reject(target.error);
        };
    });
}

export async function saveDongHoDataExistsToIndexedDB(username: string, data: DongHo[], savedData?: DongHo[]) {
    const db = await openDB() as IDBDatabase;
    return new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(INDEXED_DB_DH_OBJ_NAME, "readwrite");
        const store = transaction.objectStore(INDEXED_DB_DH_OBJ_NAME);

        const dataToStore = { id: username, dongHoList: data, saveDongHoList: savedData || [] };

        const request = store.put(dataToStore);

        request.onsuccess = () => {
            resolve();
        };
        request.onerror = (event) => {
            const error = (event.target as IDBRequest).error;
            reject(error);
        };
    });
}

export async function getDongHoDataExistsFromIndexedDB(username: string): Promise<{
    dongHoList: DongHo[],
    savedDongHoList: DongHo[]
} | null> {
    const db = await openDB() as IDBDatabase;
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(INDEXED_DB_DH_OBJ_NAME, "readonly");
        const store = transaction.objectStore(INDEXED_DB_DH_OBJ_NAME);
        const request = store.get(username);

        request.onsuccess = (event: Event) => {
            const target = event.target as IDBRequest;
            if (target.result) {
                resolve({
                    dongHoList: target.result?.dongHoList || [],
                    savedDongHoList: target.result?.savedDongHoList || []
                });
            } else {
                resolve(null);
            }
        };

        request.onerror = (event) => {
            const target = event.target as IDBRequest;
            if (target && target.error) {
                // console.error("Lỗi khi kiểm tra dữ liệu:", target.error);
                reject(target.error);
            }
        };
    });
}

export async function deleteDongHoDataFromIndexedDB(username: string): Promise<void> {
    const db = await openDB() as IDBDatabase;
    return new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(INDEXED_DB_DH_OBJ_NAME, "readwrite");
        const store = transaction.objectStore(INDEXED_DB_DH_OBJ_NAME);

        const request = store.delete(username);

        request.onsuccess = () => {
            // console.log(`Dữ liệu cho ${username} đã được xóa thành công.`);
            resolve();
        };

        request.onerror = (event) => {
            const error = (event.target as IDBRequest).error;
            // console.error("Lỗi khi xóa dữ liệu:", error);
            reject(error);
        };
    });
}