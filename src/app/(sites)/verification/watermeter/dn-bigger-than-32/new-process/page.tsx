"use client"

import ErrorCaculatorTab from "@/components/error-caculator-tab";
import ErrorCaculatorForm from "@/components/dn-bigger-than-32/error-caculator-form";
import vrfWm from "@styles/scss/ui/vrf-watermeter.module.scss"
import { useState } from "react";


import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { viVN } from "@mui/x-date-pickers/locales";

import dayjs, { Dayjs } from "dayjs";
import { faAngleDoubleDown, faAngleDoubleUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface WaterMeterProps {
    className?: string,
}

interface TabState {
    [key: number | string]: boolean;
};

export default function WaterMeter({ className }: WaterMeterProps) {
    const [selectedTab, setSelectedTab] = useState<TabState>({ [1]: true });
    const [isCollapsed, setIsCollapsed] = useState<boolean>(true);

    const [seriNumber, setSeriNumber] = useState<string>("");                               // Serial number
    const [deviceName, setDeviceName] = useState<string>("");                               // Tên phương tiện đo
    const [deviceType, setDeviceType] = useState<string>("");                               // Kiểu
    const [deviceNumber, setDeviceNumber] = useState<string>("");                           // Số
    const [manufacturer, setManufacturer] = useState<string>("");                           // Cơ sở sản xuất
    const [manufactureYear, setManufactureYear] = useState<Date | null>(null);              // Năm sản xuất
    const [DN, setDN] = useState<string>("");                                               // Đường kính danh định
    const [accuracyClass, setAccuracyClass] = useState<string | null>(null);                // Cấp chính xác
    const [ratio, setRatio] = useState<string>("");                                         // Tỷ số Q3/Q1
    const [q3, setQ3] = useState<string>("");                                               // Q3(Q1)
    const [pdmSign, setPdmSign] = useState<string>("");                                     // K hiệu PDM/Số quyết định PDM
    const [usageBase, setUsageBase] = useState<string>("");                                 // Cơ sở sử dụng
    const [method, setMethod] = useState<string>("");                                       // Phương pháp thực hiện
    const [equipment, setEquipment] = useState<string>("");                                 // Chuẩn, thiết bị chính được sử dụng
    const [implementer, setImplementer] = useState<string>("");                             // Người thực hiện
    const [implementationDate, setImplementationDate] = useState<Date | null>(null);        // Ngày thực hiện
    const [location, setLocation] = useState<string>("");                                   // Vị trí

    const toggleTab = (tab: number) => {
        if (!selectedTab[tab]) {
            setSelectedTab((prev) => ({
                [tab]: !prev[tab]
            }))
        }
    };

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    const handleNumberChange = (setter: (value: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (/^\d*$/.test(value)) {
            setter(value);
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} localeText={viVN.components.MuiLocalizationProvider.defaultProps.localeText}>
            <div className={`${className ? className : ""} ${vrfWm['wraper']} container p-0 px-2 py-3 w-100`}>
                <div className={`row m-0 mb-3 p-3 w-100 bg-white sr-cover`}>
                    <div className="w-100 m-0 p-0 mb-3 position-relative">
                        <h3 className="text-uppercase fw-bolder text-center mt-3 mb-0">thông tin kiểm định</h3>
                    </div>
                    <div className={`w-100 p-0 row m-0 mb-3`}>
                        <div className={`col-12 col-xl-8 m-0 p-0 d-flex align-items-center justify-content-between ${vrfWm['seri-number-input']}`}>
                            <label htmlFor="seriNumber" className={`form-label m-0 fs-5 fw-bold d-block`}>Số seri:</label>
                            <input
                                type="text"
                                id="seriNumber"
                                className={`form-control`}
                                placeholder="Nhập số serial"
                                value={seriNumber}
                                onChange={(e) => setSeriNumber(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className={`collapse ${isCollapsed ? '' : 'show'} w-100 mt-2 p-0`}>
                        <form className="w-100">
                            <label className="w-100 fs-5 fw-bold">Thông tin thiết bị:</label>
                            <div className="row mx-0 w-100 mb-3">
                                <div className="mb-3 col-12 col-xxl-6">
                                    <label htmlFor="deviceName" className="form-label">Tên phương tiện đo:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="deviceName"
                                        placeholder="Tên phương tiện đo"
                                        value={deviceName}
                                        onChange={(e) => setDeviceName(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3 col-12 col-md-6">
                                    <label htmlFor="deviceType" className="form-label">Kiểu:</label>
                                    <select className="form-select" value={deviceType ?? ""} onChange={(e) => setDeviceType(e.target.value)}>
                                        <option value="" disabled>-- Chọn kiểu --</option>
                                        <option value="Điện từ">Điện từ</option>
                                        <option value="Cơ - Điện từ">Cơ - Điện từ</option>
                                        <option value="Woltman">Woltman</option>
                                        <option value="Đa tia">Đa tia</option>
                                        <option value="Đơn tia">Đơn tia</option>
                                        <option value="Thể tích">Thể tích</option>
                                        <option value="Woltex">Woltex</option>
                                        <option value="Khác">Khác</option>
                                    </select>
                                </div>
                                <div className="mb-3 col-12 col-md-6">
                                    <label htmlFor="deviceNumber" className="form-label">Số:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="deviceNumber"
                                        placeholder="Số"
                                        value={deviceNumber}
                                        onChange={handleNumberChange(setDeviceNumber)}
                                    />
                                </div>
                                <div className="mb-3 col-12 col-md-6">
                                    <label htmlFor="manufacturer" className="form-label">Cơ sở sản xuất:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="manufacturer"
                                        placeholder="Cơ sở sản xuất"
                                        value={manufacturer}
                                        onChange={(e) => setManufacturer(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3 col-12 col-md-6">
                                    <label htmlFor="manufactureYear" className="form-label">Năm sản xuất:</label>
                                    <DatePicker
                                        className={`${vrfWm['date-picker']}`}
                                        value={manufactureYear ? dayjs(manufactureYear) : null}
                                        views={['year']}
                                        format="YYYY"
                                        maxDate={dayjs().endOf('year')}
                                        onChange={(newValue: Dayjs | null) => setManufactureYear(newValue ? newValue.toDate() : null)}
                                        slotProps={{ textField: { fullWidth: true } }}
                                    />
                                </div>
                            </div>
                            <label className="w-100 fs-5 fw-bold">Đặc trưng kỹ thuật:</label>
                            <div className="row mx-0 w-100 mb-3">
                                <div className="mb-3 col-12 col-md-6">
                                    <label htmlFor="DN" className="form-label">- Đường kính danh định (DN):</label>
                                    <div className="input-group">
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="DN"
                                            placeholder="DN"
                                            value={DN}
                                            onChange={handleNumberChange(setDN)}
                                            pattern="\d*"
                                        />
                                        <span className="input-group-text" id="basic-addon2">mm</span>
                                    </div>
                                </div>
                                <div className="mb-3 col-12 col-md-6">
                                    <label htmlFor="accuracyClass" className="form-label">- Cấp chính xác:</label>
                                    <select className="form-select" value={accuracyClass ?? ""} onChange={(e) => setAccuracyClass(e.target.value)}>
                                        <option value="" disabled>-- Chọn cấp chính xác --</option>
                                        <option value="0.5">0.5</option>
                                        <option value="1">1</option>
                                        <option value="1.5">1.5</option>
                                        <option value="2">2</option>
                                        <option value="A">A</option>
                                        <option value="B">B</option>
                                        <option value="C">C</option>
                                        <option value="D">D</option>
                                    </select>
                                </div>
                                <div className="mb-3 col-12 col-md-6">
                                    <label htmlFor="ratio" className="form-label">- Tỷ số Q<sub>3</sub>/Q<sub>1</sub> (R):</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="ratio"
                                        placeholder="Tỷ số Q3/Q1"
                                        value={ratio}
                                        onChange={handleNumberChange(setRatio)}
                                        pattern="\d*"
                                    />
                                </div>
                                <div className="mb-3 col-12 col-md-6">
                                    <label htmlFor="q3" className="form-label">- Q<sub>3</sub>(Q<sub>1</sub>):</label>
                                    <div className="input-group">
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="q3"
                                            placeholder="Q3(Q1)"
                                            value={q3}
                                            onChange={handleNumberChange(setQ3)}
                                            pattern="\d*"
                                        />
                                        <span className="input-group-text" id="basic-addon2">m<sup>3</sup>/h (kg/h)</span>
                                    </div>
                                </div>
                                <div className="mb-3 col-12 col-md-6">
                                    <label htmlFor="pdmSign" className="form-label">- Ký hiệu PDM/Số quyết định PDM:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="pdmSign"
                                        placeholder="Ký hiệu PDM/Số quyết định PDM"
                                        value={pdmSign}
                                        onChange={(e) => setPdmSign(e.target.value)}
                                    />
                                </div>
                            </div>
                            <label className="w-100 fs-5 fw-bold">Chi tiết kiểm định:</label>
                            <div className="row mx-0 w-100 mb-3">
                                <div className="mb-3 col-12 col-xxl-6">
                                    <label htmlFor="usageBase" className="form-label">Cơ sở sử dụng:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="usageBase"
                                        placeholder="Cơ sở sử dụng"
                                        value={usageBase}
                                        onChange={(e) => setUsageBase(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3 col-12 col-xxl-6">
                                    <label htmlFor="method" className="form-label">Phương pháp thực hiện:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="method"
                                        placeholder="Phương pháp thực hiện"
                                        value={method}
                                        onChange={(e) => setMethod(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3 col-12 col-xl-6">
                                    <label htmlFor="equipment" className="form-label">Chuẩn, thiết bị chính được sử dụng:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="equipment"
                                        placeholder="Chuẩn, thiết bị chính được sử dụng"
                                        value={equipment}
                                        onChange={(e) => setEquipment(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3 col-12 col-md-6">
                                    <label htmlFor="implementer" className="form-label">Người thực hiện:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="implementer"
                                        placeholder="Người thực hiện"
                                        value={implementer}
                                        onChange={(e) => setImplementer(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3 col-12 col-md-6">
                                    <label htmlFor="implementationDate" className="form-label">Ngày thực hiện:</label>
                                    <DatePicker
                                        className={`${vrfWm['date-picker']}`}
                                        value={implementationDate ? dayjs(implementationDate) : null}
                                        format="DD-MM-YYYY"
                                        maxDate={dayjs().endOf('day')}
                                        onChange={(newValue: Dayjs | null) => setImplementationDate(newValue ? newValue.toDate() : null)}
                                        slotProps={{ textField: { fullWidth: true } }}
                                    />
                                </div>
                                <div className="mb-3 col-12 col-xl-6">
                                    <label htmlFor="location" className="form-label">Địa điểm thực hiện:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="location"
                                        placeholder="Địa điểm thực hiện"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                    />
                                </div>
                            </div>
                        </form>
                    </div>
                        <div className="w-100 m-0 p-0 d-flex justify-content-center align-items-center gap-4">
                            <span className={vrfWm['end-line']}></span>
                            <button type="button" data-tooltip={isCollapsed ? "Hiện thêm thông tin" : "Ẩn bớt"} className={`btn ${vrfWm['btn-collapse-info']} ${vrfWm['btn-collapse-end']}`} onClick={toggleCollapse}>
                                <FontAwesomeIcon icon={isCollapsed ? faAngleDoubleDown : faAngleDoubleUp} className="text-dark" />
                            </button>
                            <span className={vrfWm['end-line']}></span>
                        </div>
                </div>

                <div className={`m-0 mb-3 p-0 w-100 w-100 bg-white sr-cover`}>
                    <div className={`m-0 p-0 w-100 nav nav-tabs w-100`} id={vrfWm['process-tab']}>
                        <button type="button" className={`${vrfWm['nav-link']} ${selectedTab[1] ? vrfWm['active'] : ''} sr-cover`} onClick={() => toggleTab(1)}>
                            Q<sub>3</sub> (Q<sub>max</sub>)
                        </button>
                        <button type="button" className={`${vrfWm['nav-link']} ${selectedTab[2] ? vrfWm['active'] : ''} sr-cover`} onClick={() => toggleTab(2)}>
                            Q<sub>2</sub> (Q<sub>t</sub>)
                        </button>
                        <button type="button" className={`${vrfWm['nav-link']} ${selectedTab[3] ? vrfWm['active'] : ''} sr-cover`} onClick={() => toggleTab(3)}>
                            Q<sub>1</sub> (Q<sub>min</sub>)
                        </button>
                    </div>
                    <div className={`m-0 py-3 px-2 w-100`} id={vrfWm['process-tab-content']}>
                        <ErrorCaculatorTab tabIndex={1} className={`${selectedTab[1] ? vrfWm['show'] : 'd-none'}`} form={ErrorCaculatorForm} />
                        <ErrorCaculatorTab tabIndex={2} className={`${selectedTab[2] ? vrfWm['show'] : 'd-none'}`} form={ErrorCaculatorForm} />
                        <ErrorCaculatorTab tabIndex={3} className={`${selectedTab[3] ? vrfWm['show'] : 'd-none'}`} form={ErrorCaculatorForm} />
                    </div>
                </div>
            </div>
        </LocalizationProvider >
    )
}