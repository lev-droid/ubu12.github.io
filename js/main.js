//import 3d library and movement and control modules
import * as THREE from 'https://cdn.skypack.dev/three@0.128.0';
import {
    PointerLockControls
} from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/controls/PointerLockControls.js';
import {
    GLTFLoader
} from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/loaders/GLTFLoader.js';
//initialise variables 
let scene, renderer, model, light, playerModel, target, levelNumber;
let playerlist = [];
let paused;
let velocity = 1;
let gravity = 0.382;
let gravityVelocity = 0.098
var moveForward = false;
var enemies = [];
let loader = new GLTFLoader(); //initialise our model loader


function setupLevel(levelNumber) {
    let levelLoaded;
    switch (levelNumber) {
        case 1:
            levelLoaded = "assets/ship_in_clouds/scene.gltf"
            break;
        case 2:
            levelLoaded = "assets/the_lighthouse/scene.gltf"
            break;
        case 3:
            levelLoaded = "assets/medieval_fantasy_book/scene.gtlf"
            break;
        case 4:
            levelLoaded = "assets/stylised_sky_player_home_diorama/scene.gtlf"
            break;
        case 5:
            levelLoaded = "assets/sea_keep_lonely_watcher/scene.gtlf"
            break;

    }
    //"The Lighthouse" (https://skfb.ly/6rU7V) by cotman sam is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).
    //"Medieval Fantasy Book" (https://skfb.ly/69Qty) by Pixel is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).
    //"Sea Keep "Lonely Watcher"" (https://skfb.ly/6zvyr) by Artjoms Horosilovs is licensed under CC Attribution-NonCommercial-ShareAlike (http://creativecommons.org/licenses/by-nc-sa/4.0/).
    //"stylised sky player home dioroma" (https://skfb.ly/P6nF) by Sander Vander Meiren is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).
    // "Ship in Clouds" (https://skfb.ly/67IY9) by Bastien Genbrugge is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).
    loader.load(levelLoaded, function(gltf) { //load the level within gtlf and then add it to the main scene
        model = gltf.scene // assign a variable to store the currently rendered level
        model.scale.set(0.5, 0.5, 0.5); // resize the scene to fit the canvas
        scene.add(model);
    }, undefined, function(error) { // error logging
        console.error(error);
    });

}


function init() {


    class Player {
        constructor(direction, vector, camera, controls) {
            this.direction = new THREE.Vector3();
            this.vector = new THREE.Vector3();
            this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);
            this.controls = new PointerLockControls(this.camera, document.body);
            this.geometry = new THREE.BoxGeometry(1, 1, 1);
            this.material = new THREE.MeshBasicMaterial({
                color: 0xffff00
            });
            this.playerModel = new THREE.Mesh(this.geometry, this.material)

        }
        setup() {
            scene.add(this.playerModel)
        }
        update() {
            this.controls.addEventListener('lock', function() {
                paused = false;


                //	instructions.style.display = 'none';
                //	blocker.style.display = 'none';

            });

            this.controls.addEventListener('unlock', function() {

                paused = true;
                //	blocker.style.display = 'block';
                //	instructions.style.display = '';
            });


            velocity = (velocity / 1.01);
            this.camera.getWorldDirection(this.direction);
            this.camera.position.addScaledVector(this.direction, velocity);
            //this.camera.position = this.gravityVector;
            this.camera.position.setY((this.camera.position.y - gravity));

            if (moveForward == true) {
                velocity = velocity + 0.025
            };
            if (this.gravityVelocity > 0.98) {}

            renderer.render(scene, this.camera);
        }
    }

    class Enemy {
        constructor(type, posX, posY) {
            this.type = type;
            this.posX = posX;
            this.posY = posY;
        }
        updatePos() {
            this.posX = +velocity
            this.posY = +velcoty
        }
    }
    class Goal {
        constructor() {
            this.type;
            this.object;
            this.mesh;
            this.material = new THREE.MeshLambertMaterial({
                color: 0xfff380
            });

        }
        setup(type) {
            console.log(type)
            this.type = type;
            switch (this.type) {
                case 1:
                    console.log("Goal created.")
                    this.object = new THREE.IcosahedronGeometry()
                    this.mesh = new THREE.Mesh(this.object, this.material);
                    this.mesh.scale.set(20, 20, 20)
                    this.mesh.position.set(0, 0, 0);
                    scene.add(this.mesh)

            }

        }

    }

    document.addEventListener('click', function() {
        // warning : in current chrome build ther pointer lock api retrurns errors on call. https://bugs.chromium.org/p/chromium/issues/detail?id=1127920
        for (var i = 0; playerlist.length; i++) {
            console.log(playerlist[i])

            playerlist[i].controls.lock();
        }


    }, false);
    playerlist.push(new Player());
    for (var i = 0; i < playerlist.length; i++) {
        playerlist[i].setup
    }
    scene = new THREE.Scene();
    target = new Goal();
    target.setup(1);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    // Light and models
    light = new THREE.AmbientLight(0x404040); // soft white light
    scene.add(light);
    setupLevel(1)
    //animation
    const animate = function() {

        document.getElementById("speed").textContent = " " + velocity;
        document.getElementById("menu").textContent = paused;
        if (paused == false) {
            requestAnimationFrame(animate);
            //player.update()
            for (var i = 0; i < playerlist.length; i++) {

                playerlist[i].update()
                var originPoint = playerlist[i].playerModel.geometry.getAttribute('position');
                var localVertex = new THREE.Vector3();
                var globalVertex = new THREE.Vector3();
                for (let vertexIndex = 0; vertexIndex < originPoint.count; vertexIndex++) {
                    localVertex.fromBufferAttribute(originPoint, vertexIndex);
                    globalVertex.copy(localVertex).applyMatrix4(playerlist[i].playerModel.matrixWorld);
                }
                const directionVector = globalVertex.sub(playerlist[i].playerModel.position);
                var ray = new THREE.Raycaster(playerlist[i].playerModel.position, directionVector.normalize());
                var collisionResults = ray.intersectObjects(target);
                if (collisionResults.length > 0 && collisionResults[0].distance < directionVector.length()) {
                    console.log("collision obect 1");


                }
            }
        };



    };

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////// movement/interaction code ///////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //hook camera with control module
    // add GUI
    // listen for keypresses
    document.addEventListener("keydown", function(KeyboardEvent) {
        if (KeyboardEvent.key == "w") {
            moveForward = true;
        }
    })
    document.addEventListener("keyup", function(KeyboardEvent) {
        if (KeyboardEvent.key == "w") {
            moveForward = false;
        }
    })
    //animate 3d objects
    animate();
}
//start main loop function
init();
