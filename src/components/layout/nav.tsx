import { useEffect, useState } from "react"
import styles from '@/styles/nav.module.css'

const Navbar = () =>{
    const [displayText, setdisplayText] = useState<string>('')

    const text= "POVISUALS";
    const speed = 100;
    // const [isopen, setIsopen] = useState(false)
    const [isMenuOpen, setIsMenuOpen] = useState(false);
  
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    useEffect(() =>{
        let start = 0;
        const interval = setInterval(()=>{
            if(start <= text.length){
                setdisplayText(text.slice(0, start));
                start++;
            }else{
                clearInterval(interval)
            }
        }, speed)
        return () => clearInterval(interval);
    },[text,speed])

    return(
        <>
        <nav className={styles.navbar}>
            {/* Animated Text */}
            <div className={styles.animatedText}>
                {displayText}
                <span className={styles.cursor}>|</span>
            <button className={styles.menutoggle} onClick={toggleMenu}>
                {isMenuOpen ? "X" : "☰"}
            </button>
            </div>

            {/* Nav Links */}
            <ul className={`${styles.navlinks} ${isMenuOpen ? styles.navlinksactive: ''}`}>
                <li><a href="/">Home</a></li>
                <li><a href="/about">About</a></li>
                <li><a href="/portfolio">Portfolio</a></li>
                {/* <li><a href="/contact">GET IN TOUCH</a></li> */}
                <button>GET IN TOUCH</button>
            </ul>
        </nav>
        </>
    )
}

export default Navbar