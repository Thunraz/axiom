import * as THREE from 'three';

import Planet from './Planet';
import Player from './Player';
import Star   from './Star';

class GameObjectManager {
    static get(index) {
        if (GameObjectManager.GameObjects == null) {
            GameObjectManager.GameObjects = [];
        }

        if (typeof index === 'number') {
            return GameObjectManager.GameObjects[index];
        }

        const found = GameObjectManager.GameObjects.find(o => o.name === index);

        return found || GameObjectManager.GameObjects;
    }

    static add(gameObject) {
        if (GameObjectManager.GameObjects == null) {
            GameObjectManager.GameObjects = [];
        }

        if (Array.isArray(gameObject)) {
            gameObject.forEach((current) => {
                GameObjectManager.GameObjects.push(current);
            });
        } else {
            GameObjectManager.GameObjects.push(gameObject);
        }
    }

    static update(deltaT, smoothDeltaT) {
        if (GameObjectManager.GameObjects == null) {
            GameObjectManager.GameObjects = [];
        }

        GameObjectManager.GameObjects.forEach((gameObject) => {
            gameObject.update(deltaT, smoothDeltaT, GameObjectManager.GameObjects);
        });
    }

    static updatePositions(deltaT, smoothDeltaT) {
        if (GameObjectManager.GameObjects == null) {
            GameObjectManager.GameObjects = [];
        }

        GameObjectManager.GameObjects.forEach((gameObject) => {
            if (typeof gameObject.updatePosition  === 'function') {
                gameObject.updatePosition(deltaT, smoothDeltaT, GameObjectManager.GameObjects);
            }
        });
    }

    static load(url, scene, callback) {
        function xhrCallback(json) {
            if (json.player) {
                json.player.position = new THREE.Vector3(
                    json.player.position.x,
                    json.player.position.y,
                    json.player.position.z,
                );

                const player = new Player(scene, 'player', json.player);
                GameObjectManager.add(player);

                GameObjectManager.get('player').velocity.setX(json.player.initialVelocity.x);
                GameObjectManager.get('player').velocity.setY(json.player.initialVelocity.y);
                GameObjectManager.get('player').velocity.setZ(json.player.initialVelocity.z);
            }

            if (json.planets) {
                json.planets.forEach((planetOptions) => {
                    planetOptions.color = parseInt(planetOptions.color, 16);
                    planetOptions.position = new THREE.Vector3(
                        planetOptions.position.x,
                        planetOptions.position.y,
                        planetOptions.position.z,
                    );

                    const planet = new Planet(scene, planetOptions.name, planetOptions);
                    GameObjectManager.add(planet);

                    GameObjectManager.get(planetOptions.name).velocity.set(
                        planetOptions.initialVelocity.x,
                        planetOptions.initialVelocity.y,
                        planetOptions.initialVelocity.z,
                    );
                });
            }

            if (json.stars) {
                json.stars.forEach((starOptions) => {
                    starOptions.color = parseInt(starOptions.color, 16);
                    starOptions.position = new THREE.Vector3(
                        starOptions.position.x,
                        starOptions.position.y,
                        starOptions.position.z,
                    );

                    const star = new Star(scene, starOptions.name, starOptions);
                    GameObjectManager.add(star);

                    GameObjectManager.get(starOptions.name).velocity.set(
                        starOptions.initialVelocity.x,
                        starOptions.initialVelocity.y,
                        starOptions.initialVelocity.z,
                    );
                });
            }

            callback();
        }

        const xhr = new XMLHttpRequest();
        xhr.open('get', url, true);
        xhr.responseType = 'json';
        xhr.onload = () => {
            const [status] = xhr.status;
            if (status === 200) {
                return xhrCallback(xhr.response);
            }

            return null;
        };
        xhr.send();
    }
}

export default GameObjectManager;
