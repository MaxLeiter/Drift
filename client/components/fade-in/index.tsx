// https://www.joshwcomeau.com/snippets/react-components/fade-in/
import styles from './fade.module.css';

const FadeIn = ({
    duration = 300,
    delay = 0,
    children,
    ...delegated
}: {
    duration?: number;
    delay?: number;
    children: React.ReactNode;
    [key: string]: any;
}) => {
    return (
        <div
            {...delegated}
            className={styles.fadeIn}
            style={{
                ...(delegated.style || {}),
                animationDuration: duration + 'ms',
                animationDelay: delay + 'ms',
            }}
        >
            {children}
        </div>
    );
};

export default FadeIn
