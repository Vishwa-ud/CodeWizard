import Header from "./Header";
import Footer from "./Footer";
import { ShaderGradientCanvas, ShaderGradient } from "shadergradient";
import * as reactSpring from "@react-spring/three";
import * as drei from "@react-three/drei";
import * as fiber from "@react-three/fiber";
import { useScroll, useTransform } from "framer-motion";
import Wiz from "../../assets/wiz.png";

const Home = () => {
  const { scrollY } = useScroll();
  const scale = useTransform(scrollY, [0, 500], [1, 3]); // Adjust the scale range if needed
  return (
    <>
      <Header />

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
          transformOrigin: "center center", // Ensure scaling is centered
        }}
      >
        <ShaderGradient
          control="query"
          urlString="https://www.shadergradient.co/customize?animate=on&axesHelper=off&bgColor1=%23000000&bgColor2=%23000000&brightness=1&cAzimuthAngle=180&cDistance=2.8&cPolarAngle=80&cameraZoom=9.1&color1=%23606080&color2=%238d7dca&color3=%23212121&destination=onCanvas&embedMode=off&envPreset=city&format=gif&fov=45&frameRate=10&gizmoHelper=hide&grain=on&lightType=3d&pixelDensity=1&positionX=0&positionY=0&positionZ=0&range=enabled&rangeEnd=40&rangeStart=0&reflection=0.15&rotationX=50&rotationY=0&rotationZ=-60&shader=defaults&type=waterPlane&uAmplitude=0&uDensity=1.5&uFrequency=0&uSpeed=0.3&uStrength=1.5&uTime=8&wireframe=false"
        />
      </ShaderGradientCanvas>


      <section className="text-gray-600 body-font">
        <div className="container mx-auto flex px-5 py-24 md:flex-row flex-col items-center">
          <div className="lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center">
          <h1 className="title-font sm:text-6xl text-5xl mb-4 font-medium text-blue-100">
              Welcome to
              <br className="hidden lg:inline-block" />
              &nbsp; &nbsp; &nbsp;CodeWizard
            </h1>
            <p className="mb-8 leading-relaxed text-red-100 ">
            Empower your development process with CodeWizard, the ultimate tool for automated code analysis, task management, and issue tracking. Optimize your codebase, stay on top of tasks, and resolve issues effortlessly—all in one platform.
            </p>
            <div className="flex justify-center">
              <button className="inline-flex text-white bg-purple-500 border-0 py-2 px-9  focus:outline-none hover:bg-purple-600 rounded text-lg">
                Get Started
                <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" className="w-4 h-4 ml-1" viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7"></path>
              </svg>
              </button>
            </div>
          </div>
          <div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6">
            <img
              className="object-cover object-center rounded"
              alt="hero"
              src={Wiz}
            />
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Home;
