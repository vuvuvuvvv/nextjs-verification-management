import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ld from "@styles/scss/components/loading.module.scss"

interface LoadingProps {
    className?: string;
}

export default function Loading({ className }: LoadingProps) {
    const vvv = {
        "hieu_sai_so": [{ "hss": 0 }, { "hss": 0 }, { "hss": 0 }],
        "du_lieu": {
            "Q1": {
                "value": 0.1,
                "lan_chay": {
            "1": { "Tc": 23.5, "Tdh": 23.5, "V1": 0, "V2": "100.0", "Vc1": "0", "Vc2": "100", "Vc": "100" },
            "2": { "Tc": 23.5, "Tdh": 23.5, "V1": 0, "V2": "100.0", "Vc1": "0", "Vc2": "100", "Vc": "100" },
            "3": { "Tc": 23.5, "Tdh": 23.5, "V1": 0, "V2": "100.0", "Vc1": "0", "Vc2": "100", "Vc": "100" }
                }
            },
            "Q2": {
                "value": 0.16,
                "lan_chay": {
            "1": { "Tc": 23.5, "Tdh": 23.5, "V1": 0, "V2": "10.0", "Vc1": "0", "Vc2": "10", "Vc": "100" },
            "2": { "Tc": 23.5, "Tdh": 23.5, "V1": 0, "V2": "100.0", "Vc1": "0", "Vc2": "100", "Vc": "100" },
            "3": { "Tc": 23.5, "Tdh": 23.5, "V1": 0, "V2": "100.0", "Vc1": "0", "Vc2": "100", "Vc": "100" }
                }
            },
            "Q3": {
                "value": 25,
                "lan_chay": {
            "1": { "Tc": 23.5, "Tdh": 23.5, "V1": 0, "V2": "100.0", "Vc1": "0", "Vc2": "100", "Vc": "100" },
            "2": { "Tc": 23.5, "Tdh": 23.5, "V1": 0, "V2": "100.0", "Vc1": "0", "Vc2": "100", "Vc": "100" },
            "3": { "Tc": 23.5, "Tdh": 23.5, "V1": 0, "V2": "100.0", "Vc1": "0", "Vc2": "100", "Vc": "100" }
                }
            },
            "Qmin": null,
            "Qn": null,
            "Qt": null
        },
        "ket_qua": true
    }






    return (
        <div className={`${ld.wraper} ${className}`}>
            <div className={ld.box_loading}>
                <FontAwesomeIcon icon={faSpinner} className={ld.icon} />
            </div>
        </div>
    )
}