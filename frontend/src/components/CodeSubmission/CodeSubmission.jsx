import { useState, useEffect } from "react";
import axios from "axios";
import Header from "../Home/Header";
import { ShaderGradientCanvas, ShaderGradient } from "shadergradient";
import * as reactSpring from "@react-spring/three";
import * as drei from "@react-three/drei";
import * as fiber from "@react-three/fiber";
import FlowchartResult from "./FlowchartResult"; // Import new component

function CodeSubmission() {
  const [codeSnippet, setCodeSnippet] = useState("");
  const [language, setLanguage] = useState("python");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [flowchartCode, setFlowchartCode] = useState("");
  const [isValidCode, setIsValidCode] = useState(true); // For real-time validity check

  useEffect(() => {
    // Real-time code validation logic
    if (!codeSnippet.trim()) {
      setIsValidCode(false);
    } else {
      setIsValidCode(true);
    }
  }, [codeSnippet]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setFlowchartCode("");

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
          language: language,
        }
      );

      const data = response.data;

      if (!data.flowchart) {
        throw new Error("Invalid response: No flowchart found.");
      }

      setFlowchartCode(data.flowchart);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "An unexpected error occurred. Please try again later."
      );
    } finally {
      setLoading(false);
    }
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
        }}
      >
        <ShaderGradient
          control="query"
          urlString="https://www.shadergradient.co/customize?animate=on&axesHelper=off&bgColor1=%23000000&bgColor2=%23000000&brightness=0.7&cAzimuthAngle=180&cDistance=2.8&cPolarAngle=80&cameraZoom=9.1&color1=%23606080&color2=%238d7dca&color3=%23212121&destination=onCanvas&embedMode=off&envPreset=city&format=gif&fov=45&frameRate=10&gizmoHelper=hide&grain=on&lightType=3d&pixelDensity=1&positionX=0&positionY=0&positionZ=0&range=enabled&rangeEnd=40&rangeStart=0&reflection=0.15&rotationX=50&rotationY=0&rotationZ=-60&shader=defaults&type=waterPlane&uAmplitude=0&uDensity=1.5&uFrequency=0&uSpeed=0.3&uStrength=1.5&uTime=8&wireframe=false"
        />
      </ShaderGradientCanvas>

      <section className="text-gray-400 bg-transparent body-font relative h-screen">
        <div className="container px-5 py-8 mx-auto flex flex-col h-full">
          <div className="flex flex-col text-center w-full mb-6">
            <h1 className="sm:text-4xl text-3xl font-medium title-font mb-4 text-white">
              Code to Flowchart
            </h1>
            <p className="lg:w-2/3 mx-auto leading-relaxed text-base">
              Paste your code snippet below to convert it into a flowchart.
            </p>
          </div>

          {/* Code Input Section */}
          <div className="flex flex-grow flex-col lg:w-2/3 mx-auto">
            <form onSubmit={handleSubmit} className="h-full flex flex-col">
              <div className="flex-grow">
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
                  className="w-full h-2/3 bg-gray-800 bg-opacity-50 rounded border border-gray-700 focus:border-indigo-500 focus:bg-gray-900 focus:ring-2 focus:ring-indigo-900 text-base outline-none text-white py-2 px-4 resize-none leading-6 transition-colors duration-200 ease-in-out"
                  style={{ minHeight: "50vh" }} // Ensuring it takes 2/3 of the height
                />

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

              {/* Options Section */}
              <div className="flex flex-row justify-between items-center mt-4">
                <div className="flex-1">
                  <label className="text-white" htmlFor="language">
                    Programming Language
                  </label>
                  <select
                    className="w-full bg-gray-800 rounded-md border-gray-700 text-white px-2 py-1"
                    id="language"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                  >
                    <option value="python">Python</option>
                    <option value="js" disabled>
                      JavaScript (Coming soon)
                    </option>
                    <option value="js" disabled>
                      Java (Coming soon)
                    </option>
                  </select>
                </div>

                {/* Real-time Code Validity */}
                <div className="flex-1 text-center">
                  <p className={isValidCode ? "text-green-400" : "text-red-400"}>
                    {isValidCode ? "Valid Code" : "Invalid Code"}
                  </p>
                </div>

                {/* Submit Button */}
                <div className="flex-1">
                  <button
                    type="submit"
                    className="flex mx-auto text-white bg-indigo-600 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-500 rounded text-lg"
                  >
                    Convert to Flowchart
                  </button>
                </div>
              </div>

              {/* Loader and Error Display */}
              {loading && (
                <div className="p-2 w-full text-center mt-4">
                  <p className="text-gray-500">Converting your code...</p>
                </div>
              )}
              {error && (
                <div className="p-2 w-full text-center mt-4">
                  <p className="text-red-500">{error}</p>
                </div>
              )}
            </form>
          </div>

          {/* Flowchart Display */}
          {flowchartCode && <FlowchartResult flowchartCode={flowchartCode} />}
        </div>
      </section>
    </>
  );
}

export default CodeSubmission;
