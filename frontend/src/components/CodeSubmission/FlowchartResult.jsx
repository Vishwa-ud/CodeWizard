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
    "font-color": "black", // Default font color
    "line-color": "white", // Line color for visibility
    "element-color": "black", // Default element color
    fill: "white", // Fill color for shapes
    "yes-text": "YES",
    "no-text": "NO",
    "arrow-end": "block",
    scale: 1.4,
    symbols: {
      start: {
        "font-color": "white", 
        "element-color": "black", // Outline color
        "fill": "black", // Fill color for start node
        "font-weight": "bold",
        "line-color": "white", // Line color for start node
        "shape": "circle",
      },
      end: {
        "font-color": "white", // End node text color
        "element-color": "black", // Outline color for end node
        "fill": "black", // Fill color for end node
        "font-weight": "bold",
        "line-color": "white", // Line color for end node
        "shape": "circle",
      },
      condition: { // Customize if/else conditions
        "font-color": "black", // Default font color inside condition node
        "element-color": "black", // Outline color for condition node
        "fill": "white", // Fill color for condition node
        "yes-text-color": "white", // Yes text color is now white
        "no-text-color": "white", // No text color is now white
      }
    },
    "yes-text-color": "white",  // Setting YES text color to white
    "no-text-color": "white",   // Setting NO text color to white
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
