// import React, { useEffect, useRef, useState } from 'react';
// import { Canvas, useFrame } from '@react-three/fiber';
// import axios from 'axios';

// const RotatingCube = () => {
//   const meshRef = useRef();
//   const [gyroData, setGyroData] = useState({ x: 0, y: 0, z: 0 });

//   useEffect(() => {
//     const interval = setInterval(() => {
//       axios.get('http://localhost:3001/api/sensor')
//         .then((res) => {
//           const { gyro } = res.data;
//           setGyroData(gyro);
//         })
//         .catch((err) => console.error('Error fetching sensor data:', err));
//     }, 100); // Fetch every 100 ms

//     return () => clearInterval(interval);
//   }, []);

//   useFrame((state, delta) => {
//     if (meshRef.current) {
//       meshRef.current.rotation.x += gyroData.x * delta;
//       meshRef.current.rotation.y += gyroData.y * delta;
//       meshRef.current.rotation.z += gyroData.z * delta;
//     }
//   });

//   return (
//     <mesh ref={meshRef}>
//       <boxGeometry />
//       <meshStandardMaterial color="#4fd1c5" />
//     </mesh>
//   );
// };

// const Scene = () => {
//   return (
//     <Canvas camera={{ position: [3, 3, 3] }}>
//       <ambientLight />
//       <pointLight position={[10, 10, 10]} />
//       <RotatingCube />
//     </Canvas>
//   );
// };

// export default Scene;


import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import axios from 'axios';

const RotatingCube = () => {
  const meshRef = useRef();
  const [rotation, setRotation] = useState({ x: 0, y: 0, z: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      axios.get('http://localhost:3001/api/sensor')
        .then((res) => {
          const { gyro } = res.data;
          setRotation(prev => ({
            x: prev.x + gyro.x * 0.1,
            y: prev.y + gyro.y * 0.1,
            z: prev.z + gyro.z * 0.1
          }));
        })
        .catch((err) => console.error('Error fetching sensor data:', err));
    }, 100);

    return () => clearInterval(interval);
  }, []);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x = rotation.x;
      meshRef.current.rotation.y = rotation.y;
      meshRef.current.rotation.z = rotation.z;
    }
  });

  return (
    <mesh ref={meshRef} scale={[1.5, 1.5, 1.5]}>
      <boxGeometry />
      <meshStandardMaterial color="#4fd1c5" />
    </mesh>
  );
};

const FlexVisuals = () => {
  const [flexValues, setFlexValues] = useState([0, 0, 0]);

  useEffect(() => {
    const interval = setInterval(() => {
      axios.get('http://localhost:3001/api/sensor')
        .then((res) => setFlexValues(res.data.flex))
        .catch((err) => console.error('Error fetching flex data:', err));
    }, 300);

    return () => clearInterval(interval);
  }, []);

  const getColor = (value) => {
    if (value >= 500) return 'red';
    if (value >= 200) return 'yellow';
    return 'green';
  };

  return (
    <div className="flex gap-4 mt-4 justify-center">
      {flexValues.map((val, idx) => (
        <div key={idx} style={{ backgroundColor: getColor(val), height: '100px', width: '30px' }} />
      ))}
    </div>
  );
};

const MusicPlayer = () => {
  const [trackIndex, setTrackIndex] = useState(0);
  const audioRef = useRef();
  const tracks = ['/1.mp3', '/2.mp3', '/3.mp3'];

  useEffect(() => {
    const interval = setInterval(() => {
      axios.get('http://localhost:3001/api/sensor')
        .then((res) => {
          const gyroY = res.data.gyro.y;
          if (Math.abs(gyroY) > 0.5) {
            setTrackIndex(prev => (prev + 1) % tracks.length);
          }
        })
        .catch(err => console.error('MPU fetch error:', err));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load();
      audioRef.current.play();
    }
  }, [trackIndex]);

  return (
    <div className="text-center mt-6">
      <audio controls ref={audioRef}>
        <source src={tracks[trackIndex]} type="audio/mp3" />
        Your browser does not support the audio element.
      </audio>
      <p className="mt-2">Now Playing: {tracks[trackIndex]}</p>
    </div>
  );
};

const Scene = () => {
  return (
    <div>
      <Canvas camera={{ position: [3, 3, 3] }}>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <RotatingCube />
      </Canvas>
      <FlexVisuals />
      <MusicPlayer />
    </div>
  );
};

export default Scene;