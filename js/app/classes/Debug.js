define(
    [],
    function() {
        return class Debug {

            // ##############################################
            // # Public functions ###########################
            // ##############################################

            static clear() {
                Debug._checkDebugElement();

                this.debugElement.innerHTML = '';
            }

            static log(message) {
                Debug._checkDebugElement();

                if(typeof(message) == 'object') {
                    this.debugElement.innerHTML += '\n' + JSON.stringify(message);
                } else {
                    this.debugElement.innerHTML += '\n' + message;
                }
            }

            static _checkDebugElement() {
                if(!this.debugElement) this.debugElement = document.getElementById('debugOutput');
            }

        }
    }
);