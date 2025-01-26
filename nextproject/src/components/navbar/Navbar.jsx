import Link from "next/link"
import Links from "./links/Links"
import styles from "./navbar.module.css"

const Navbar = () => {
  return (
    <nav className="container">
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>Nile.</Link>
        <Links />
      </div>
    </nav>
  )
}

export default Navbar