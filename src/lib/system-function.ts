import dayjs from "dayjs";
import { DongHo, DuLieuCacLanChay, DuLieuMotLanChay, PDMData, TinhSaiSoValueTabs } from "./types";
import { getAllDongHoNamesExist } from "@lib/api/dongho";
import { INDEXED_DB_NAME, PERMISSION_TITLES, PERMISSION_VALUES, PERMISSIONS, TITLE_LUU_LUONG } from "./system-constant";

export const getSaiSoDongHo = (formValue: DuLieuMotLanChay) => {
    if (formValue) {
        if ((formValue.V2 == 0 && formValue.V1 == 0) || (formValue.V2 - formValue.V1 <= 0)) {
            return null;
        };

        const VDHCT = formValue.V2 - formValue.V1;
        // const VDHC = parseFloat(formValue.Vc2.toString()) - parseFloat(formValue.Vc1.toString());
        const VDHC = parseFloat(formValue.Vc.toString());
        if (VDHC !== 0) {
            const error = ((VDHCT - VDHC) / VDHC) * 100;
            return Number((Math.round(error * 10000) / 10000).toFixed(4));
        }
    }
    return null;
};

export const getFullSoGiayCN = (soGiayCN: string, ngayThucHien: Date, isHieuChuan: boolean = false) => {
    return "FMS." + (isHieuChuan ? "HC." : "KĐ.") + (soGiayCN || "-----") + "." + dayjs(ngayThucHien).format("YY");
}

export const getQ2OrtAndQ1OrQMin = (isDHDienTu: boolean, ccx: string | null, q: string | null, r: string | null) => {
    if (ccx && q) {
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
                getQ1OrMin: {
                    title:  isDHDienTu ? TITLE_LUU_LUONG.q1 : TITLE_LUU_LUONG.qmin,
                    value: parseFloat(qmin.toFixed(3))
                },
                getQ2Ort: {
                    title: isDHDienTu ? TITLE_LUU_LUONG.q2 : TITLE_LUU_LUONG.qt,
                    value: parseFloat(qt.toFixed(3))
                },
            };
        } else {
            if (ccx && heso.hasOwnProperty(ccx)) {
                const heso_qt = heso[ccx as keyof typeof heso].qt;
                const heso_qmin = heso[ccx as keyof typeof heso].qmin;

                return {
                    getQ1OrMin: {
                        title: isDHDienTu ? TITLE_LUU_LUONG.q1 : TITLE_LUU_LUONG.qmin,
                        value: (heso_qmin) ? parseFloat(q) * heso_qmin : null
                    },
                    getQ2Ort: {
                        title: isDHDienTu ? TITLE_LUU_LUONG.q2 : TITLE_LUU_LUONG.qt,
                        value: (heso_qt) ? parseFloat(q) * heso_qt : null
                    },
                };
            }
        }
    }
    return {
        getQ1OrMin: {
            title: "",
            value: 0
        },
        getQ2Ort: {
            title: "",
            value: 0
        },
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

export const getHieuSaiSo = (formValues: DuLieuCacLanChay) => {
    try {
        const hasErrorFormValues = Object.values(formValues).some(({ V1, V2 }) => (Number(V1) === 0 && Number(V2) === 0) || Number(V2) - Number(V1) <= 0);
        if (hasErrorFormValues) return null;
        const values = Object.values(formValues)
            .map(getSaiSoDongHo)
            .filter(value => value !== null);

        if (values.length === 0) return null;

        const result = values.reduce((acc, curr, index) => {
            return index === 0 ? curr : curr - acc;
        }, 0);

        return Number(result.toFixed(3));
    } catch (e) {
        return null;
    }
}

export const isDongHoDatTieuChuan = (formHieuSaiSo: { hss: number | null }[]) => {
    const Q3n = formHieuSaiSo[0].hss;
    const Q2t = formHieuSaiSo[1].hss;
    const Q1min = formHieuSaiSo[2].hss;

    if (Q3n !== null && Q2t !== null && Q1min !== null) {
        // return (isQ3) ? (Q3n >= -2 && Q2t >= -2 && Q1min >= -5) : (Q3n <= 2 && Q2t <= 2 && Q1min <= 5)
        return (Q3n >= -2 && Q3n <= 2 && Q2t >= -2 && Q2t <= 2 && Q1min >= -5  && Q1min <= 5)
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
        // (dongho.ten_khach_hang ? "_" + dongho.ten_khach_hang : "") +
        // (dongho.ten_dong_ho ? "_" + dongho.ten_dong_ho : "") +
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

// function _openDB(dbName: string) {
//     return new Promise<IDBDatabase>((resolve, reject) => {
//         if (typeof window === "undefined") return;

//         const request = indexedDB.open(INDEXED_DB_NAME);

//         request.onupgradeneeded = (event) => {
//             const db = (event.target as IDBOpenDBRequest).result;

//             // Tạo bảng nếu chưa có
//             if (!db.objectStoreNames.contains(dbName)) {
//                 db.createObjectStore(dbName, { keyPath: 'id' });
//             }
//         };

//         request.onsuccess = (event) => {
//             resolve((event.target as IDBOpenDBRequest).result);
//         };

//         request.onerror = (event) => {
//             reject((event.target as IDBOpenDBRequest).error);
//         };
//     });
// }

async function _ensureObjectStoreExists(dbName: string) {
    return new Promise<IDBDatabase>((resolve, reject) => {
        if (typeof window === "undefined") return;

        // Mở DB để lấy version hiện tại
        const checkRequest = indexedDB.open(INDEXED_DB_NAME);

        checkRequest.onsuccess = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;

            // Nếu bảng đã tồn tại, không cần tăng version
            if (db.objectStoreNames.contains(dbName)) {
                resolve(db);
                return;
            }

            // Nếu bảng chưa tồn tại, tăng version để tạo bảng mới
            const newVersion = db.version + 1;
            db.close();

            const upgradeRequest = indexedDB.open(INDEXED_DB_NAME, newVersion);

            upgradeRequest.onupgradeneeded = (event) => {
                const upgradedDB = (event.target as IDBOpenDBRequest).result;
                upgradedDB.createObjectStore(dbName, { keyPath: 'id' });
            };

            upgradeRequest.onsuccess = (event) => {
                resolve((event.target as IDBOpenDBRequest).result);
            };

            upgradeRequest.onerror = (event) => {
                reject((event.target as IDBOpenDBRequest).error);
            };
        };

        checkRequest.onerror = (event) => {
            reject((event.target as IDBOpenDBRequest).error);
        };
    });
}

export async function saveDongHoDataExistsToIndexedDB(
    dbName: string,
    username: string,
    data: DongHo[],
    savedData?: DongHo[]
) {
    const db = await _ensureObjectStoreExists(dbName); // Kiểm tra và tạo bảng nếu cần

    return new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(dbName, "readwrite");
        const store = transaction.objectStore(dbName);

        const dataToStore = {
            id: username,
            dongHoList: data,
            savedDongHoList: savedData?.length ? savedData : [],
        };

        const request = store.put(dataToStore);

        request.onsuccess = () => resolve();
        request.onerror = (event) => reject((event.target as IDBRequest).error);
    });
}

