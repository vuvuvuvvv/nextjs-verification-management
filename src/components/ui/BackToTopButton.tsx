import { useEffect, useState } from 'react';
import styles from '@styles/scss/components/back-to-top.module.scss';

export default function BackToTopButton() {
    const [visible, setVisible] = useState(false);
    const [rightPosition, setRightPosition] = useState('-100%');
    let scrollTimeout: NodeJS.Timeout;

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 250) {
                setVisible(true);
            } else {
                setVisible(false);
            }
        };

        const handleScroll = () => {
            setRightPosition('10px');
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                setRightPosition('-100%');
            }, 2000);
        };

        window.addEventListener('scroll', toggleVisibility);
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', toggleVisibility);
            window.removeEventListener('scroll', handleScroll);
            clearTimeout(scrollTimeout);
        };
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div
            className={`${styles.backToTop} shadow ${!visible ? styles.invisible : ''}`}
            style={{ right: rightPosition }}
            onClick={scrollToTop}
        >
            ↑
        </div>
    );
}