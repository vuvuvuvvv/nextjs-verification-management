"use client"

import ErrorCaculatorTab from "@/components/error-caculator-tab";
import ErrorCaculatorForm from "@/components/error-caculator-form";
import vrfWm from "@styles/scss/ui/vfm.module.scss"
import { useEffect, useState } from "react";


import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { viVN } from "@mui/x-date-pickers/locales";

import dayjs, { Dayjs } from "dayjs";

import NavTab from "@/components/nav-tab";
import { accuracyClassOptions, measureInstrumentNameOptions, typeOptions } from "@lib/system-constant";

import Select, { GroupBase } from 'react-select';

import { useUser } from "@/context/user-context";

interface NewProcessDNBiggerThan32Props {
    className?: string,
}

interface TabState {
    [key: number | string]: boolean;
};

export default function NewProcessDNBiggerThan32({ className }: NewProcessDNBiggerThan32Props) {
    const { user } = useUser();

    const [selectedTab, setSelectedTab] = useState<TabState>({ [1]: true });
    const [isCollapsed, setIsCollapsed] = useState<boolean>(true);

    const [seriNumber, setSeriNumber] = useState<string>("");                               // Serial number

    const [deviceName, setDeviceName] = useState<string>("");                               // Tên phương tiện đo
    const [directiveSeri, setDirectiveSeri] = useState<string>("");                         // Serial chỉ thị
    const [sensorSeri, setSensorSeri] = useState<string>("");                               // Serial sensor

    const [deviceType, setDeviceType] = useState<string>("");                               // Kiểu
    const [deviceNumber, setDeviceNumber] = useState<string>("");                           // Số
    const [manufacturer, setManufacturer] = useState<string>("");                           // Cơ sở sản xuất
    const [manufactureYear, setManufactureYear] = useState<Date | null>(null);              // Năm sản xuất
    const [DN, setDN] = useState<string>("");                                               // Đường kính danh định

    const [accuracyClass, setAccuracyClass] = useState<string | null>(null);                // Cấp chính xác
    const [q3, setQ3] = useState<string>("");                                               // Q3
    const [ratio, setRatio] = useState<string>("");                                         // Tỷ số Q3/Q1 (R)
    const [qn, setQN] = useState<string>("");                                               // QN

    const [kFactor, setKFactor] = useState<string>("");                                     // k factor
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

    // truyền setter vào để lưu giá trị vào state
    const handleNumberChange = (setter: (value: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (/^\d*$/.test(value)) {
            setter(value);
        }
    };

    useEffect(() => {
        setQ3("");
        setRatio("");
        setQN("");
    }, [accuracyClass]);

    useEffect(() => {
        setDirectiveSeri("");
        setSensorSeri("");
    }, [deviceName]);

    const renderAccuracyClassFields = () => {

        if (!accuracyClass) {
            return <></>
        }

        // Check có phải đồng hồ đty hay không : value: "1"
        const renedrDeviceNameCondition = deviceName && measureInstrumentNameOptions.find(option => option.label == deviceName)?.value == "1";

        if ((accuracyClass == "1" || accuracyClass == "2")) {
            return <>
                <div className="mb-3 col-12 col-md-6">
                    <label htmlFor="q3" className="form-label">- Q<sub>3</sub>:</label>
                    <div className="input-group">
                        <input
                            type="text"
                            className="form-control"
                            id="q3"
                            placeholder="Q3"
                            value={q3}
                            onChange={handleNumberChange(setQ3)}
                            pattern="\d*"
                        />
                        <span className="input-group-text" id="basic-addon2">m<sup>3</sup>/h (kg/h)</span>
                    </div>
                </div>
                <div className="mb-3 col-12 col-md-6">
                    <label htmlFor="ratio" className="form-label">- Tỷ số Q<sub>3</sub>/Q<sub>1</sub> (R):</label>
                    <input
                        type="text"
                        className="form-control"
                        id="ratio"
                        placeholder="Tỷ số Q3/Q1 (R)"
                        value={ratio}
                        onChange={handleNumberChange(setRatio)}
                        pattern="\d*"
                    />
                </div>

                {renedrDeviceNameCondition &&
                    <div className="mb-3 col-12 col-md-6">
                        <label htmlFor="sensorSeri" className="form-label">Serial sensor:</label>
                        <input
                            type="text"
                            className="form-control"
                            id="sensorSeri"
                            placeholder="Serial sensor"
                            value={sensorSeri}
                            onChange={(e) => setSensorSeri(e.target.value)}
                        />
                    </div>
                }
            </>
        }

        return <>
            <div className="mb-3 col-12 col-md-6">
                <label htmlFor="qn" className="form-label">- Q<sub>n</sub>:</label>
                <div className="input-group">
                    <input
                        type="text"
                        className="form-control"
                        id="qn"
                        placeholder="Qn"
                        value={qn}
                        onChange={handleNumberChange(setQN)}
                        pattern="\d*"
                    />
                    <span className="input-group-text" id="basic-addon2">m<sup>3</sup>/h (kg/h)</span>
                </div>
            </div>

            {renedrDeviceNameCondition &&
                <div className="mb-3 col-12 col-md-6">
                    <label htmlFor="directiveSeri" className="form-label">Serial chỉ thị:</label>
                    <div className="input-group">
                        <input
                            type="text"
                            className="form-control"
                            id="directiveSeri"
                            placeholder="Serial chỉ thị"
                            value={directiveSeri}
                            onChange={(e) => setDirectiveSeri(e.target.value)}
                        />
                    </div>
                </div>
            }
        </>
    }

    const renderDeviceNameFields = () => {
        if (!deviceName) {
            return <></>
        }

        const objDevicename = measureInstrumentNameOptions.find(option => option.label == deviceName);

        if (objDevicename?.value == "1") {
            return

        }

        return
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} localeText={viVN.components.MuiLocalizationProvider.defaultProps.localeText}>
            <div className={`${className ? className : ""} ${vrfWm['wraper']} container p-0 px-2 py-3 w-100`}>
                <div className={`row m-0 mb-3 p-3 w-100 bg-white sr-cover`}>
                    <div className="w-100 m-0 p-0 mb-3 position-relative">
                        <h3 className="text-uppercase fw-bolder text-center mt-3 mb-0">thông tin đồng hồ</h3>
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
                                    <Select
                                        name="deviceName"
                                        options={measureInstrumentNameOptions as unknown as readonly GroupBase<never>[]}
                                        className="basic-multi-select"
                                        classNamePrefix="select"
                                        placeholder="-- Chọn tên --"
                                        isClearable
                                        value={measureInstrumentNameOptions.find(option => option.label == deviceName) || null}
                                        onChange={(selectedOptions: any) => setDeviceName(selectedOptions ? selectedOptions.label : "")}
                                        styles={{
                                            control: (provided) => ({
                                                ...provided,
                                                height: '42px',
                                                minHeight: '42px',
                                                borderColor: '#dee2e6 !important',
                                                boxShadow: 'none !important'
                                            }),
                                            valueContainer: (provided) => ({
                                                ...provided,
                                                height: '42px',
                                                padding: '0 8px'
                                            }),
                                            input: (provided) => ({
                                                ...provided,
                                                margin: '0',
                                                padding: '0'
                                            }),
                                            indicatorsContainer: (provided) => ({
                                                ...provided,
                                                height: '42px'
                                            })
                                        }}
                                    />
                                </div>

                                {renderDeviceNameFields()}

                                <div className="mb-3 col-12 col-md-6">
                                    <label htmlFor="deviceType" className="form-label">Kiểu:</label>
                                    <Select
                                        name="type"
                                        options={typeOptions as unknown as readonly GroupBase<never>[]}
                                        className="basic-multi-select"
                                        placeholder="-- Chọn kiểu --"
                                        classNamePrefix="select"
                                        isClearable
                                        value={typeOptions.find(option => option.value === deviceType) || null}
                                        onChange={(selectedOptions: any) => setDeviceType(selectedOptions ? selectedOptions.value : "")}
                                        styles={{
                                            control: (provided) => ({
                                                ...provided,
                                                height: '42px',
                                                minHeight: '42px',
                                                borderColor: '#dee2e6 !important',
                                                boxShadow: 'none !important'
                                            }),
                                            valueContainer: (provided) => ({
                                                ...provided,
                                                height: '42px',
                                                padding: '0 8px'
                                            }),
                                            input: (provided) => ({
                                                ...provided,
                                                margin: '0',
                                                padding: '0'
                                            }),
                                            indicatorsContainer: (provided) => ({
                                                ...provided,
                                                height: '42px'
                                            })
                                        }}
                                    />
                                </div>

                                {/* TODO */}
                                {/* <div className="mb-3 col-12 col-md-6">
                                    <label htmlFor="deviceNumber" className="form-label">Số:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="deviceNumber"
                                        placeholder="Số"
                                        value={deviceNumber}
                                        onChange={handleNumberChange(setDeviceNumber)}
                                    />
                                </div> */}

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
                                        onChange={(newValue: Dayjs | null) => {
                                            if (newValue && newValue.year() >= 1900 && newValue.year() <= dayjs().year()) {

                                                setManufactureYear(newValue.toDate());
                                            } else {
                                                setManufactureYear(null); // or handle invalid date
                                            }

                                        }}
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
                                        <span className="input-group-text" id="basic-addon2">lít</span>
                                    </div>
                                </div>
                                <div className="mb-3 col-12 col-md-6">
                                    <label htmlFor="accuracyClass" className="form-label">- Cấp chính xác:</label>
                                    <Select
                                        name="accuracyClass"
                                        options={accuracyClassOptions as unknown as readonly GroupBase<never>[]}
                                        className="basic-multi-select"
                                        classNamePrefix="select"
                                        placeholder="-- Chọn cấp --"
                                        isClearable
                                        value={accuracyClassOptions.find(option => option.value === accuracyClass) || null}
                                        onChange={(selectedOptions: any) => setAccuracyClass(selectedOptions ? selectedOptions.value : "")}
                                        styles={{
                                            control: (provided) => ({
                                                ...provided,
                                                height: '42px',
                                                minHeight: '42px',
                                                borderColor: '#dee2e6 !important',
                                                boxShadow: 'none !important'
                                            }),
                                            valueContainer: (provided) => ({
                                                ...provided,
                                                height: '42px',
                                                padding: '0 8px'
                                            }),
                                            input: (provided) => ({
                                                ...provided,
                                                margin: '0',
                                                padding: '0'
                                            }),
                                            indicatorsContainer: (provided) => ({
                                                ...provided,
                                                height: '42px'
                                            })
                                        }}
                                    />
                                </div>

                                {/* Generate input field  */}
                                {renderAccuracyClassFields()}


                                <div className="mb-3 col-12 col-md-6">
                                    <label htmlFor="pdmSign" className="form-label">- Hệ số K-factor :</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="kFactor"
                                        placeholder="K-factor"
                                        value={kFactor}
                                        onChange={handleNumberChange(setKFactor)}
                                    />
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
                                        value={"ĐNVN 17:2023"}
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
                                        value={"Đồng hồ chuẩn đo nước và Bình chuẩn"}
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
                                        value={user?.username || implementer}
                                        onChange={(e) => setImplementer(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3 col-12 col-md-6">
                                    <label htmlFor="implementationDate" className="form-label">Ngày thực hiện:</label>
                                    <DatePicker
                                        className={`${vrfWm['date-picker']}`}
                                        value={dayjs()}
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
                        <button type="button" className={`btn ${vrfWm['btn-collapse-info']} ${vrfWm['btn-collapse-end']}`} onClick={toggleCollapse}>
                            {isCollapsed ? "Hiện thêm" : "Ẩn bớt"}
                        </button>
                        <span className={vrfWm['end-line']}></span>
                    </div>
                </div>

                <div className={`m-0 mb-3 p-0 w-100 w-100 bg-white sr-cover`}>

                    <NavTab tabContent={
                        [
                            {
                                title: <>Q<sub>3</sub> (Q<sub>max</sub>)</>,
                                content: <ErrorCaculatorTab tabIndex={1} form={ErrorCaculatorForm} />
                            },
                            {
                                title: <>Q<sub>2</sub> (Q<sub>t</sub>)</>,
                                content: <ErrorCaculatorTab tabIndex={2} form={ErrorCaculatorForm} />
                            },
                            {
                                title: <>Q<sub>1</sub> (Q<sub>min</sub>)</>,
                                content: <ErrorCaculatorTab tabIndex={3} form={ErrorCaculatorForm} />
                            },
                        ]
                    } />

                </div>
            </div>
        </LocalizationProvider >
    )
}