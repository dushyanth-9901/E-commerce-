// 🔥 Search Component

function SearchBar({ setSearch }) {

  return (
    <input
      type="text"
      placeholder="Search products..."
      onChange={(e) => setSearch(e.target.value)}
      style={styles.search}
    />
  );
}

const styles = {

  search: {
    width: "100%",
    padding: "14px",
    marginBottom: "20px",
    borderRadius: "10px",
    border: "1px solid #ccc",
    outline: "none",
    fontSize: "16px"
  }
};

export default SearchBar;