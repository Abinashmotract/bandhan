import React, { useEffect, useState } from "react";
import "../styles/Loader.css";
import { motion } from "framer-motion";

const Loader = ({ onComplete }) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      if (onComplete) onComplete();
    }, 4500); // 4.5 sec

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!show) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: '#F5F5F0',
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        zIndex: 9999,
      }}
    >
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
        <motion.div
          initial={{ x: "-100vw", y: "-100vh", opacity: 0 }}
          animate={{ x: 0, y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{ fontSize: "3rem", fontWeight: "bold", color: "#51365F" }}
        >
          Ban
        </motion.div>

        <motion.div
          initial={{ x: "100vw", y: "-100vh", opacity: 0 }}
          animate={{ x: 0, y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          style={{ fontSize: "3rem", fontWeight: "bold", color: "#3A2640" }}
        >
          dh
        </motion.div>

        <motion.div
          initial={{ x: "-100vw", y: "100vh", opacity: 0 }}
          animate={{ x: 0, y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
          style={{ fontSize: "3rem", fontWeight: "bold", color: "#ad1457" }}
        >
          an
        </motion.div>

        <motion.div
          initial={{ x: "100vw", y: "100vh", opacity: 0 }}
          animate={{ x: 0, y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.6 }}
          style={{ fontSize: "3rem", fontWeight: "bold", color: "#6a1b9a" }}
        >
          am
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8, duration: 1 }}
        style={{
          fontSize: "2rem",
          fontWeight: 700,
          marginTop: "1.5rem",
          letterSpacing: "2px",
          background: "linear-gradient(135deg,#51365F,#6a1b9a)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Bandhnam
      </motion.div>
    </div>
  );
}

export default Loader;
