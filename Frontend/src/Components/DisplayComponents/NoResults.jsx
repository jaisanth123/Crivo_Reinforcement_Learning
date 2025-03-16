import { useNavigate } from "react-router-dom";

function NoResults() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <img
        src="https://cdn-icons-png.flaticon.com/512/1255/1255385.png"
        alt="Not found"
        className="w-32 h-32 mb-6"
      />
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        No Results Found
      </h2>
      <p className="text-gray-600 mb-8">
        Please upload an image to see results.
      </p>
      <button
        onClick={() => navigate("/")}
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-full"
      >
        Go to Home
      </button>
    </div>
  );
}

export default NoResults;
