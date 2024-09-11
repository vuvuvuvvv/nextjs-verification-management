"use client"

// components/DeviceInfo.tsx
import { useEffect } from 'react';

const DeviceInfo: React.FC = () => {
    useEffect(() => {
        const userAgent = navigator.userAgent || navigator.vendor;
        let deviceInfo = 'Unknown device';

        if (/android/i.test(userAgent)) {
            deviceInfo = "Android device";
        } else if (/iPad|iPhone|iPod/.test(userAgent)) {
            if (/iPhone/.test(userAgent)) {
                deviceInfo = "iPhone";
                if (/iPhone OS 13_/.test(userAgent)) {
                    deviceInfo += " (Possibly iPhone 8 Plus or later)";
                }
                // Bạn có thể thêm các điều kiện khác để xác định các model khác
            } else if (/iPad/.test(userAgent)) {
                deviceInfo = "iPad";
            }
        } else if (/Macintosh/.test(userAgent)) {
            deviceInfo = "Macintosh";
        } else if (/Windows/.test(userAgent)) {
            deviceInfo = "Windows PC";
        } else if (/Linux/.test(userAgent)) {
            deviceInfo = "Linux";
        }

        alert(`Device Info: ${deviceInfo}\nUser Agent: ${userAgent}`);
    }, []);

    return null; // Component không cần hiển thị gì, chỉ để chạy code
};

export default DeviceInfo;
