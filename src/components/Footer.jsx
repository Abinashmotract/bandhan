import React from 'react'

export default function Footer() {
    return (
        <footer style={styles.footer}>
            <p>© {new Date().getFullYear()} MetroManY. All rights reserved.</p>
        </footer>
    )
}

const styles = {
    footer: {
        textAlign: "center",
        padding: "20px",
        background: "#1a1a1a",
        color: "#fff",
        marginTop: "40px",
    },
}
