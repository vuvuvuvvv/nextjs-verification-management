import React from 'react';
import pg from "@styles/scss/components/pagination.module.scss";

interface PaginationProps {
    className?: string;
    currentPage: number;
    totalPage: number;
    handlePageChange: (newPage: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ className, currentPage, totalPage, handlePageChange }) => {
    const numOfButton = 3

    return (totalPage == 0) ? <></> : (
        <div className={`mb-3 ${pg['pagination']} ${className ? className : ''}`}>
            <button type="button" className={`${pg['btn']}`} onClick={() => handlePageChange(1)} disabled={currentPage === 1}>
                ❬❬
            </button>
            <button type="button" className={`${pg['btn']}`} onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                ❬
            </button>

            {currentPage > 2 && totalPage > numOfButton
                &&
                <span>...</span>
            }

            {/* {(currentPage >= 3) &&
                <button
                    type="button"
                    className={`${pg['btn']}`}
                    onClick={() => handlePageChange(currentPage - 2)}>
                    {currentPage - 2}
                </button>
            } */}
            {currentPage >= 2 &&
                <button
                    type="button"
                    className={`${pg['btn']}`}
                    onClick={() => handlePageChange(currentPage - 1)}>
                    {currentPage - 1}
                </button>
            }
            <button
                type="button"
                className={`${pg['btn']} ${pg['active']}`}>
                {currentPage}
            </button>
            {currentPage <= totalPage - 1 &&
                <button
                    type="button"
                    className={`${pg['btn']}`}
                    onClick={() => handlePageChange(currentPage + 1)}>
                    {currentPage + 1}
                </button>
            }
            {/* {currentPage <= totalPage - 2 &&
                <button
                    type="button"
                    className={`${pg['btn']}`}
                    onClick={() => handlePageChange(currentPage + 2)}>
                    {currentPage + 2}
                </button>
            } */}

            {currentPage < totalPage - 1 && totalPage > numOfButton
                &&
                <span>...</span>
            }
            <button type="button" className={`${pg['btn']}`} onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPage}>
                ❭
            </button>
            <button type="button" className={`${pg['btn']}`} onClick={() => handlePageChange(totalPage)} disabled={currentPage === totalPage}>
                ❭❭
            </button>
        </div>
    );
};

export default Pagination;