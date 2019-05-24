class Debug {
    // ##############################################
    // # Public functions ###########################
    // ##############################################

    static clear() {
        Debug.checkDebugElement();

        this.debugElement.innerHTML = '';
    }

    static log(message) {
        Debug.checkDebugElement();

        if (typeof message === 'object') {
            this.debugElement.innerHTML += `\n${JSON.stringify(message)}`;
        } else {
            this.debugElement.innerHTML += `\n${message}`;
        }
    }

    static checkDebugElement() {
        if (!this.debugElement) {
            this.debugElement = document.getElementById('debugOutput');
        }
    }
}

export default Debug;
