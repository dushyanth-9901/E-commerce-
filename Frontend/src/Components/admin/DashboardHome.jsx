import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from "recharts";



function DashboardHome({

  products,
  users,
  orders,
  loading

}) {

 

  // =====================================================
  // 🔥 STATS
  // =====================================================
  const totalProducts =
    products.length;

  const totalUsers =
    users.length;

  const totalOrders =
    orders.length;

  const totalRevenue =
    orders.reduce(
      (acc, item) =>
        acc + Number(item.amount || 0),
      0
    );

  const lowStock =
    products.filter(
      (item) => Number(item.stock) < 5
    ).length;

  const deliveredOrders =
    orders.filter(
      (item) =>
        item.status === "Delivered"
    ).length;

  const pendingOrders =
    orders.filter(
      (item) =>
        item.status === "Pending"
    ).length;

  const cancelledOrders =
    orders.filter(
      (item) =>
        item.status === "Cancelled"
    ).length;

  const outOfStock =
    products.filter(
      (item) =>
        Number(item.stock) === 0
    ).length;

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

    }).length;

  // =====================================================
  // 🔥 YESTERDAY USERS
  // =====================================================
  const yesterdayUsers =
    users.filter((user) => {

      if (!user.created_at)
        return false;

      const yesterday =
        new Date();

      yesterday.setDate(
        yesterday.getDate() - 1
      );

      return (
        new Date(user.created_at)
          .toDateString() ===
        yesterday.toDateString()
      );

    }).length;

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

    }).length;

  // =====================================================
  // 🔥 CHART DATA
  // =====================================================
  const salesData = [

    { month: "Jan", sales: 4000 },
    { month: "Feb", sales: 3000 },
    { month: "Mar", sales: 5000 },
    { month: "Apr", sales: 7000 },
    { month: "May", sales: 9000 }

  ];

  const stockData = [

    {
      name: "In Stock",
      value: products.filter(
        (item) => item.stock > 5
      ).length
    },

    {
      name: "Low Stock",
      value: products.filter(
        (item) => item.stock <= 5
      ).length
    }

  ];

  const orderStats = [

    {
      name: "Pending",
      value: pendingOrders
    },

    {
      name: "Delivered",
      value: deliveredOrders
    },

    {
      name: "Cancelled",
      value: cancelledOrders
    }

  ];

  const pieData = [

    {
      name: "Pending",
      value: pendingOrders
    },

    {
      name: "Delivered",
      value: deliveredOrders
    },

    {
      name: "Cancelled",
      value: cancelledOrders
    }

  ];

  const COLORS = [
    "#f59e0b",
    "#10b981",
    "#ef4444"
  ];

  // =====================================================
  // 🔥 LOADING
  // =====================================================
  if (loading) {

    return (

      <h1
        style={{
          textAlign: "center"
        }}
      >
        Loading Dashboard...
      </h1>

    );

  }

  return (

    <>

      {/* STATS */}
      <div style={styles.statsGrid}>

        <div style={styles.card}>
          <h2>{totalProducts}</h2>
          <p>Total Products</p>
        </div>

        <div style={styles.card}>
          <h2>{totalUsers}</h2>
          <p>Total Users</p>
        </div>

        <div style={styles.card}>
          <h2>{totalOrders}</h2>
          <p>Total Orders</p>
        </div>

        <div style={styles.card}>
          <h2>
            ₹ {totalRevenue}
          </h2>
          <p>Total Revenue</p>
        </div>

      </div>

      {/* CHARTS */}
      <div style={styles.chartsGrid}>

        {/* SALES */}
        <div style={styles.card}>

          <h2>Monthly Sales</h2>

          <ResponsiveContainer
            width="100%"
            height={300}
          >

            <BarChart data={salesData}>

              <XAxis dataKey="month" />

              <YAxis />

              <Tooltip />

              <Bar
                dataKey="sales"
                fill="#6c63ff"
              />

            </BarChart>

          </ResponsiveContainer>

        </div>

        {/* REVENUE */}
        <div style={styles.card}>

          <h2>Revenue Growth</h2>

          <ResponsiveContainer
            width="100%"
            height={300}
          >

            <LineChart data={salesData}>

              <XAxis dataKey="month" />

              <YAxis />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="sales"
                stroke="#00b894"
              />

            </LineChart>

          </ResponsiveContainer>

        </div>

        {/* STOCK */}
        <div style={styles.card}>

          <h2>Stock Overview</h2>

          <ResponsiveContainer
            width="100%"
            height={300}
          >

            <PieChart>

              <Pie
                data={stockData}
                dataKey="value"
                outerRadius={100}
                label
              >

                {stockData.map(
                  (entry, index) => (

                    <Cell
                      key={index}
                      fill={COLORS[index]}
                    />

                  )
                )}

              </Pie>

              <Tooltip />

            </PieChart>

          </ResponsiveContainer>

        </div>

        {/* ORDERS BAR */}
        <div style={styles.card}>

          <h2>Orders Analytics</h2>

          <ResponsiveContainer
            width="100%"
            height={300}
          >

            <BarChart data={orderStats}>

              <XAxis dataKey="name" />

              <YAxis />

              <Tooltip />

              <Bar
                dataKey="value"
                fill="#6c63ff"
              />

            </BarChart>

          </ResponsiveContainer>

        </div>

        {/* ORDERS PIE */}
        <div style={styles.card}>

          <h2>Orders Overview</h2>

          <ResponsiveContainer
            width="100%"
            height={300}
          >

            <PieChart>

              <Pie
                data={pieData}
                dataKey="value"
                outerRadius={100}
                label
              >

                {pieData.map(
                  (entry, index) => (

                    <Cell
                      key={index}
                      fill={COLORS[index]}
                    />

                  )
                )}

              </Pie>

              <Tooltip />

            </PieChart>

          </ResponsiveContainer>

        </div>

      </div>

      {/* QUICK INSIGHTS */}
      <div style={styles.card}>

        <h2>Quick Insights</h2>

        <p>✅ Products: {totalProducts}</p>

        <p>👥 Users: {totalUsers}</p>

        <p>🛒 Orders: {totalOrders}</p>

        <p>⚠ Low Stock: {lowStock}</p>

        <p>🆕 Users Today: {todayUsers}</p>

        <p>📅 Yesterday Users: {yesterdayUsers}</p>

        <p>📈 New Users This Week: {weekUsers}</p>

        <p>✅ Delivered Orders: {deliveredOrders}</p>

        <p>⏳ Pending Orders: {pendingOrders}</p>

        <p>❌ Out Of Stock: {outOfStock}</p>

        <p>❌ Cancelled Orders: {cancelledOrders}</p>

      </div>

    </>

  );

}

const styles = {

  statsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(220px,1fr))",
    gap: "20px"
  },

  chartsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(350px,1fr))",
    gap: "20px",
    marginTop: "30px"
  },

  card: {
    background: "#fff",
    padding: "25px",
    borderRadius: "15px"
  }

};

export default DashboardHome;