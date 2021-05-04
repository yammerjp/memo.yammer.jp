const Ogp = ({title, path, description, ogImage, ogType}: {title: string, path: string, description: string, ogImage: string, ogType: 'website'|'article'}) => {
    return (
        <>
            <meta property="og:title" content={title}/>
            <meta property="og:image" content={ogImage}/>
            <meta property="og:type" content={ogType}/>
            <meta property="og:description" content={description}/>
            <meta property="og:url" content={"https://memo.basd4g.net" + path}/>
            <meta property="og:locale" content="ja_JP"/>
            <meta property="twitter:card" content="summary_large_image"/>
            <meta property="twitter:site" content="@basd4g"/>
            <meta property="twitter:creator" content="@basd4g"/>

        </>
    )
}
export default Ogp