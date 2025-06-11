// components/PDFPreviewModal.tsx
import { Modal, Button } from "react-bootstrap";

interface PDFPreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    pdfUrl: string | null;
}

export const PDFPreviewModal = ({ isOpen, onClose, pdfUrl }: PDFPreviewModalProps) => {
    return (
        <Modal className="p-0" show={isOpen} onHide={onClose} size="xl" dialogClassName={`modal-kiem-dinh`}>
            <Modal.Header closeButton>
                <Modal.Title>Xem trước biên bản</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ height: "80vh" }}>
                {pdfUrl ? (
                    <iframe
                        src={pdfUrl}
                        style={{ width: "100%", height: "100%", border: "none" }}
                    />
                ) : (
                    <p>Không có nội dung để hiển thị</p>
                )}
            </Modal.Body>
        </Modal>
    );
};
