import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ld from "@styles/scss/components/loading.module.scss"

interface LoadingProps {
    className?: string;
}

export default function Loading({ className }: LoadingProps) {
    return (
        <div className={`${ld.wraper} ${className}`}>
            <div className={ld.box_loading}>
                <FontAwesomeIcon icon={faSpinner} className={ld.icon} />
            </div>
        </div>
    )
}