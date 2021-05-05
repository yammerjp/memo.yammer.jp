import Link from 'next/link'
const PageSelector = ({nowPage, pages}: {nowPage: number, pages: number}) => {
    let pagesArr = []
    for (let n=1; n<=pages; n++) {
        pagesArr.push(n)
    }

    return (
        <div className="page-selector">
            {pagesArr.map(p=> {
                if (p===nowPage) {
                    return (
                        <span className="page-selector-number now-page" key={p}>{p}</span>
                    )
                }
                if (p===1) {
                    return (
                        <Link href={"/"} key={p}><span className="page-selector-number">{p}</span></Link>
                    )

                }
                return (
                    <Link href={"/page/"+p} key={p}><span className="page-selector-number">{p}</span></Link>
                )
            })
            }
        </div>
    )
}
export default PageSelector