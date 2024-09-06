import Flowchart from "react-simple-flowchart";
import { motion } from "framer-motion"; // For optional animations
import propval from "prop-types";

function FlowchartResult({ flowchartCode }) {
  const opt = {
    x: 0,
    y: 0,
    "line-width": 3,
    "line-length": 50,
    "text-margin": 10,
    "font-size": 14,
    "font-color": "black",
    "line-color": "black",
    "element-color": "black",
    fill: "white",
    "yes-text": "yes",
    "no-text": "no",
    "arrow-end": "block",
    scale: 1.4,
    symbols: {
      start: {
        "font-color": "red",
        "element-color": "green",
        "font-weight": "bold",
      },
      end: {
        "font-color": "red",
        "element-color": "green",
        "font-weight": "bold",
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="p-2 w-full mt-8"
    >
      <h2 className="text-2xl font-medium text-white mb-4">Generated Flowchart</h2>
      <Flowchart chartCode={flowchartCode} options={opt} />
    </motion.div>
  );
}

export default FlowchartResult;

FlowchartResult.propTypes = {
    flowchartCode: propval.string.isRequired,
    };
    