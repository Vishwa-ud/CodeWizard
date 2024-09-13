// ShaderCanvas.jsx
import PropTypes from 'prop-types';
import { ShaderGradientCanvas, ShaderGradient } from 'shadergradient';
import * as reactSpring from '@react-spring/three';
import * as drei from '@react-three/drei';
import * as fiber from '@react-three/fiber';

function ShaderCanvas({ urlString }) {
  return (
    <ShaderGradientCanvas
      importedFiber={{ ...fiber, ...drei, ...reactSpring }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
      }}
    >
      <ShaderGradient control="query" urlString={urlString} />
    </ShaderGradientCanvas>
  );
}

ShaderCanvas.propTypes = {
  urlString: PropTypes.string.isRequired,
};

export default ShaderCanvas;
