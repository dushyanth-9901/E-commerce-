function ProductsPage({

  styles,

  form,
  setForm,

  addProduct,

  search,
  setSearch,

  filteredProducts,

  showProducts,
  setShowProducts,

  editProduct,
  deleteProduct,

  categoryFilter,
  setCategoryFilter,

  lowStockOnly,
  setLowStockOnly,

  maxPrice,
  setMaxPrice,
  

}) {

  return (

    <>

      {/* TOP HEADER */}
      <div style={styles.productsTop}>

        <h2>
          Product Management 📦
        </h2>

        <button
          style={styles.showBtn}
          onClick={() =>
            setShowProducts(!showProducts)
          }
        >
          {showProducts
            ? "Hide Products"
            : "Show Products"}
        </button>

      </div>

      {/* ADD PRODUCT FORM */}
      <div style={styles.formBox}>

        <h2>Add New Product</h2>

        <input
          type="text"
          placeholder="Product Name"
          style={styles.input}
          value={form.name}
          onChange={(e) =>
            setForm({
              ...form,
              name: e.target.value
            })
          }
        />

        <input
          type="number"
          placeholder="Price"
          style={styles.input}
          value={form.price}
          onChange={(e) =>
            setForm({
              ...form,
              price: e.target.value
            })
          }
        />

        <input
          type="text"
          placeholder="Category"
          style={styles.input}
          value={form.category}
          onChange={(e) =>
            setForm({
              ...form,
              category: e.target.value
            })
          }
        />

        <input
          type="number"
          placeholder="Stock"
          style={styles.input}
          value={form.stock}
          onChange={(e) =>
            setForm({
              ...form,
              stock: e.target.value
            })
          }
        />

        <textarea
          placeholder="Product Description"
          style={styles.textarea}
          value={form.description}
          onChange={(e) =>
            setForm({
              ...form,
              description: e.target.value
            })
          }
        />

        <input
          type="text"
          placeholder="Image URL 1"
          style={styles.input}
          value={form.image}
          onChange={(e) =>
            setForm({
              ...form,
              image: e.target.value
            })
          }
        />

        <input
          type="text"
          placeholder="Image URL 2"
          style={styles.input}
          value={form.image2 || ""}
          onChange={(e) =>
            setForm({
              ...form,
              image2: e.target.value
            })
          }
        />

        <input
          type="text"
          placeholder="Image URL 3"
          style={styles.input}
          value={form.image3 || ""}
          onChange={(e) =>
            setForm({
              ...form,
              image3: e.target.value
            })
          }
        />

        <button
          style={styles.addBtn}
          onClick={addProduct}
        >
          Add Product
        </button>

      </div>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search Products..."
        style={styles.search}
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
      />
      <div style={styles.filterRow}>

          {/* CATEGORY */}
          <select
            value={categoryFilter}
            onChange={(e) =>
              setCategoryFilter(
                e.target.value
              )
            }
            style={styles.input}
          >

            <option value="All">
              All Categories
            </option>

            <option value="Electronics">
              Electronics
            </option>

            <option value="Fashion">
              Fashion
            </option>

            <option value="Shoes">
              Shoes
            </option>

          </select>

          {/* PRICE */}
          <input
            type="number"
            placeholder="Max Price"
            value={maxPrice}
            onChange={(e) =>
              setMaxPrice(
                e.target.value
              )
            }
            style={styles.input}
          />

          {/* LOW STOCK */}
          <label>

            <input
              type="checkbox"
              checked={lowStockOnly}
              onChange={() =>
                setLowStockOnly(
                  !lowStockOnly
                )
              }
            />

            Low Stock

          </label>

        </div>

      {/* PRODUCTS LIST */}
      {showProducts && (

        <div style={styles.productsGrid}>

          {filteredProducts.map((item) => (

            <div
              key={item.id}
              style={styles.productCard}
            >

              {/* IMAGE */}
              <img
                src={item.image}
                alt={item.name}
                style={styles.productImage}
              />

              {/* NAME */}
              <h3>
                {item.name}
              </h3>

              {/* PRICE */}
              <p style={styles.productPrice}>
                ₹ {item.price}
              </p>

              {/* STOCK */}
              <p>
                Stock: {item.stock}
              </p>

              {/* DESCRIPTION */}
              <p style={styles.productDesc}>
                {
                  item.description
                  || "No Description"
                }
              </p>

              {/* ACTION BUTTONS */}
              <div style={styles.actionBtns}>

                <button
                  style={styles.editBtn}
                  onClick={() =>
                    editProduct(item)
                  }
                >
                  Edit
                </button>

                <button
                  style={styles.deleteBtn}
                  onClick={() =>
                    deleteProduct(item.id)
                  }
                >
                  Delete
                </button>

              </div>

            </div>

          ))}

        </div>

      )}

    </>

  );

}

export default ProductsPage;