export default function Register() {
  return (
    <section style={{ textAlign: "center", padding: "50px" }}>
      <h1>Register</h1>
      <form style={{ display: "inline-block", marginTop: "20px" }}>
        <input type="text" placeholder="Name" style={styles.input} /><br />
        <input type="email" placeholder="Email" style={styles.input} /><br />
        <input type="password" placeholder="Password" style={styles.input} /><br />
        <button style={styles.button}>Register</button>
      </form>
    </section>
  )
}

const styles = {
  input: {
    padding: "10px",
    margin: "10px",
    width: "250px",
  },
  button: {
    padding: "10px 20px",
    background: "#0077ff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
}
