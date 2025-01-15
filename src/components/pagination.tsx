import React from 'react';
import pg from "@styles/scss/components/pagination.module.scss";

interface PaginationProps {
    className?: string;
    currentPage: number;
    totalPage: number;
    totalRecords: number,
    handlePageChange: (newPage: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ className, currentPage, totalPage, totalRecords, handlePageChange }) => {
    return (totalPage == 0) ? <></> : (
        <div className={`w-100 ${pg['pagination']} ${totalRecords > 0 ? "justify-content-between" : "justify-content-center"} ${className ? className : ''}`}>
            {totalRecords > 0 && <small>{totalRecords} bản ghi</small>}
            <div className='d-flex align-items-center gap-2'>
                {/* <button aria-label="Trang đầu" type="button" className={`${pg['btn']}`} onClick={() => handlePageChange(1)} disabled={currentPage === 1}>
                ❬❬
            </button> */}
                <button aria-label="Trang trước" type="button" className={`${pg['btn']}`} onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                    ❬
                </button>

                <span>Trang {currentPage} / {totalPage}</span>


                <button aria-label="Trang sau" type="button" className={`${pg['btn']}`} onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPage}>
                    ❭
                </button>
                {/* <button aria-label="Trang cuối" type="button" className={`${pg['btn']}`} onClick={() => handlePageChange(totalPage)} disabled={currentPage === totalPage}>
                ❭❭
            </button> */}
            </div>
        </div>
    );
};

export default Pagination;