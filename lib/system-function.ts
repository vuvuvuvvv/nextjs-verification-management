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

export const getQtAndQmin = (isDHDienTu: boolean, ccx: string | null, q: string, r: string) => {
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
            getQmin: parseFloat(qmin.toFixed(3)),
            getQt: parseFloat(qt.toFixed(3))
        };
    } else {
        if (ccx && ccx in heso) {
            const heso_qt = heso[ccx as keyof typeof heso].qt;
            const heso_qmin = heso[ccx as keyof typeof heso].qmin;
            return {
                getQmin: (heso_qmin) ? parseFloat(q) * heso_qmin : null,
                getQt: (heso_qt) ? parseFloat(q) * heso_qt : null,
            };
        } else {
            return {
                getQmin: null,
                getQt: null,
            };
        }
    }
};