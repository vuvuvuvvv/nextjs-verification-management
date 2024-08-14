export const processStatusOptions = [
    { value: '1', label: 'Q1' },
    { value: '2', label: 'Q2' },
    { value: '3', label: 'Q3' }
];

export const statusOptions = [
    { value: '0', label: 'Không hoạt động' },
    { value: '1', label: 'Hoạt động' },
];

export const pdmStatusOptions = [
    { value: '0', label: 'Hết hạn' },
    { value: '1', label: 'Còn hiệu lực' },
];

export const measureInstrumentNameOptions = [
    { value: "1", label: "Đồng hồ đo nước lạnh có cơ cấu điện tử" },
    { value: "2", label: "Đồng hồ đo nước lạnh cơ khí" },
    { value: "3", label: "Đồng hồ đo nước" }
]

export const typeOptions = [
    { value: "Điện từ", label: "Điện từ" },
    { value: "Cơ - Điện từ", label: "Cơ - Điện từ" },
    { value: "Đơn tia", label: "Đơn tia" },
    { value: "Đa tia", label: "Đa tia" },
    { value: "Thể tích", label: "Thể tích" },
    { value: "Woltman", label: "Woltman" },
    { value: "Woltex", label: "Woltex" },
    { value: "Khác", label: "Khác" }
]

export const accuracyClassOptions = [
    // { value: "0.5", label: "0.5" },
    { value: "1", label: "1" },
    // { value: "1.5", label: "1.5" },
    { value: "2", label: "2" },
    { value: "A", label: "A" },
    { value: "B", label: "B" },
    { value: "C", label: "C" },
    { value: "D", label: "D" }
]

export const entryOptions = [
    { value: 5, label: 5 },
    { value: 10, label: 10 },
    { value: 15, label: 15 },
    { value: 20, label: 20 },
    { value: 25, label: 25 },
    { value: 50, label: 50 },
]

export const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL;