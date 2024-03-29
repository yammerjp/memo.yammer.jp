import Link from 'next/link'
import styles from './pageSelector.module.css'

const PageSelector = ({ nowPage, pages }: { nowPage: number; pages: number }) => {
  let pagesArr = []
  for (let n = 1; n <= pages; n++) {
    pagesArr.push(n)
  }

  return (
    <div className={styles.pageSelector}>
      {pagesArr.map((p) => {
        if (p === nowPage) {
          return (
            <span className={`${styles.pageSelectorNumber} ${styles.nowPage}`} key={p}>
              {p}
            </span>
          )
        }
        return (
          <Link href={p === 1 ? '/' : '/page/' + p} key={p} passHref>
            <a className={`${styles.pageSelectorNumber} ${styles.notNowPage}`}>{p}</a>
          </Link>
        )
      })}
    </div>
  )
}
export default PageSelector
