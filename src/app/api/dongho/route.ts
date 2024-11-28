import { BASE_API_URL } from '@lib/system-constant';
import { DongHo, DongHoFilterParameters, NhomDongHo, NhomDongHoFilterParameters } from '@lib/types';
import api from '../route';

const API_DONGHO_URL = `${BASE_API_URL}/dongho`;

export const getAllDongHo = async () => {
    try {
        const response = await api.get(API_DONGHO_URL.toString());
        // console.log("get dongho: ", response);
        return {
            "status": response.status,
            "data": response.data,
            "msg": "Thành công!"
        };

    } catch (error: any) {
        if (error.response?.data?.msg) {
            return {
                "status": error.response.status,
                "msg": 'Có lỗi xảy ra khi lấy dữ liệu đồng hồ!'
            };
        } else {
            return {
                "status": error.response?.status || 500,
                "msg": 'Có lỗi xảy ra khi lấy dữ liệu đồng hồ!'
            };
        }
    }
};

export const getAllDongHoNamesExist = async () => {
    try {
        const response = await api.get(API_DONGHO_URL.toString() + "/get-all-names-exist");
        // console.log("get dongho: ", response);
        return {
            "status": response.status,
            "data": response.data,
            "msg": "Thành công!"
        };

    } catch (error: any) {
        if (error.response?.data?.msg) {
            return {
                "status": error.response.status,
                "msg": 'Có lỗi xảy ra khi lấy dữ liệu đồng hồ!'
            };
        } else {
            return {
                "status": error.response?.status || 500,
                "msg": 'Có lỗi xảy ra khi lấy dữ liệu đồng hồ!'
            };
        }
    }
};

export const getDongHoByFilter = async (parameters?: DongHoFilterParameters) => {
    try {
        const url = new URL(API_DONGHO_URL);
        // url.searchParams.append('is_bigger_than_15', parameters?.is_bigger_than_15 ? '1' : '0');

        if (parameters?.so_giay_chung_nhan) {
            url.searchParams.append('so_giay_chung_nhan', parameters.so_giay_chung_nhan.toString());
        }

        if (parameters?.ten_khach_hang) {
            url.searchParams.append('ten_khach_hang', parameters.ten_khach_hang.toString());
        }

        if (parameters?.nguoi_kiem_dinh) {
            url.searchParams.append('nguoi_kiem_dinh', parameters.nguoi_kiem_dinh.toString());
        }

        if (parameters?.ngay_kiem_dinh_from) {
            url.searchParams.append('ngay_kiem_dinh_from', parameters.ngay_kiem_dinh_from.toString());
        }

        if (parameters?.ngay_kiem_dinh_to) {
            url.searchParams.append('ngay_kiem_dinh_to', parameters.ngay_kiem_dinh_to.toString());
        }

        const response = await api.get(url.toString(), { withCredentials: true });

        return {
            "status": response.status,
            "data": response.data,
            "msg": "Thành công!"
        };

    } catch (error: any) {
        if (error.response?.data?.msg) {
            return {
                "status": error.response.status,
                "msg": 'Có lỗi xảy ra khi lấy dữ liệu đồng hồ!'
            };
        } else {
            return {
                "status": error.response?.status || 500,
                "msg": 'Có lỗi xảy ra khi lấy dữ liệu đồng hồ!'
            };
        }
    }
};

export const getNhomDongHoByFilter = async (parameters?: NhomDongHoFilterParameters | null) => {
    try {
        const url = new URL(API_DONGHO_URL + "/group");

        if (parameters?.ten_dong_ho) {
            url.searchParams.append('ten_dong_ho', parameters.ten_dong_ho.toString());
        }

        if (parameters?.ten_khach_hang) {
            url.searchParams.append('ten_khach_hang', parameters.ten_khach_hang.toString());
        }

        if (parameters?.nguoi_kiem_dinh) {
            url.searchParams.append('nguoi_kiem_dinh', parameters.nguoi_kiem_dinh.toString());
        }

        if (parameters?.ngay_kiem_dinh_from) {
            url.searchParams.append('ngay_kiem_dinh_from', parameters.ngay_kiem_dinh_from.toString());
        }

        if (parameters?.ngay_kiem_dinh_to) {
            url.searchParams.append('ngay_kiem_dinh_to', parameters.ngay_kiem_dinh_to.toString());
        }

        const response = await api.get(url.toString(), { withCredentials: true });

        return {
            "status": response.status,
            "data": response.data,
            "msg": "Thành công!"
        };

    } catch (error: any) {
        if (error.response?.data?.msg) {
            return {
                "status": error.response.status,
                "msg": 'Có lỗi xảy ra khi lấy dữ liệu đồng hồ!'
            };
        } else {
            return {
                "status": error.response?.status || 500,
                "msg": 'Có lỗi xảy ra khi lấy dữ liệu đồng hồ!'
            };
        }
    }
};

export const getDongHoById = async (id: string) => {
    try {
        const url = `${API_DONGHO_URL}/id/${id.toString()}`;

        const response = await api.get(url.toString(), { withCredentials: true });

        if (response.status === 200 || response.status === 201) {
            return {
                "status": response.status,
                "data": response.data,
                "msg": "Thành công!"
            };
        }

    } catch (error: any) {
        if (error.response) {
            if (error.response.status === 404) {
                return {
                    "status": 404,
                    "msg": 'Id không hợp lệ!'
                };
            }
            if (error.response.data?.msg) {
                return {
                    "status": error.response.status,
                    "msg": 'Có lỗi xảy ra khi lấy dữ liệu đồng hồ!'
                };
            }
        }
        return {
            "status": error.response?.status || 500,
            "msg": 'Có lỗi xảy ra khi lấy dữ liệu đồng hồ!'
        };
    }
};

