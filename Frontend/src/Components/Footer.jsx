// 📁 src/components/Footer.jsx

function Footer() {

  return (

    <footer style={styles.footer}>

      {/* 🔥 TOP SECTION */}
      <div style={styles.top}>

        {/* 🔹 BRAND */}
        <div>
          <h2 style={styles.logo}>
            ShopZone 🛒
          </h2>

          <p style={styles.text}>
            Your trusted online shopping
            destination for electronics,
            fashion, accessories and more.
          </p>
        </div>



        {/* 🔹 QUICK LINKS */}
        <div>

          <h3 style={styles.heading}>
            Quick Links
          </h3>

          <p style={styles.link}>
            Home
          </p>

          <p style={styles.link}>
            Products
          </p>

          <p style={styles.link}>
            Cart
          </p>

          <p style={styles.link}>
            Login
          </p>

        </div>



        {/* 🔹 CONTACT */}
        <div>

          <h3 style={styles.heading}>
            Contact
          </h3>

          <p style={styles.text}>
            📧 support@shopzone.com
          </p>

          <p style={styles.text}>
            📞 +91 9876543210
          </p>

          <p style={styles.text}>
            📍 Bangalore, India
          </p>

        </div>

      </div>



      {/* 🔥 BOTTOM */}
      <div style={styles.bottom}>

        © 2026 ShopZone.
        All Rights Reserved.

      </div>

    </footer>

  );

}




// 🎨 STYLES
const styles = {

  // 🔥 MAIN FOOTER
  footer: {
    background: "#111",
    color: "#fff",
    marginTop: "50px",
    paddingTop: "40px"
  },



  // 🔥 TOP SECTION
  top: {
    display: "flex",
    justifyContent: "space-around",
    flexWrap: "wrap",
    gap: "30px",
    padding: "20px 40px"
  },



  // 🔥 LOGO
  logo: {
    marginBottom: "15px"
  },



  // 🔥 HEADINGS
  heading: {
    marginBottom: "15px"
  },



  // 🔥 TEXT
  text: {
    color: "#ccc",
    lineHeight: "1.8",
    maxWidth: "250px"
  },



  // 🔥 LINKS
  link: {
    color: "#ccc",
    cursor: "pointer",
    marginBottom: "10px"
  },



  // 🔥 BOTTOM SECTION
  bottom: {
    borderTop: "1px solid #333",
    textAlign: "center",
    padding: "20px",
    marginTop: "20px",
    color: "#aaa"
  }

};

export default Footer;