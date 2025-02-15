import React from "react";
import FormModal from "./FormModal";

const ProductForm = ({ formData, setFormData, onSubmit, onClose }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const fields = [
    { name: "productId", label: "Product ID", type: "text", readonly: true },
    { name: "item", label: "Item Name", type: "text" },
    { name: "pricePerKilo", label: "Price per Kilo", type: "number" },
    { name: "category", label: "Category", type: "text" },
    { name: "sellerId", label: "Seller ID", type: "text" },
    { name: "quantity", label: "Quantity", type: "number" },
    { name: "harvestDate", label: "Harvest Date", type: "date" },
    { name: "location", label: "Location", type: "text" },
  ];

  return (
    <FormModal
      title="Create New Product"
      fields={fields}
      formData={formData}
      onChange={handleChange}
      onSubmit={onSubmit}
      onClose={onClose}
    />
  );
};

export default ProductForm;
