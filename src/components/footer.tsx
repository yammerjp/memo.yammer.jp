import Link from 'next/link'
import styles from '../styles/components/footer.module.css'
const Footer = () => {
    return (
        <footer className={styles.footer}>
          <div className={styles.footerInner}>
            <div>
            ©2020 Keisuke Nakayama
          </div>
          <div>
            <Link href="/privacy-policy">
              Privacy Policy
            </Link>
          </div>
          </div>
        </footer>
    )
}

export default Footer;