import React from "react";

const BasicInformation = ({ result, handleTextChange }) => {
  const handleChange = (e) => {
    handleTextChange((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div>
      <h2 className="text-xl font-bold">Basic Information</h2>
      <input
        type="text"
        name="name"
        value={result?.name || ""}
        onChange={handleChange}
        placeholder="Name"
        className="border p-2 rounded w-full mb-4"
      />
      <input
        type="text"
        name="schoolCode"
        value={result?.schoolCode || ""}
        onChange={handleChange}
        placeholder="School Code"
        className="border p-2 rounded w-full mb-4"
      />
      <input
        type="text"
        name="cityCode"
        value={result?.cityCode || ""}
        onChange={handleChange}
        placeholder="City Code"
        className="border p-2 rounded w-full mb-4"
      />
      <input
        type="text"
        name="class"
        value={result?.class || ""}
        onChange={handleChange}
        placeholder="Class"
        className="border p-2 rounded w-full mb-4"
      />
      <input
        type="date"
        name="date"
        value={result?.date || ""}
        onChange={handleChange}
        className="border p-2 rounded w-full mb-4"
      />
    </div>
  );
};

export default BasicInformation;
