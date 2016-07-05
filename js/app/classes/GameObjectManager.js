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
                }
                return GameObjectManager.GameObjects;
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
                    gameObject.updatePosition(deltaT, GameObjectManager.GameObjects);
                });
            }
        }

        return manager;
    }
);