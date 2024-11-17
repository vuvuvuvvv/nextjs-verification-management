import React from 'react';

const UnsupportedBrowser = () => {
    return (
        <div style={{ padding: '20px' }}>
            <h1>Trình duyệt không được hỗ trợ</h1>
            <p>
                Rất tiếc, trình duyệt của bạn không được hỗ trợ.
                Vui lòng nâng cấp lên phiên bản mới hơn hoặc sử dụng một trình duyệt khác như Google Chrome, Firefox, Safari, hoặc Edge.
            </p>
        </div>
    );
};

export default UnsupportedBrowser;
