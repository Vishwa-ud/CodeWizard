import { useState } from "react";
import axios from "axios";
import ReactFlow, { MiniMap, Controls, Background } from "reactflow";
import "reactflow/dist/style.css";
import Header from "../Home/Header";
import { ShaderGradientCanvas, ShaderGradient } from "shadergradient";
import * as reactSpring from "@react-spring/three";
import * as drei from "@react-three/drei";
import * as fiber from "@react-three/fiber";
import { useScroll, useTransform } from "framer-motion";

function CodeSubmission() {
  const { scrollY } = useScroll();
  const scale = useTransform(scrollY, [0, 500], [1, 3]); // Adjust the scale range if needed

  const [codeSnippet, setCodeSnippet] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [flowchartData, setFlowchartData] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setFlowchartData(null);

    if (!codeSnippet.trim()) {
      setError("Please paste a code snippet before submitting.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/generate-flowchart-ag",
        {
          code: codeSnippet,
          language: "python",
        }
      );

      const data = response.data;

      // Validate the response data
      if (!data.nodes || !data.edges) {
        throw new Error("Invalid response: No nodes or edges found.");
      }

      if (!Array.isArray(data.nodes) || !Array.isArray(data.edges)) {
        throw new Error("Invalid flowchart data received from the server.");
      }

      if (data.nodes.length === 0 || data.edges.length === 0) {
        throw new Error("No nodes or edges to display.");
      }

      data.nodes.forEach((node) => {
        if (!node.id || !node.label) {
          throw new Error("Each node must have an id and label.");
        }
      });

      data.edges.forEach((edge) => {
        if (!edge.source || !edge.target) {
          throw new Error("Each edge must have source and target.");
        }
      });

      setFlowchartData(data); // Set flowchart data
    } catch (err) {
      if (err.response) {
        setError(
          err.response?.data?.error ||
            "Server error occurred. Please try again later."
        );
      } else if (err.request) {
        setError(
          "Network error: Failed to make the request. Please check your connection."
        );
      } else {
        setError(err.message || "An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  const getNodeStyle = (nodeId, isStart, isEnd) => {
    if (isStart) {
      return {
        backgroundColor: "black",
        width: "25px",
        height: "25px",
        borderRadius: "50%",
        border: "2px solid white",
      };
    } else if (isEnd) {
      return {
        width: "30px",
        height: "30px",
        borderRadius: "50%",
        backgroundColor: "black",
        border: "3px solid black",
        color: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      };
    } else {
      return {
        padding: "10px",
        borderRadius: "5px",
        backgroundColor: "#e8e8e8",
        border: "1px solid #333",
        whiteSpace: "pre-wrap",
      };
    }
  };

  const getStartAndEndNodeIds = (nodes) => {
    if (nodes.length === 0) return { startId: null, endId: null };

    const startId = nodes.find((node) => node.label === "Start")?.id;
    const endId = nodes.find((node) => node.label === "End")?.id;

    return { startId, endId };
  };

  const { startId, endId } = getStartAndEndNodeIds(flowchartData?.nodes || []);

  const styledNodes =
    flowchartData?.nodes.map((node) => {
      const isStart = node.id === startId;
      const isEnd = node.id === endId;

      return {
        ...node,
        data: { label: node.label },
        style: getNodeStyle(node.id, isStart, isEnd),
      };
    }) || [];

  const styledEdges =
    flowchartData?.edges.map((edge) => ({
      ...edge,
      animated: true,
    })) || [];

  return (
    <>
      <Header p={true} />

      <ShaderGradientCanvas
        importedFiber={{ ...fiber, ...drei, ...reactSpring }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: -1,
          transform: `scale(${scale})`,
          transformOrigin: "center center",
        }}
      >
        <ShaderGradient
          control="query"
          urlString="https://www.shadergradient.co/customize?animate=on&axesHelper=off&bgColor1=%23000000&bgColor2=%23000000&brightness=0.7&cAzimuthAngle=180&cDistance=2.8&cPolarAngle=80&cameraZoom=9.1&color1=%23606080&color2=%238d7dca&color3=%23212121&destination=onCanvas&embedMode=off&envPreset=city&format=gif&fov=45&frameRate=10&gizmoHelper=hide&grain=on&lightType=3d&pixelDensity=1&positionX=0&positionY=0&positionZ=0&range=enabled&rangeEnd=40&rangeStart=0&reflection=0.15&rotationX=50&rotationY=0&rotationZ=-60&shader=defaults&type=waterPlane&uAmplitude=0&uDensity=1.5&uFrequency=0&uSpeed=0.3&uStrength=1.5&uTime=8&wireframe=false"
        />
      </ShaderGradientCanvas>

      <section className="text-gray-400 bg-transparent body-font relative">
        <div className="container px-5 py-24 mx-auto">
          <div className="flex flex-col text-center w-full mb-12">
            <h1 className="sm:text-4xl text-3xl font-medium title-font mb-4 text-white">
              Code to Flowchart
            </h1>
            <p className="lg:w-2/3 mx-auto leading-relaxed text-base">
              Submit your code snippet below to convert it into a flowchart.
            </p>
          </div>
          <div className="lg:w-1/2 md:w-2/3 mx-auto">
            <form onSubmit={handleSubmit} className="flex flex-wrap -m-2">
              <div className="p-2 w-full">
                <div className="relative">
                  <label
                    htmlFor="codeSnippet"
                    className="leading-7 text-sm text-gray-400"
                  >
                    Code Snippet
                  </label>
                  <textarea
                    id="codeSnippet"
                    name="codeSnippet"
                    value={codeSnippet}
                    onChange={(e) => setCodeSnippet(e.target.value)}
                    className="w-full bg-gray-800 bg-opacity-50 rounded border border-gray-700 focus:border-indigo-500 focus:bg-gray-900 focus:ring-2 focus:ring-indigo-900 h-32 text-base outline-none text-white py-2 px-4 resize-none leading-6 transition-colors duration-200 ease-in-out"
                  />
                </div>
                <button
                  type="button"
                  className="mt-2 text-indigo-500 hover:text-indigo-300 text-sm"
                  onClick={() =>
                    setCodeSnippet(
                      `def example():\n  if True:\n    print("This is a quick-paste example!")\n  else:\n    print("Alternative path")`
                    )
                  }
                >
                  Quick Paste Example
                </button>
              </div>
              <div className="p-2 w-full">
                <div className="flex-1">
                  <label className="text-white" htmlFor="country">
                    Programming Language
                  </label>
                  <select
                    className="w-full bg-gray-800 rounded-md border-gray-700 text-white px-2 py-1"
                    id="country"
                  >
                    <option value="">Select a language</option>
                    <option value="py">Python</option>
                    <option value="j" disabled="true">Java</option>
                    <option value="js" disabled="true">Java Script</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="mt-8 flex mx-auto text-white bg-indigo-600 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-500 rounded text-lg"
                >
                  Submit
                </button>
                <div className="flex flex-row space-x-2"></div>
              </div>
              {loading && (
                <div className="p-2 w-full text-center">
                  <p className="text-gray-500">
                    Submitting your code snippet...
                  </p>
                </div>
              )}
              {error && (
                <div className="p-2 w-full text-center">
                  <p className="text-red-500">{error}</p>
                </div>
              )}
            </form>
            {flowchartData && (
             <div
             className="p-2 w-full mt-12"
             style={{
               position: "relative",
               backgroundColor: "rgba(255, 255, 255, 0.1)", 
               borderRadius: "10px", // Optional: add rounded corners
               backdropFilter: "blur(4px)", // Apply blur to background
             }}
           >
             <h2 className="text-2xl font-medium text-white mb-4">
               Generated Flowchart
             </h2>
             <div style={{ height: "500px" }}>
               <ReactFlow nodes={styledNodes} edges={styledEdges} fitView>
                 <MiniMap />
                 <Controls />
                 <Background />
               </ReactFlow>
             </div>
           </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

export default CodeSubmission;
