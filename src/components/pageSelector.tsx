import Link from 'next/link'
import styles from '../styles/components/pageSelector.module.css'
const PageSelector = ({nowPage, pages}: {nowPage: number, pages: number}) => {
    let pagesArr = []
    for (let n=1; n<=pages; n++) {
        pagesArr.push(n)
    }

    return (
        <div className={styles.pageSelector}>
            {pagesArr.map(p=> {
                if (p===nowPage) {
                    return (
                        <span className={styles.pageSelectorNumberNow} key={p}>{p}</span>
                    )
                }
                if (p===1) {
                    return (
                        <Link href={"/"} key={p}><span className={styles.pageSelectorNumberNotNow}>{p}</span></Link>
                    )
                }
                return (
                    <Link href={"/page/"+p} key={p}><span className={styles.pageSelectorNumberNotNow}>{p}</span></Link>
                )
            })}
        </div>
    )
}
export default PageSelector