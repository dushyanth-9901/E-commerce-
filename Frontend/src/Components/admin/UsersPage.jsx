function UsersPage({

  users,
  styles

}) {

  // =====================================================
  // 🔥 TODAY USERS
  // =====================================================
  const todayUsers =
    users.filter((user) => {

      if (!user.created_at)
        return false;

      const today =
        new Date().toDateString();

      return (
        new Date(user.created_at)
          .toDateString() === today
      );

    });

  // =====================================================
  // 🔥 WEEK USERS
  // =====================================================
  const weekUsers =
    users.filter((user) => {

      if (!user.created_at)
        return false;

      const now =
        new Date();

      const userDate =
        new Date(user.created_at);

      const diff =
        now - userDate;

      const days =
        diff / (1000 * 60 * 60 * 24);

      return days <= 7;

    });

  return (

    <>

      {/* ===================================================== */}
      {/* 🔥 STATS */}
      {/* ===================================================== */}
      <div style={styles.statsGrid}>

        <div style={styles.card}>
          <h2>{users.length}</h2>
          <p>Total Users</p>
        </div>

        <div style={styles.card}>
          <h2>{todayUsers.length}</h2>
          <p>New Users Today</p>
        </div>

        <div style={styles.card}>
          <h2>{weekUsers.length}</h2>
          <p>Weekly Users</p>
        </div>

      </div>

      {/* ===================================================== */}
      {/* 🔥 RECENT USERS */}
      {/* ===================================================== */}
      <div
        style={{
          ...styles.card,
          marginTop: "30px"
        }}
      >

        <h2>
          Recent Users
        </h2>

        <table style={styles.table}>

          <thead>

            <tr>

              <th style={styles.th}>
                Name
              </th>

              <th style={styles.th}>
                Email
              </th>

              <th style={styles.th}>
                Joined
              </th>

            </tr>

          </thead>

          <tbody>

            {users.map((user) => (

              <tr key={user.id}>

                <td style={styles.td}>
                  {user.name}
                </td>

                <td style={styles.td}>
                  {user.email}
                </td>

                <td style={styles.td}>

                  {
                    user.created_at
                      ?.split("T")[0]
                  }

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </>

  );

}

export default UsersPage;