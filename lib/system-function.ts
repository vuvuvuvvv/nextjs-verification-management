import { phuongTienDoOptions } from "./system-constant";
import { ErrorCaculatorValue } from "./types";

export const getErrorCaculatorValue = (formValue: ErrorCaculatorValue) => {
    const VDHCT = formValue.lastNumDHCT - formValue.firstnumDHCT;
    const VDHC = formValue.lastNumDHC - formValue.firstnumDHC;
    if (VDHC !== 0) {
        const error = ((VDHCT - VDHC) / VDHC) * 100;
        return (Math.round(error * 10000) / 10000).toFixed(3) + "%";
    } else {
        return "0%";
    }
};

// export const getLuuLuong = (phuongTienDo: string, ccx: string, {q3, r, qn}: {q3: string, r: string, qn: string}) => {
//     if ((phuongTienDo !== "" && phuongTienDoOptions.find(option => option.label == phuongTienDo)?.value == "1") || (ccx == "1" || ccx == "2")) {
//         const q1 = parseFloat(q3) / parseFloat(r);
//         const q2 = 1.6 * q1;
//         return {
//             qt: q1.toFixed(2),
//             qmin: q2.toFixed(2),
//         };
//     } else {
//         if (ccx == "A") {
//             return {
//                 qt: qn,
//                 qmin: qn,
//             };
//         }
//     }
// };