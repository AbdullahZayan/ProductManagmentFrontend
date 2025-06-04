import { useState, useEffect } from "react";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { Card, CardContent, CardHeader, CardTitle } from "../components/Cards";
import { Package, Save, Trash2, Search, User } from "lucide-react";
import { format } from "date-fns";
import axios from "axios";
import { Textarea } from "../components/Textarea";

export default function ProductPage({api}) {
  const currentUser = localStorage.getItem("username") || "Unknown User";
  const token = localStorage.getItem("token");

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editedField, setEditedField] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [newProduct, setNewProduct] = useState({
    productCode: "",
    productName: "",
    description: "",
    price: ""
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${api}/api/products`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProducts(res.data);
      } catch (err) {
        console.error("Failed to load products", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((p) =>
    p.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.productCode?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (product) => {
  setEditingId(product._id);

  const savedDraft = localStorage.getItem(`draft-${product._id}`);
  if (savedDraft) {
    setEditForm(JSON.parse(savedDraft));
  } else {
    setEditForm({
      name: product.productName,
      description: product.description,
      price: product.price,
    });
  }
  setEditedField(null);
};

  const handleChange = (field, value) => {
  const updated = { ...editForm, [field]: value };
  setEditForm(updated);
  setEditedField(field);

  if (editingId) {
    localStorage.setItem(`draft-${editingId}`, JSON.stringify(updated));
  }
};

  const handleSave = async (id) => {
    try {
      const payload = {
        productCode: products.find((p) => p._id === id).productCode,
        productName: editForm.name,
        description: editForm.description,
        price: editForm.price,
        lastEditedField: editedField,
      };
      await axios.put(`${api}/api/products/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      localStorage.removeItem(`draft-${id}`);
      setEditingId(null);
      window.location.reload();
    } catch (err) {
      console.error("Save failed", err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`${api}/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handleAddProduct = async () => {
    try {
      await axios.post(`${api}/api/products`, newProduct, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNewProduct({ productCode: "", productName: "", description: "", price: "" });
      window.location.reload();
    } catch (err) {
      console.error("Add product failed", err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Package className="h-8 w-8 text-blue-600 mr-3" />
            <h1 className="text-2xl font-bold">Product Management</h1>
          </div>
          <div className="flex items-center space-x-4">
            <User className="h-5 w-5 mr-1" />
            <span>{currentUser}</span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Add New Product</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-4 gap-4">
            <Input placeholder="Product Code" value={newProduct.productCode} onChange={e => setNewProduct(prev => ({ ...prev, productCode: e.target.value }))} />
            <Input placeholder="Product Name" value={newProduct.productName} onChange={e => setNewProduct(prev => ({ ...prev, productName: e.target.value }))} />
            <Textarea placeholder="Description" value={newProduct.description} onChange={e => setNewProduct(prev => ({ ...prev, description: e.target.value }))} />
            <Input placeholder="Price" value={newProduct.price} onChange={e => setNewProduct(prev => ({ ...prev, price: e.target.value }))} />
            <div className="col-span-4 flex justify-end">
              <Button onClick={handleAddProduct}>+ Add Product</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex justify-between">
            <CardTitle>Product List</CardTitle>
            <Input placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <table className="w-full">
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Price</th>
                    <th>Edited</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product._id}>
                      <td>{product.productCode}</td>
                      <td>
                        {editingId === product._id ? (
                          <Input value={editForm.name} onChange={(e) => handleChange("name", e.target.value)} />
                        ) : (
                          product.productName
                        )}
                      </td>
                      <td>
                        {editingId === product._id ? (
                          <Textarea value={editForm.description} onChange={(e) => handleChange("description", e.target.value)} />
                        ) : (
                          product.description
                        )}
                      </td>
                      <td>
                        {editingId === product._id ? (
                          <Input value={editForm.price} onChange={e => handleChange("price", e.target.value)} />
                        ) : (
                          product.price ? `$${product.price}` : "N/A"
                        )}
                      </td>
                      <td>
  {product.lastEditedAt ? (
    `${product.lastEditedBy?.username || "?"} (${product.lastEditedField || "?"}) at ${format(new Date(product.lastEditedAt), "PPpp")}`
  ) : (
    "N/A"
  )}
</td>
                      <td>
                        {editingId === product._id ? (
                          <>
                            <Button size="sm" onClick={() => handleSave(product._id)}>
                              <Save className="h-4 w-4 mr-1" /> Save
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>
                              Cancel
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button size="sm" variant="outline" onClick={() => handleEdit(product)}>
                              Edit
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleDelete(product._id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
