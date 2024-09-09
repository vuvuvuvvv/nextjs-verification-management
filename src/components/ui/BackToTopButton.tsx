import { useEffect, useState } from 'react';
import styles from '@styles/scss/components/back-to-top.module.scss';

export default function BackToTopButton() {
    const [visible, setVisible] = useState(false);
    // const [position, setPosition] = useState({ top: 300, left: 300 });
    // const [isDragging, setIsDragging] = useState(false);
    // const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 250) {
                setVisible(true);
            } else {
                setVisible(false);
            }
        };
        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    // // Kéo thả nút
    // const handleMouseDown = (e: React.MouseEvent) => {
    //     setIsDragging(true);
    //     setDragOffset({ x: e.clientX - position.left, y: e.clientY - position.top });
    // };

    // const handleMouseMove = (e: MouseEvent) => {
    //     if (isDragging) {
    //         setPosition({
    //             left: e.clientX - dragOffset.x,
    //             top: e.clientY - dragOffset.y,
    //         });
    //     }
    // };

    // const handleMouseUp = () => {
    //     setIsDragging(false);
    // };

    // useEffect(() => {
    //     document.addEventListener('mousemove', handleMouseMove);
    //     document.addEventListener('mouseup', handleMouseUp);
    //     return () => {
    //         document.removeEventListener('mousemove', handleMouseMove);
    //         document.removeEventListener('mouseup', handleMouseUp);
    //     };
    // }, [isDragging, dragOffset]);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // if(!visible) {
    //     return <></>;
    // }

    return (
        <div
            className={`${styles.backToTop} shadow ${!visible ? styles.invisible : ''}`}
            // style={{ top: `${position.top}px`, left: `${position.left}px` }}
            // onMouseDown={handleMouseDown}
            onClick={scrollToTop}
        >
            ↑
        </div>
    );
}
