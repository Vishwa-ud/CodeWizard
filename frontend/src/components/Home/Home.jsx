import Header from "./Header";
import Footer from "./Footer";
import { ShaderGradientCanvas, ShaderGradient } from "shadergradient";
import * as reactSpring from "@react-spring/three";
import * as drei from "@react-three/drei";
import * as fiber from "@react-three/fiber";
import { useScroll, useTransform, motion } from "framer-motion";
import Wiz from "../../assets/wiz.png";

const Home = () => {
  const { scrollY } = useScroll();
  const scale = useTransform(scrollY, [0, 500], [1, 3]); // Adjust the scale range if needed

  // Animation variants for elements
  const headerVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0, transition: { duration: 1 } },
  };

  const heroTextVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 1.2, delay: 0.3 } },
  };

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.8, delay: 0.6 } },
    hover: { scale: 1.05 },
  };

  const imageVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 1.2, delay: 0.6 } },
  };

  return (
    <>
      <motion.div initial="hidden" animate="visible" variants={headerVariants}>
        <Header p={false} />
      </motion.div>

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
          urlString="https://www.shadergradient.co/customize?animate=on&axesHelper=off&bgColor1=%23000000&bgColor2=%23000000&brightness=0.9&cAzimuthAngle=180&cDistance=2.8&cPolarAngle=80&cameraZoom=9.1&color1=%23606080&color2=%238d7dca&color3=%23212121&destination=onCanvas&embedMode=off&envPreset=city&format=gif&fov=45&frameRate=10&gizmoHelper=hide&grain=on&lightType=3d&pixelDensity=1&positionX=0&positionY=0&positionZ=0&range=enabled&rangeEnd=40&rangeStart=0&reflection=0.15&rotationX=50&rotationY=0&rotationZ=-60&shader=defaults&type=waterPlane&uAmplitude=0&uDensity=1.5&uFrequency=0&uSpeed=0.3&uStrength=1.5&uTime=8&wireframe=false"
        />
      </ShaderGradientCanvas>

      <section className="text-gray-600 body-font">
        <div className="container mx-auto flex px-5 py-24 md:flex-row flex-col items-center">
          <motion.div
            className="lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center"
            initial="hidden"
            animate="visible"
            variants={heroTextVariants}
          >
            <h1 className="title-font sm:text-6xl text-5xl mb-4 font-medium text-blue-100">
              Welcome to
              <br className="hidden lg:inline-block" />
              &nbsp; &nbsp; &nbsp;CodeWizard
            </h1>
            <p className="mb-8 leading-relaxed text-red-100">
              Empower your development process with CodeWizard, the ultimate
              tool for automated code analysis, task management, and issue
              tracking. Optimize your codebase, stay on top of tasks, and
              resolve issues effortlessly—all in one platform.
            </p>
            <motion.div
              className="flex justify-center"
              variants={buttonVariants}
              whileHover="hover"
            >
              <button
                className="relative group overflow-hidden px-6 h-12 rounded-full flex space-x-2 items-center bg-gradient-to-r from-pink-500 to-purple-500 hover:to-purple-600"
                onClick={() => {
                  window.location.href = "/generate";
                }}
              >
                <span className="relative text-sm text-white">Get Started</span>
                <div className="flex items-center -space-x-3 translate-x-3">
                  <div className="w-2.5 h-[1.6px] rounded bg-white origin-left scale-x-0 transition duration-300 group-hover:scale-x-100"></div>
                  <svg
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-5 w-5 stroke-white -translate-x-2 transition duration-300 group-hover:translate-x-0"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M9 5l7 7-7 7"></path>
                  </svg>
                </div>
              </button>
            </motion.div>
          </motion.div>
          <motion.div
            className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6"
            initial="hidden"
            animate="visible"
            variants={imageVariants}
          >
            <img
              className="object-cover object-center rounded"
              alt="hero"
              src={Wiz}
            />
          </motion.div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Home;