export async function getDongHoDataExistsFromIndexedDB(dbName: string, username: string): Promise<{
    dongHoList: DongHo[],
    savedDongHoList: DongHo[]
} | null> {
    const db = await _ensureObjectStoreExists(dbName); // Kiểm tra và tạo bảng nếu cần

    return new Promise((resolve, reject) => {
        if (!db.objectStoreNames.contains(dbName)) {
            resolve(null); // Nếu bảng chưa tồn tại, trả về null
            return;
        }

        const transaction = db.transaction(dbName, "readonly");
        const store = transaction.objectStore(dbName);
        const request = store.get(username);

        request.onsuccess = (event) => {
            const target = event.target as IDBRequest;
            resolve(target.result ? {
                dongHoList: target.result?.dongHoList || [],
                savedDongHoList: target.result?.savedDongHoList || []
            } : null);
        };

        request.onerror = (event) => reject((event.target as IDBRequest).error);
    });
}

export async function deleteDongHoDataFromIndexedDB(dbName: string, username: string): Promise<void> {
    const db = await _ensureObjectStoreExists(dbName); // Kiểm tra và tạo bảng nếu cần

    return new Promise<void>((resolve, reject) => {
        if (!db.objectStoreNames.contains(dbName)) {
            resolve(); // Nếu bảng chưa tồn tại, coi như không có dữ liệu để xóa
            return;
        }

        const transaction = db.transaction(dbName, "readwrite");
        const store = transaction.objectStore(dbName);
        const request = store.delete(username);

        request.onsuccess = () => resolve();
        request.onerror = (event) => reject((event.target as IDBRequest).error);
    });
}


export function getNameOfRole(role: string | undefined) {
    return role ? (PERMISSION_TITLES[role] || role) : "Chưa rõ";
}

export function getAvailableRolesOptions(current_role: string | null): { value: string, label: string }[] {
    if (current_role) {
        const current_per_val = PERMISSION_VALUES[current_role];
        if (current_per_val) {
            return Object.values(PERMISSIONS).filter(r => {
                const per_val = PERMISSION_VALUES[r];
                return current_role == PERMISSIONS.SUPERADMIN || ((per_val || per_val == 0) && current_per_val > per_val);
            }).map(r => ({ value: r, label: getNameOfRole(r) }));
        }
        return [];
    } else {
        return Object.values(PERMISSIONS).map(r => ({ value: r, label: getNameOfRole(r) }));
    }
}

export function decode(encodedString: string): string {
    if (!encodedString) {
        return "";
    }
    return decodeURIComponent(escape(atob(encodedString)));
}