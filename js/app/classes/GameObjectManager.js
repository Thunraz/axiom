'use strict';
define(
    [],
    function() {
        let manager =  class GameObjectManager {
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
                GameObjectManager.GameObjects.push(gameObject);
            }

            static update(deltaT) {
                if(GameObjectManager.GameObjects == null) {
                    GameObjectManager.GameObjects = [];
                }

                GameObjectManager.GameObjects.forEach(function(gameObject) {
                    gameObject.update(deltaT, GameObjectManager.GameObjects);
                });
            }

            static updatePositions(deltaT) {
                if(GameObjectManager.GameObjects == null) {
                    GameObjectManager.GameObjects = [];
                }

                GameObjectManager.GameObjects.forEach(function(gameObject) {
                    if(typeof(gameObject.updatePosition) == 'function') {
                        gameObject.updatePosition(deltaT, GameObjectManager.GameObjects);
                    }
                });
            }
        }

        return manager;
    }
);