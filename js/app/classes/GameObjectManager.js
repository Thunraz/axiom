'use strict';
define(
    [],
    function() {
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
        }
    }
);