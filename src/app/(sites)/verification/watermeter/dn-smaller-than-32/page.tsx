"use client"

import ErrorCaculatorTab from "@/components/error-caculator-tab";
import DNBT30ErrorCaculatorForm from "@/components/dn-bigger-than-32/error-caculator-form";
import vrfWm from "@styles/scss/ui/vrf-watermeter.module.scss"
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import TextField from '@mui/material/TextField';

import { useEffect, useState } from "react";
import Loading from "@/components/loading";
import dayjs, { Dayjs } from "dayjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faEye, faTrash } from "@fortawesome/free-solid-svg-icons";

interface WaterMeterProps {
    className?: string,
}

interface TabState {
    [key: number | string]: boolean;
};

const sampleData = [
    {
        "id": 1,
        "name": "Quy trình kiểm định ngày 21-2-2024",
        "createdAt": "21-2-2024",
        "updatedAt": "23-2-2024",
        "createdBy": "Nguyễn Văn A",
        "updatedBy": "Nguyễn Văn B",
        "numberOfClocks": 12,
        "status": "Q3",
    },
    {
        "id": 2,
        "name": "Quy trình kiểm định ngày 23-5-2024",
        "createdAt": "22-5-2024",
        "updatedAt": "25-5-2024",
        "createdBy": "Nguyễn Văn B",
        "updatedBy": "Nguyễn Văn C",
        "numberOfClocks": 24,
        "status": "Q1",
    },
    {
        "id": 3,
        "name": "Quy trình kiểm định ngày 27-3-2024",
        "createdAt": "23-3-2024",
        "updatedAt": "26-3-2024",
        "createdBy": "Nguyễn Văn C",
        "updatedBy": "Nguyễn Văn D",
        "numberOfClocks": 36,
        "status": "Q2",
    },
    {
        "id": 4,
        "name": "Quy trình kiểm định ngày 24-8-2024",
        "createdAt": "24-8-2024",
        "updatedAt": "27-8-2024",
        "createdBy": "Nguyễn Văn D",
        "updatedBy": "Nguyễn Văn E",
        "numberOfClocks": 48,
        "status": "Q3",
    },
    {
        "id": 5,
        "name": "Quy trình kiểm định ngày 29-6-2024",
        "createdAt": "25-6-2024",
        "updatedAt": "28-6-2024",
        "createdBy": "Nguyễn Văn E",
        "updatedBy": "Nguyễn Văn F",
        "numberOfClocks": 60,
        "status": "Q3",
    }
]