export const getDongHoExistsByInfo = async (info: string) => {
    try {
        const url = `${API_DONGHO_URL}/dong-ho-info/${info.toString()}`;

        const response = await api.get(url.toString(), { withCredentials: true });

        if (response.status === 200 || response.status === 201) {
            return {
                "status": response.status,
                "data": response.data,
                "msg": "Đã có đồng hồ tồn tại thông tin trên!"
            };
        }

    } catch (error: any) {
        if (error.response) {
            if (error.response.status === 404) {
                return {
                    "status": 404,
                    "msg": 'Thông tin không tồn tại!'
                };
            }
            if (error.response.data?.msg) {
                return {
                    "status": error.response.status,
                    "msg": 'Có lỗi xảy ra khi lấy dữ liệu đồng hồ!'
                };
            }
        }
        return {
            "status": error.response?.status || 500,
            "msg": 'Có lỗi xảy ra khi lấy dữ liệu đồng hồ!'
        };
    }
};

export const getNhomDongHoByGroupId = async (group_id: string) => {
    try {
        const url = `${API_DONGHO_URL}/group_id/${group_id.toString()}`;

        const response = await api.get(url.toString(), { withCredentials: true });

        if (response.status === 200 || response.status === 201) {
            return {
                "status": response.status,
                "data": response.data,
                "msg": "Thành công!"
            };
        }

    } catch (error: any) {
        if (error.response) {
            if (error.response.status === 404) {
                return {
                    "status": 404,
                    "msg": 'Id không hợp lệ!'
                };
            }
            if (error.response.data?.msg) {
                return {
                    "status": error.response.status,
                    "msg": 'Có lỗi xảy ra khi lấy dữ liệu đồng hồ!'
                };
            }
        }
        return {
            "status": error.response?.status || 500,
            "msg": 'Có lỗi xảy ra khi lấy dữ liệu đồng hồ!'
        };
    }
};

export const getDongHoByTenkhachhang = async (tenkhachhang: string) => {
    try {
        const url = `${API_DONGHO_URL}/tenkhachhang/${tenkhachhang.toString()}`;

        const response = await api.get(url.toString(), { withCredentials: true });

        return {
            "status": response.status,
            "data": response.data,
            "msg": response.data.msg || "Done!"
        };

    } catch (error: any) {
        if (error.response?.data?.msg) {
            return {
                "status": error.response.status,
                "msg": error.response.data.msg || 'Error fetching DongHo data!'
            };
        } else {
            return {
                "status": error.response?.status || 500,
                "msg": 'An error occurred. Please try again!'
            };
        }
    }
};

export const createDongHo = async (dongho: DongHo) => {
    try {
        const response = await api.post(API_DONGHO_URL, dongho, { withCredentials: true });

        if (response.status == 201) {
            return {
                "status": response.status,
                "msg": response.data.msg || "Lưu Đồng hồ thành công!",
                "data": response.data
            }
        } else {
            return {
                "status": response.status,
                "msg": response.data.msg || "Có lỗi đã xảy ra. Hãy thử lại!",

            }
        }

    } catch (error: any) {
        // console.log("Error:", error);
        if (error.response?.data) {
            return {
                "status": error.response.status,
                "data": error.response.data,
                "msg": "Error: " + error.response.data.msg || 'Error creating DongHo!'
            };
        } else {
            return {
                "status": error.response?.status || 500,
                "msg": 'Đã có lỗi xảy ra. Hãy thử lại sau!'
            };
        }
    }
};

export const updateDongHo = async (dongho: DongHo) => {
    try {
        const response = await api.put(API_DONGHO_URL + "/" + dongho.id, dongho, { withCredentials: true });

        if (response.status == 200) {
            return {
                "status": response.status,
                "msg": response.data.msg || "Lưu Đồng hồ thành công!",
                "data": response.data
            }
        } else {
            return {
                "status": response.status,
                "msg": response.data.msg || "Có lỗi đã xảy ra. Hãy thử lại!",

            }
        }

    } catch (error: any) {
        // console.log("Error:", error);
        if (error.response?.data) {
            return {
                "status": error.response.status,
                "data": error.response.data,
                "msg": "Error: " + error.response.data.msg || 'Error creating DongHo!'
            };
        } else {
            return {
                "status": error.response?.status || 500,
                "msg": 'Đã có lỗi xảy ra. Hãy thử lại sau!'
            };
        }
    }
};

export const deleteDongHo = async (serial_number: string) => {
    try {
        const response = await api.delete(`${API_DONGHO_URL}/${serial_number}`, { withCredentials: true });

        return {
            "status": response.status,
            "msg": response.data.msg || "DongHo deleted successfully!"
        };

    } catch (error: any) {
        if (error.response?.data?.msg) {
            return {
                "status": error.response.status,
                "msg": error.response.data.msg || 'Error deleting DongHo!'
            };
        } else {
            return {
                "status": error.response?.status || 500,
                "msg": 'Đã có lỗi xảy ra. Hãy thử lại sau!'
            };
        }
    }
};

export const deleteNhomDongHo = async (group_id: string) => {
    try {
        const response = await api.delete(`${API_DONGHO_URL}/group/${group_id}`, { withCredentials: true });

        return {
            "status": response.status,
            "msg": response.data.msg || "DongHo deleted successfully!"
        };

    } catch (error: any) {
        if (error.response?.data?.msg) {
            return {
                "status": error.response.status,
                "msg": error.response.data.msg || 'Error deleting DongHo!'
            };
        } else {
            return {
                "status": error.response?.status || 500,
                "msg": 'Đã có lỗi xảy ra. Hãy thử lại sau!'
            };
        }
    }
};