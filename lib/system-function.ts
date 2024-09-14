import { phuongTienDoOptions, TITLE_LUU_LUONG } from "./system-constant";
import { DuLieuMotLanChay, TinhSaiSoValueTabs } from "./types";

export const getSaiSoDongHo = (formValue: DuLieuMotLanChay) => {
    if (formValue) {
        const VDHCT = formValue.V2 - formValue.V1;
        const VDHC = formValue.Vc2 - formValue.Vc1;
        if (VDHC !== 0) {
            const error = ((VDHCT - VDHC) / VDHC) * 100;
            return Number((Math.round(error * 10000) / 10000).toFixed(3));
        }
    }
    return 0;
};

export const getQ2OrQtAndQ1OrQMin = (isDHDienTu: boolean, ccx: string | null, q: string, r: string) => {
    // Qt:Q2 && Qmin:Q1 
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

    if (isDHDienTu) {
        const qmin = parseFloat(q) / parseFloat(r);
        const qt = 1.6 * qmin;
        return {
            getQ1OrMin: parseFloat(qmin.toFixed(3)),
            getQ2OrQt: parseFloat(qt.toFixed(3))
        };
    } else {
        if (ccx && ccx in heso) {
            const heso_qt = heso[ccx as keyof typeof heso].qt;
            const heso_qmin = heso[ccx as keyof typeof heso].qmin;
            return {
                getQ1OrMin: (heso_qmin) ? parseFloat(q) * heso_qmin : null,
                getQ2OrQt: (heso_qt) ? parseFloat(q) * heso_qt : null,
            };
        } else {
            return {
                getQ1OrMin: null,
                getQ2OrQt: null,
            };
        }
    }
};

export const getVToiThieu = (q: string | number, d: string | number) => {
    // q: m3/h 
    // d: mm
    if (q && d) {

        const qNum = parseFloat(typeof q === 'string' ? q : q.toString());
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
        const values = Object.values(formValues).map(getSaiSoDongHo);

        const result = values.reduce((acc, curr, index) => {
            return index === 0 ? curr : acc - curr;
        }, 0);

        return Number(result.toFixed(3));
    } catch {
        return 0;
    }
}

// TODO: Check dat chuan
// export const isDongHoDatTieuChuan = (q: { title: string; value: string }, hss: number | number) => {
//     if([TITLE_LUU_LUONG.q3, TITLE_LUU_LUONG.q2].includes(q.title)) {
//         return hss >= -2;
//     } else if([TITLE_LUU_LUONG.qn, TITLE_LUU_LUONG.qt].includes(q.title)) {
//         return hss <= 2;
//     } else if (TITLE_LUU_LUONG.q1 === q.title) {
//         return hss >= -5;
//     } else if (TITLE_LUU_LUONG.qmin === q.title) {
//         return hss <= 5;
//     }
//     return null;
// }

export const isDongHoDatTieuChuan = (isQ3: boolean, formHieuSaiSo: { hss: number | null }[]) => {
    const lan1 = formHieuSaiSo[0].hss;
    const lan2 = formHieuSaiSo[1].hss;
    const lan3 = formHieuSaiSo[2].hss;

    if (lan1 && lan2 && lan3) {
        return (isQ3) ? (lan1 >= -2 && lan2 >= -2 && lan3 >= -5) : (lan1 <= 2 && lan2 <= 2 && lan3 <= 5)
    }
    return null;
}