export default function WaterMeter({ className }: WaterMeterProps) {
    const [data, setData] = useState(sampleData);
    const [loading, setLoading] = useState(false);
    const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' | 'default' } | null>(null);
    const [fromDate, setFromDate] = useState<Date | null>(null);
    const [toDate, setToDate] = useState<Date | null>(null);
    const [processName, setProcessName] = useState<string>("");
    const [implementer, setImplementer] = useState<string>("");

    const sortData = (key: string) => {
        setLoading(true);
        let direction: 'asc' | 'desc' | 'default' = 'asc';

        if (sortConfig && sortConfig.key === key) {
            if (sortConfig.direction === 'asc') {
                direction = 'desc';
            } else if (sortConfig.direction === 'desc') {
                direction = 'default';
            }
        }

        let sortedData = [...data];

        if (direction === 'asc') {
            sortedData.sort((a, b) => (a[key as keyof typeof a] < b[key as keyof typeof b] ? -1 : a[key as keyof typeof a] > b[key as keyof typeof b] ? 1 : 0));
        } else if (direction === 'desc') {
            sortedData.sort((a, b) => (a[key as keyof typeof a] > b[key as keyof typeof b] ? -1 : a[key as keyof typeof a] < b[key as keyof typeof b] ? 1 : 0));
        } else {
            sortedData = sampleData;
        }

        setData(sortedData);
        setSortConfig({ key, direction });
        setLoading(false);
    };

    const filterDataByDate = () => {
        const now = new Date();
        let filteredData = sampleData;

        if (fromDate && toDate) {
            filteredData = sampleData.filter(item => {
                const itemDate = new Date(item.createdAt.split('-').reverse().join('-'));
                return itemDate >= fromDate && itemDate <= toDate;
            });
        } else if (fromDate) {
            filteredData = sampleData.filter(item => {
                const itemDate = new Date(item.createdAt.split('-').reverse().join('-'));
                return itemDate >= fromDate && itemDate <= now;
            });
        } else if (toDate) {
            filteredData = sampleData.filter(item => {
                const itemDate = new Date(item.createdAt.split('-').reverse().join('-'));
                return itemDate <= toDate;
            });
        }

        setData(filteredData);
    };

    const filterDataByProcessName = (name: string) => {
        const filteredData = sampleData.filter(item => item.name.toLowerCase().includes(name.toLowerCase()));
        setData(filteredData);
    };

    const filterDataByImplementer = (implementer: string) => {
        const filteredData = sampleData.filter(item => item.createdBy.toLowerCase().includes(implementer.toLowerCase()));
        setData(filteredData);
    };

    useEffect(() => {
        filterDataByDate();
    }, [fromDate, toDate]);

    useEffect(() => {
        setLoading(true);
        const debounce = setTimeout(() => {
            filterDataByProcessName(processName);
            setLoading(false);
        }, 800);
        return () => clearTimeout(debounce);
    }, [processName]);

    useEffect(() => {
        setLoading(true);
        const debounce = setTimeout(() => {
            filterDataByImplementer(implementer);
            setLoading(false);
        }, 800);
        return () => clearTimeout(debounce);
    }, [implementer]);

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className={`${className ? className : ""} mb-3 container-fluid p-0 px-2 py-3 w-100`}>
                <div className={`${vrfWm['wraper']} py-3 w-100 bg-white sr-cover`}>
                    <div className={`row m-0 w-100 mb-3 ${vrfWm['search-process']}`}>
                        <div className="col-12 mb-3 col-md-6 col-xl-4 d-flex">
                            <label className={`${vrfWm['form-label']}`} htmlFor="process-name">
                                Tên quy trình
                                <input
                                    type="text"
                                    id="process-name"
                                    className="form-control"
                                    placeholder="Tên quy trình"
                                    value={processName}
                                    onChange={(e) => setProcessName(e.target.value)}
                                />
                            </label>
                        </div>
                        <div className="col-12 mb-3 col-md-6 col-xl-4">
                            <label className={`${vrfWm['form-label']}`} htmlFor="implementer">
                                Người kiểm định
                                <input
                                    type="text"
                                    id="implementer"
                                    className="form-control"
                                    placeholder="Người kiểm định"
                                    value={implementer}
                                    onChange={(e) => setImplementer(e.target.value)}
                                />
                            </label>
                        </div>
                        <div className={`col-12 mb-3 m-0 row p-0 ${vrfWm['search-created-date']}`}>
                            <label className={`${vrfWm['form-label']} col-12`}>
                                Ngày tạo biên bản
                            </label>
                            <div className={`col-12 row m-0 mt-2 p-0 ${vrfWm['pick-created-date']}`}>
                                <div className={`col-12 col-md-6 col-xl-4 ${vrfWm['picker-field']}`}>
                                    <label>Từ</label>
                                    <DatePicker
                                        className={`${vrfWm['date-picker']}`}
                                        value={fromDate ? dayjs(fromDate) : null}
                                        format="DD-MM-YYYY"
                                        onChange={(newValue: Dayjs | null) => setFromDate(newValue ? newValue.toDate() : null)}
                                        slotProps={{ textField: { fullWidth: true } }}
                                    />
                                </div>
                                <div className={`col-12 col-md-6 col-xl-4 ${vrfWm['picker-field']}`}>
                                    <label>Đến</label>
                                    <DatePicker
                                        className={`${vrfWm['date-picker']}`}
                                        value={toDate ? dayjs(toDate) : null}
                                        format="DD-MM-YYYY"
                                        onChange={(newValue: Dayjs | null) => setToDate(newValue ? newValue.toDate() : null)}
                                        slotProps={{ textField: { fullWidth: true } }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={`m-0 p-0 w-100 w-100 bg-white mb-3 position-relative`}>
                        {loading && <Loading />}
                        <table className={`table table-striped table-bordered table-hover ${vrfWm['process-table']}`}>
                            <thead>
                                <tr className={`${vrfWm['table-header']}`}>
                                    <th onClick={() => sortData('id')}>STT</th>
                                    <th onClick={() => sortData('name')}>Tên quy trình</th>
                                    <th onClick={() => sortData('createdAt')}>Ngày kiểm định</th>
                                    <th onClick={() => sortData('createdBy')}>Người kiểm định</th>
                                    <th onClick={() => sortData('numberOfClocks')}>Số đồng hồ</th>
                                    <th onClick={() => sortData('status')}>Trạng thái</th>
                                    <th onClick={() => sortData('createdAt')}>Cập nhật gần nhất</th>
                                    <th>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((item, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{item.name}</td>
                                        <td>{item.createdAt}</td>
                                        <td>{item.createdBy}</td>
                                        <td>{item.numberOfClocks}</td>
                                        <td>
                                            {item.status}
                                        </td>
                                        <td>{item.updatedAt}</td>
                                        <td className="text-center">
                                            <button type="button" className={`btn m-0 me-2 p-0 text-primary`}>
                                                <FontAwesomeIcon icon={faEye}></FontAwesomeIcon>
                                            </button>
                                            <button type="button" className={`btn m-0 p-0 text-danger`}>
                                                <FontAwesomeIcon icon={faTrash}></FontAwesomeIcon>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className={`w-100 mb-3 ${vrfWm['pagination']}`}>
                        <button type="button" className={`${vrfWm['btn']}`}>
                            ❬❬
                        </button>
                        <button type="button" className={`${vrfWm['btn']}`}>
                            ❬
                        </button>
                        <button type="button" className={`${vrfWm['btn']} ${vrfWm['active']}`}>
                            1
                        </button>
                        <button type="button" className={`${vrfWm['btn']}`}>
                            2
                        </button>
                        <button type="button" className={`${vrfWm['btn']}`}>
                            3
                        </button>
                        <span>
                            ...
                        </span>
                        <button type="button" className={`${vrfWm['btn']}`}>
                            ❭
                        </button>
                        <button type="button" className={`${vrfWm['btn']}`}>
                            ❭❭
                        </button>
                    </div>
                </div>
            </div>
        </LocalizationProvider>
    )
}