import styles from "./skeleton.module.css"

export default function Skeleton({
    width = 100,
    height = 24,
}: {
    width?: number | string
    height?: number | string
}) {
    return <div className={styles.skeleton} style={{ width, height }} />
}
