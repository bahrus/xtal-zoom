;
(function () {
    const preserveAspectRatio = 'preserve-aspect-ratio';
    const doNotModify = 'do-not-modify';
    /**
     * `xtal-zoom`
     *  Make a dom element with hard coded sizes behave somewhat responsively.
     *
     * @customElement
     * @polymer
     * @demo demo/index.html
     */
    class XtalZoom extends HTMLElement {
        static get is() { return 'xtal-zoom'; }
        get scale() {
            return this._scale;
        }
        set scale(val) {
            if (this._scale && val.X === this._scale.X && val.Y === this._scale.Y)
                return;
            this._scale = val;
            const style = this.getResizingTarget().style;
            style.transform = `scale(${val.X}, ${val.Y}`;
            style.transformOrigin = '0% 0%';
            this.de('scale', val);
            this.setAttribute('scale', `scale(${val.X}, ${val.Y}`);
        }
        get preserveAspectRatio() {
            return this._preserveAspectRatio;
        }
        set preserveAspectRatio(val) {
            if (val) {
                this.setAttribute(preserveAspectRatio, '');
            }
            else {
                this.removeAttribute(preserveAspectRatio);
            }
        }
        get doNotModify() {
            return this._doNotModify;
        }
        set doNotModify(val) {
            this.setAttribute(doNotModify, val);
        }
        static get observedAttributes() {
            return [
                preserveAspectRatio,
                doNotModify,
            ];
        }
        attributeChangedCallback(name, oldVal, newVal) {
            switch (name) {
                case preserveAspectRatio:
                    this._preserveAspectRatio = newVal !== null;
                    break;
                case doNotModify:
                    this._doNotModify = newVal;
                    break;
            }
        }
        // handleResize(entries){
        //     const contentRect = entries[0].contentRect;
        // }
        getResizingTarget() {
            return this.firstElementChild;
        }
        de(name, value) {
            const newEvent = new CustomEvent(name + '-changed', {
                detail: {
                    value: value
                },
                bubbles: true,
                composed: false,
            });
            this.dispatchEvent(newEvent);
            return newEvent;
        }
        connectedCallback() {
            this._ro = new ResizeObserver(entries => {
                this.handleResize(entries);
            });
            this._ro.observe(this, null);
            this._boundResize = this.handleResize.bind(this);
            window.addEventListener('resize', this._boundResize);
        }
        handleResize(entries) {
            //console.log('zoominprogress = ' + this._zoomInProgress);
            //if(this._zoomInProgress) return;
            //for (let entry of entries) {
            // entry.target.style.borderRadius = Math.max(0, 250 - entry.contentRect.width) + 'px';
            const target = this.getResizingTarget();
            if (!target) {
                setTimeout(() => {
                    this.handleResize(entries);
                }, 100);
                return;
            }
            //const contentRect = entry['contentRect'];
            const contentRect = this.getClientRects()[0];
            console.log(contentRect.width);
            if (this._preserveAspectRatio) {
                const candidateX = contentRect.width / target.clientWidth;
                const candidateY = contentRect.height / target.clientHeight;
                let x = candidateX;
                let y = candidateY;
                // if(x > 1 && y > 1){
                //     x = y = Math.min(x, y);
                // }else if(x < 1 && y < 1){
                //     x = y = Math.max(x, y);
                // }else{
                // }
                if (x < 1 && y < 1) {
                    x = y = Math.max(x, y);
                }
                else {
                    x = y = Math.min(x, y);
                }
                this.scale = {
                    X: x,
                    Y: y
                };
            }
            else if (this._doNotModify) {
                switch (this._doNotModify) {
                    case 'width':
                        this.scale = {
                            X: 1,
                            Y: contentRect.height / target.clientHeight
                        };
                        break;
                    case 'height':
                        this.scale = {
                            X: contentRect.width / target.clientWidth,
                            Y: 1
                        };
                }
            }
            else {
                this.scale = {
                    X: contentRect.width / target.clientWidth,
                    Y: contentRect.height / target.clientHeight,
                };
            }
            //}
        }
        disconnectedCallback() {
            this._ro.disconnect();
            window.removeEventListener('resize', this._boundResize);
        }
    }
    if (customElements.get(XtalZoom.is))
        return;
    customElements.define(XtalZoom.is, XtalZoom);
})();
//# sourceMappingURL=xtal-zoom.js.map