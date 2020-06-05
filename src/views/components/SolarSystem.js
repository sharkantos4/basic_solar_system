import React from 'react';
import * as THREE from 'three';


class SolarSystem extends React.Component {
    constructor(props) {
        super (props);
        this.state = {

        }
    }

    componentDidMount() {
        this.makeSolarSystem();
    }

    async makeSolarSystem() {
        const canvas = document.getElementById('canvas_solar_system');
        const renderer = new THREE.WebGLRenderer({canvas});
        renderer.setSize( window.innerWidth, window.innerHeight );

        const fov = 50;
        const aspect = window.innerWidth / window.innerHeight;
        const near = 0.1;
        const far = 1000;
        const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        camera.position.z = 100;
        camera.position.y = -100;
        camera.lookAt(0, 0, 0);

        const scene = new THREE.Scene();

        let objectsInSolarSystem = [];    // Meshes
        let objectsForRotationAroundSun = [];   // THREE.Object3D()
        let objectsForRotationAroundThemselves = [];     // THREE.Object3D()
        let speedsAroundSun = [     // Measured compared to an earth year (take 1 / speed to get relative speed around sun)
            0.24,
            0.615,
            1,          // Earth
            1.88,
            11.86,
            29.46,
            84.01,
            164.79
        ];
        let speedsAroundThemselves = [      // Relative to earth year (take 1 / speed to get speed of rotation)
            0.16,
            0.67,
            0.00274,    // Earth
            0.00282,
            0.00112,
            0.00123,
            0.00197,
            0.00184,
        ];
        let scales = [
            0.3,    // Mercury
            0.4,    // Venus
            0.4,    // Earth
            0.3,    // Mars
            2,      // Jupiter
            2,      // Saturn
            0.6,    // Uranus
            0.6     // Neptune
        ];
        let positions = [
            10,
            20,
            30,
            40,
            70,
            100,
            130,
            150
        ];

        const radius = 1;
        const widthSegments = 20;
        const heightSegments = 20;
        const sphereGeometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);

        // Sun
        const sunLight = 0xFFFFFF;
        const intensity = 1;
        const light = new THREE.PointLight(sunLight, intensity);
        scene.add(light);
        const sunMaterial = new THREE.MeshPhongMaterial({emissive: 0xFFFF00});
        const sun = new THREE.Mesh(sphereGeometry, sunMaterial);
        sun.scale.set(5, 5, 5);
        scene.add(sun);

        // Mercury
        const mercuryMaterial = new THREE.MeshPhongMaterial({color: 0x7F7F7F, emissive: 0x020202});
        const mercury = new THREE.Mesh(sphereGeometry, mercuryMaterial);
        objectsInSolarSystem.push(mercury);

        // Venus
        const venusMaterial = new THREE.MeshPhongMaterial({color: 0xFFA500, emissive: 0x050100});
        const venus = new THREE.Mesh(sphereGeometry, venusMaterial);
        objectsInSolarSystem.push(venus);

        // Earth + moon
        const earthMaterial = new THREE.MeshPhongMaterial({color: 0x2233AA, emissive: 0x112244});
        const earth = new THREE.Mesh(sphereGeometry, earthMaterial);
        objectsInSolarSystem.push(earth);

        // Mars
        const marsMaterial = new THREE.MeshPhongMaterial({color: 0xF00F00, emissive: 0x0F0300});
        const mars = new THREE.Mesh(sphereGeometry, marsMaterial);
        objectsInSolarSystem.push(mars);

        // Jupiter
        const jupiterMaterial = new THREE.MeshPhongMaterial({color: 0x7F7F7F, emissive: 0x020202});
        const jupiter = new THREE.Mesh(sphereGeometry, jupiterMaterial);
        objectsInSolarSystem.push(jupiter);

        // Saturn
        const saturnMaterial = new THREE.MeshPhongMaterial({color: 0xCBBC9B, emissive: 0x120200});
        const saturn = new THREE.Mesh(sphereGeometry, saturnMaterial);
        const saturnRingMaterial = new THREE.MeshPhongMaterial({color: 0xCBBC9B, emissive: 0x120200});
        const innerRadius = 4.6;
        const outerRadius = 7;
        const thetaSegments = 18;
        const saturnRingGeometry = new THREE.RingGeometry(innerRadius, outerRadius, thetaSegments);
        const saturnRing = new THREE.Mesh(saturnRingGeometry, saturnRingMaterial);
        saturnRing.position.x = 100;
        scene.add(saturnRing);
        objectsInSolarSystem.push(saturn);

        // Uranus
        const uranusMaterial = new THREE.MeshPhongMaterial({color: 0x008992, emissive: 0x000305});
        const uranus = new THREE.Mesh(sphereGeometry, uranusMaterial);
        objectsInSolarSystem.push(uranus);

        // Neptune
        const neptuneMaterial = new THREE.MeshPhongMaterial({color: 0x0000BB, emissive: 0x000022});
        const neptune = new THREE.Mesh(sphereGeometry, neptuneMaterial);
        objectsInSolarSystem.push(neptune);

        for (let rotationIndex = 0; rotationIndex < objectsInSolarSystem.length; rotationIndex++) {
            objectsForRotationAroundSun.push(new THREE.Object3D());
            objectsForRotationAroundThemselves.push(new THREE.Object3D());
        }

        let objectIndex = 0;
        for (const object of objectsInSolarSystem) {
            scene.add(objectsForRotationAroundSun[objectIndex]);
            objectsForRotationAroundThemselves[objectIndex].position.x = positions[objectIndex];
            objectsForRotationAroundThemselves[objectIndex].scale.set(scales[objectIndex], scales[objectIndex], scales[objectIndex]);
            objectsForRotationAroundThemselves[objectIndex].add(object);
            objectsForRotationAroundSun[objectIndex].add(objectsForRotationAroundThemselves[objectIndex]);
            objectIndex += 1;
        }

        function animate (time) {
            time *= 0.001;
            let rotationIndex = 0;
            for (const orbitAroundSun of objectsForRotationAroundSun) {
                orbitAroundSun.rotation.z = (1 / speedsAroundSun[rotationIndex]) * time;
                objectsForRotationAroundThemselves[rotationIndex].rotation.y = (1 / speedsAroundThemselves[rotationIndex]) * time;
                rotationIndex += 1;
            }
            saturnRing.rotation.z = (1 / speedsAroundSun[5]) * time;    // TODO: Fix so that ring goes around together with Saturn
            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        }
        requestAnimationFrame(animate);

    }

    render() {
        return (
            <div className="solar_system">
                <canvas id="canvas_solar_system"></canvas>
            </div>
        )
    }
}

export default SolarSystem;