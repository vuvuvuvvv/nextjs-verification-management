import { BASE_API_URL } from '@lib/system-constant';
import { DongHo, DongHoFilterParameters, NhomDongHo, NhomDongHoFilterParameters } from '@lib/types';
import api from '../route';

const API_DONGHO_URL = `${BASE_API_URL}/dongho`;

export const getUserPermissionWithDongHo = async (dongHo: DongHo) => {
    try {
        const response = await api.get(API_DONGHO_URL.toString() + "/user-permissions/" + dongHo.id);
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

export const getDongHoByFilter = async (parameters?: DongHoFilterParameters, withPermission?: boolean, username?: string) => {
    try {
        const url = new URL(API_DONGHO_URL + ((withPermission) ? "/permission/" + username : ""));
        if (parameters?.so_giay_chung_nhan) {
            url.searchParams.append('so_giay_chung_nhan', parameters.so_giay_chung_nhan.toString());
        }

        if (parameters?.seri_sensor) {
            url.searchParams.append('seri_sensor', parameters.seri_sensor.toString());
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

        if (parameters?.limit) {
            url.searchParams.append('limit', parameters.limit.toString());
        }

        if (parameters?.last_seen) {
            url.searchParams.append('last_seen', parameters.last_seen.toString());
        }

        if (parameters?.next_from) {
            url.searchParams.append('next_from', parameters.next_from.toString());
        }

        if (parameters?.prev_from) {
            url.searchParams.append('prev_from', parameters.prev_from.toString());
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

export const getNhomDongHoByFilter = async (parameters?: NhomDongHoFilterParameters | null, withPermission?: boolean, username?: string) => {
    try {
        const url = new URL(API_DONGHO_URL + ((withPermission) ? "/permission/group/" + username : "/group"));

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

        if (parameters?.limit) {
            url.searchParams.append('limit', parameters.limit.toString());
        }

        if (parameters?.page) {
            url.searchParams.append('page', parameters.page.toString());
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

export const getDongHoByGroupId = async (group_id: string) => {
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

export const createDongHoPermission = async (data: { id: string, user_info: string, permission: number, manager: string }) => {
    try {
        const response = await api.post(`${API_DONGHO_URL}/permission`, data, { withCredentials: true });

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

export const createMultDongHoPermission = async (data: {permissions: { id: string, permission: number}[], user_info: string}) => {
    try {
        const response = await api.post(`${API_DONGHO_URL}/permission/group`, data, { withCredentials: true });

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

export const updatePaymentStatus = async (group_id: string, new_payment_status: boolean, username: string) => {
    try {
        const response = await api.put(API_DONGHO_URL + "/payment-status",
            {
                group_id: group_id,
                new_payment_status: new_payment_status,
                username: username
            }, { withCredentials: true });

        if (response.status == 200) {
            return {
                "status": response.status,
                "msg": response.data.msg || "Cập nhật trạng thái thành công!",
                "data": response.data
            }
        } else {
            return {
                "status": response.status,
                "msg": response.data.msg || "Có lỗi đã xảy ra. Hãy thử lại!",

            }
        }

    } catch (error: any) {
        if (error.response?.data) {
            return {
                "status": error.response.status,
                "data": error.response.data,
                "msg": "Error: " + error.response.data.msg || 'Lỗi cập nhật trạng thái!'
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

export const deleteDongHoPermission = async (id: string) => {
    if (id) {
        try {
            const response = await api.delete(`${API_DONGHO_URL}/permission/${id}`, { withCredentials: true });

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
    }
};

export const checkDHPByUserInfoAndId = async (user_info: string, dongho: DongHo) => {
    try {
        const response = await api.get(`${API_DONGHO_URL}/user-info/${user_info}/id/${dongho.id}`);

        return {
            status: response.status,
            data: response.data,
            msg: response.data.msg
        };

    } catch (error: any) {
        if (error.response) {
            const { status, data } = error.response;

            switch (status) {
                case 404:
                    return {
                        status: 404,
                        msg: data.msg || 'Thông tin người dùng hoặc đồng hồ không tồn tại!'
                    };
                case 409:
                    return {
                        status: 409,
                        msg: data.msg || 'User đã được phân quyền cho đồng hồ này!',
                    };
                case 400:
                    return {
                        status: 400,
                        msg: data.msg || 'Thông tin không hợp lệ!'
                    };
                default:
                    return {
                        status: status,
                        msg: data.msg || 'Có lỗi xảy ra khi kiểm tra thông tin!'
                    };
            }
        }

        return {
            status: 500,
            msg: 'Có lỗi xảy ra khi kết nối với server!'
        };
    }
};

export const checkDHPByUserInfoAndGroupId = async (user_info: string, group_id: string) => {
    try {
        const response = await api.get(`${API_DONGHO_URL}/user-info/${user_info}/group-id/${group_id}`);
        if (response.status == 409) {
            return {
                status: 409,
                data: response.data,
            };
        }
        return {
            status: response.status,
            data: response.data,
            msg: response.data.message || 'Hợp lệ để phân quyền.'
        };
    } catch (error: any) {
        if (error.response) {
            const { status, data } = error.response;
            switch (status) {
                case 404:
                    return {
                        status: 404,
                        msg: data.error || 'Thông tin người dùng hoặc đồng hồ không tồn tại!'
                    };
                default:
                    return {
                        status: status,
                        data: data || null,
                        msg: data.error || 'Có lỗi xảy ra khi kiểm tra thông tin!'
                    };
            }
        }
        return {
            status: 500,
            msg: 'Có lỗi xảy ra khi kết nối với server!'
        };
    }
};