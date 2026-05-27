function Sidebar({
  active,
  setActive
}) {

  return (

    <div style={styles.sidebar}>

      <h2 style={styles.logo}>
        Admin Panel
      </h2>

      <ul style={styles.menu}>

        {[
          "Dashboard",
          "Products",
          "Orders",
          "Users"
        ].map((item) => (

          <li
            key={item}
            onClick={() =>
              setActive(item)
            }
            style={
              active === item
                ? styles.activeMenu
                : styles.menuItem
            }
          >
            {item}
          </li>

        ))}

      </ul>

    </div>

  );

}

const styles = {

  sidebar: {
    width: "250px",
    background: "#111827",
    color: "#fff",
    padding: "30px"
  },

  logo: {
    marginBottom: "40px"
  },

  menu: {
    listStyle: "none",
    padding: 0
  },

  menuItem: {
    padding: "12px",
    marginBottom: "10px",
    cursor: "pointer"
  },

  activeMenu: {
    padding: "12px",
    marginBottom: "10px",
    background: "#6c63ff",
    borderRadius: "8px",
    cursor: "pointer"
  }

};

export default Sidebar;