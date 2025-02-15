import React from "react";

const FormModal = ({
  title,
  fields = [],
  formData = {},
  setFormData,
  onSubmit,
  onClose,
}) => {
  if (!Array.isArray(fields)) {
    console.error("Fields prop must be an array");
    return null;
  }

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) : value,
    }));
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>
      <div className="bg-gray-800 p-6 rounded-lg w-[400px] relative z-50">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-white text-xl font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-3">
          {fields.map((field) => (
            <div key={field.name} className="mb-4">
              <label
                htmlFor={field.name}
                className="text-gray-300 text-sm mb-1 block"
              >
                {field.label}
              </label>
              {field.type === "textarea" ? (
                <textarea
                  name={field.name}
                  id={field.name}
                  value={formData[field.name] || ""}
                  onChange={handleChange}
                  className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none"
                  required={!field.readOnly}
                  readOnly={field.readOnly}
                  rows="4"
                />
              ) : (
                <input
                  type={field.type}
                  name={field.name}
                  id={field.name}
                  value={formData[field.name] || ""}
                  onChange={handleChange}
                  className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none"
                  required={!field.readOnly}
                  readOnly={field.readOnly}
                  min={field.min}
                  max={field.max}
                />
              )}
            </div>
          ))}

          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            >
              Submit
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormModal;
