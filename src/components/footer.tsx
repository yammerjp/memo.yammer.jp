import styles from './footer.module.css'

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <div>
          <div>©2020-2022 Keisuke Nakayama</div>
          <div>
            <a href='/privacy-policy'>Privacy Policy</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
