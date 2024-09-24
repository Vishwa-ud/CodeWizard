import Flowchart from "react-simple-flowchart";
import { motion } from "framer-motion";
import propval from "prop-types";

function FlowchartResult({ flowchartCode }) {
  const opt = {
    x: 0,
    y: 0,
    "line-width": 3,
    "line-length": 50,
    "text-margin": 10,
    "font-size": 14,
    "font-color": "black", // Changed font color inside shapes to black
    "line-color": "white", // Line color to white for better visibility
    "element-color": "black", // Default color of the elements is black
    fill: "white", // Fill color of shapes is white
    "yes-text": "yes",
    "no-text": "no",
    "arrow-end": "block",
    scale: 1.4,
    symbols: {
      start: {
        "font-color": "white", 
        "element-color": "black", // Start node outline color is black
        "fill": "black", // Start node fill color is black
        "font-weight": "bold",
        "line-color": "white", // Line color for start node is white
        "shape": "circle", // Start node shape is a circle
      },
      end: {
        "font-color": "white", // Text inside end node is black
        "element-color": "black", // End node outline color is black
        "fill": "black", // End node fill color is black
        "font-weight": "bold",
        "line-color": "white", // Line color for end node is white
        "shape": "circle", // End node shape is a circle
      },
    },
    "yes-text-color": "white", // Change yes-text color to white
    "no-text-color": "white",  // Change no-text color to white
  };
  

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="p-2 w-full mt-8 flex justify-center" 
    >
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-medium text-white mb-4 text-center">
          Generated Flowchart
        </h2>
        <Flowchart chartCode={flowchartCode} options={opt} />
      </div>
    </motion.div>
  );
}

FlowchartResult.propTypes = {
  flowchartCode: propval.string.isRequired,
};

export default FlowchartResult;
