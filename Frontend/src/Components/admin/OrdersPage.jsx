function OrdersPage({

  styles,
  orders,
  totalRevenue,
  todaySales,
  weekSales,
  monthSales,

  orderFilter,
  setOrderFilter,

  updateOrderStatus,

  orderSearch,
  setOrderSearch,

  orderDateFilter,
  setOrderDateFilter,

}) {

  return (

    <>

      {/* TOP ANALYTICS */}
      <div style={styles.ordersStats}>

        <div style={styles.orderCard}>
          <h2>{orders.length}</h2>
          <p>Total Orders</p>
        </div>

        <div style={styles.orderCard}>
          <h2>₹ {totalRevenue}</h2>
          <p>Total Revenue</p>
        </div>

        <div style={styles.orderCard}>
          <h2>₹ {todaySales}</h2>
          <p>Today Sales</p>
        </div>

        <div style={styles.orderCard}>
          <h2>₹ {weekSales}</h2>
          <p>Week Sales</p>
        </div>

        <div style={styles.orderCard}>
          <h2>₹ {monthSales}</h2>
          <p>Month Sales</p>
        </div>

      </div>

      {/* FILTERS */}
      <div style={styles.filterRow}>

          <input
            type="text"
            placeholder="Search Product / Customer"
            style={styles.search}
            value={orderSearch}
            onChange={(e) =>
              setOrderSearch(e.target.value)
            }
          />

          <input
            type="date"
            style={styles.search}
            value={orderDateFilter}
            onChange={(e) =>
              setOrderDateFilter(e.target.value)
            }
          />

        {[
          "All",
          "Pending",
          "Delivered",
          "Cancelled"
        ].map((item) => (

          <button
            key={item}
            onClick={() =>
              setOrderFilter(item)
            }
            style={
              orderFilter === item
                ? styles.activeFilter
                : styles.filterBtn
            }
          >
            {item}
          </button>

        ))}

      </div>

      {/* TABLE */}
      <div style={styles.ordersTableBox}>

        <table style={styles.table}>

          <thead>

            <tr>

              <th style={styles.th}>
                Product
              </th>

              <th style={styles.th}>
                Customer
              </th>

              <th style={styles.th}>
                Phone
              </th>

              <th style={styles.th}>
                Amount
              </th>

              <th style={styles.th}>
                Status
              </th>

              <th style={styles.th}>
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

           {orders

          .filter((order) => {

            // ✅ STATUS FILTER
            const matchesStatus =

              orderFilter === "All"

                ? true

                : order.status ===
                  orderFilter;

            // ✅ SEARCH FILTER
            const matchesSearch =

              order.product_name
                .toLowerCase()
                .includes(
                  orderSearch.toLowerCase()
                )

              ||

              order.full_name
                .toLowerCase()
                .includes(
                  orderSearch.toLowerCase()
                );

            // ✅ DATE FILTER
            const matchesDate =

              orderDateFilter

                ? order.created_at
                    ?.split("T")[0] ===
                  orderDateFilter

                : true;

            return (

              matchesStatus &&
              matchesSearch &&
              matchesDate

            );

          })

         
              .map((order) => (
                <tr key={order.id}>

                  <td style={styles.td}>
                    {order.product_name}
                  </td>

                  <td style={styles.td}>
                    {order.full_name}
                  </td>

                  <td style={styles.td}>
                    {order.phone}
                  </td>

                  <td style={styles.td}>
                    ₹ {order.amount}
                  </td>

                  <td style={styles.td}>

                    <span
                      style={{
                        color:
                          order.status === "Delivered"
                            ? "green"
                            : order.status === "Cancelled"
                            ? "red"
                            : "#f59e0b",
                        fontWeight: "bold"
                      }}
                    >

                      {order.status}

                    </span>

                  </td>

                  <td style={styles.td}>

                    <div
                      style={{
                        display: "flex",
                        gap: "10px"
                      }}
                    >

                      <button
                        style={styles.deliverBtn}
                        onClick={() =>
                          updateOrderStatus(
                            order.id,
                            "Delivered"
                          )
                        }
                      >
                        Delivered
                      </button>

                      <button
                        style={styles.cancelBtn}
                        onClick={() =>
                          updateOrderStatus(
                            order.id,
                            "Cancelled"
                          )
                        }
                      >
                        Cancel
                      </button>

                    </div>

                  </td>

                </tr>

              ))}

          </tbody>

        </table>

      </div>

    </>

  );

}

export default OrdersPage;