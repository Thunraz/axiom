'use strict';
define(
    [
        'three',
        'Planet',
        'Star',
        'SpaceShip',
        'Player'
    ],
    function(THREE, Planet, Star, SpaceShip, Player) {
        return class GameObjectManager {
            static get(index) {
                if(GameObjectManager.GameObjects == null) {
                    GameObjectManager.GameObjects = [];
                }

                if(!isNaN(index)) {
                    return GameObjectManager.GameObjects[index]; 
                } else {
                    let found = GameObjectManager.GameObjects.find(function(o) {
                        return o.name == index;
                    });

                    if(found == null) return GameObjectManager.GameObjects;

                    return found;
                }
            }

            static add(gameObject) {
                if(GameObjectManager.GameObjects == null) {
                    GameObjectManager.GameObjects = [];
                }

                if(Array.isArray(gameObject)) {
                    gameObject.forEach(function(current) {
                        GameObjectManager.GameObjects.push(current);
                    });
                } else {
                    GameObjectManager.GameObjects.push(gameObject);
                }
            }

            static update(deltaT, smoothDeltaT) {
                if(GameObjectManager.GameObjects == null) {
                    GameObjectManager.GameObjects = [];
                }

                GameObjectManager.GameObjects.forEach(function(gameObject) {
                    gameObject.update(deltaT, smoothDeltaT, GameObjectManager.GameObjects);
                });
            }

            static updatePositions(deltaT, smoothDeltaT) {
                if(GameObjectManager.GameObjects == null) {
                    GameObjectManager.GameObjects = [];
                }

                GameObjectManager.GameObjects.forEach(function(gameObject) {
                    if(typeof(gameObject.updatePosition) == 'function') {
                        gameObject.updatePosition(deltaT, smoothDeltaT, GameObjectManager.GameObjects);
                    }
                });
            }

            static load(url, scene, callback) {
                function xhrCallback(json) {
                    if(json.player) {
                        json.player.position = new THREE.Vector3(
                            json.player.position.x,
                            json.player.position.y,
                            json.player.position.z
                        );

                        let player = new Player(scene, 'player', json.player);
                        GameObjectManager.add(player);

                        GameObjectManager.get('player').velocity.setX(json.player.initialVelocity.x);
                        GameObjectManager.get('player').velocity.setY(json.player.initialVelocity.y);
                        GameObjectManager.get('player').velocity.setZ(json.player.initialVelocity.z);
                    }

                    if(json.planets) {
                        json.planets.forEach(function(planetOptions) {
                            planetOptions.color = parseInt(planetOptions.color, 16);
                            planetOptions.position = new THREE.Vector3(
                                planetOptions.position.x,
                                planetOptions.position.y,
                                planetOptions.position.z
                            );

                            let planet = new Planet(scene, planetOptions.name, planetOptions);
                            GameObjectManager.add(planet);

                            GameObjectManager.get(planetOptions.name).velocity.set(
                                planetOptions.initialVelocity.x,
                                planetOptions.initialVelocity.y,
                                planetOptions.initialVelocity.z
                            );
                        });
                    }

                    if(json.stars) {
                        json.stars.forEach(function(starOptions) {
                            starOptions.color = parseInt(starOptions.color, 16);
                            starOptions.position = new THREE.Vector3(
                                starOptions.position.x,
                                starOptions.position.y,
                                starOptions.position.z
                            );

                            let star = new Star(scene, starOptions.name, starOptions);
                            GameObjectManager.add(star);

                            GameObjectManager.get(starOptions.name).velocity.set(
                                starOptions.initialVelocity.x,
                                starOptions.initialVelocity.y,
                                starOptions.initialVelocity.z
                            );
                        });
                    }

                    callback();
                }

                let xhr = new XMLHttpRequest();
                xhr.open('get', url, true);
                xhr.responseType = 'json';
                xhr.onload = function() {
                    let status = xhr.status;
                    if (status == 200) {
                        return xhrCallback(xhr.response);
                    } else {
                        return null;
                    }
                };
                xhr.send();
            }
        }
    }
);