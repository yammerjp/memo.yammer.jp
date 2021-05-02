import Link from 'next/link'
const Footer = () => {
    return (
        <footer>
          <div className="footer-inner">
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