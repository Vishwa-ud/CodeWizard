import { useState } from "react";
import axios from "axios";
import Flowchart from "react-simple-flowchart";
import { motion } from "framer-motion";
import Header from "../Home/Header";
import { ShaderGradientCanvas, ShaderGradient } from "shadergradient";
import * as reactSpring from "@react-spring/three";
import * as drei from "@react-three/drei";
import * as fiber from "@react-three/fiber";
import { useScroll, useTransform } from "framer-motion";

function CodeSubmission() {
  const { scrollY } = useScroll();
  const scale = useTransform(scrollY, [0, 500], [1, 3]);

  const [codeSnippet, setCodeSnippet] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [flowchartCode, setFlowchartCode] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setFlowchartCode(""); // Clear existing flowchart before generating new one

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

      if (!data.flowchart) {
        throw new Error("Invalid response: No flowchart found.");
      }

      setFlowchartCode(data.flowchart); // Set flowchart data
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
                    <option value="j" disabled="true">
                      Java
                    </option>
                    <option value="js" disabled="true">
                      Java Script
                    </option>
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
                  <p className="text-gray-500">Submitting your code snippet...</p>
                </div>
              )}
              {error && (
                <div className="p-2 w-full text-center">
                  <p className="text-red-500">{error}</p>
                </div>
              )}
            </form>
            {flowchartCode && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="p-2 w-full mt-12"
                style={{
                  position: "relative",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  borderRadius: "10px",
                  backdropFilter: "blur(4px)",
                }}
              >
                <h2 className="text-2xl font-medium text-white mb-4">
                  Generated Flowchart
                </h2>
                <div>
                  <Flowchart chartCode={flowchartCode} options={opt} />
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

export default CodeSubmission;
