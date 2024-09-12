import { phuongTienDoOptions } from "./system-constant";
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

    if (!q && !d) {
        return 0;
    }

    const ll_90s = parseFloat(q.toString()) * 90 / 3600 * 1000;
    const ll_200d = 200 * parseFloat(d.toString());

    // console.log(q, ll_200d, ll_90s);

    return Number(Math.max(ll_200d, ll_90s).toFixed(3));
}

export const getHieuSaiSo = (formValues: TinhSaiSoValueTabs) => {
    const lan1 = getSaiSoDongHo(formValues[0]);
    const lan2 = getSaiSoDongHo(formValues[1]);
    const lan3 = getSaiSoDongHo(formValues[2]);

    return Number((lan1 - lan2 - lan3).toFixed(3));
}

export const isDongHoDatTieuChuan = (formHSSValues: { hss: number | null }[]) => {
    const hssQ3_n = formHSSValues[0].hss;
    const hssQ2_t = formHSSValues[1].hss;
    const hssQ1_min = formHSSValues[2].hss;

    return 0;
}