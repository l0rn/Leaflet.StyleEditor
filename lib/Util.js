"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("leaflet");
/**
 * Helper functions used throuhgout the project
 */
function setupUtil() {
    L.StyleEditor.Util = L.Class.extend({
        initialize: function (options) {
            if (options) {
                L.setOptions(this, options);
            }
        },
        fireEvent: function (eventName, element) {
            this.options.styleEditorOptions.map.fireEvent(this.options.styleEditorOptions.styleEditorEventPrefix + eventName, element);
        },
        /** fire an event if Leaflet.StyleEditor changed something */
        fireChangeEvent: function (element) {
            this.fireEvent('changed', element);
        },
        /** hide the given element */
        hideElement: function (element) {
            if (element) {
                L.DomUtil.addClass(element, 'leaflet-styleeditor-hidden');
            }
        },
        /** convert rgb to hex of a color
         * @param {string} rgb - rgb representation of the color
         * @param {boolean} noHash - define if return value should not include hash
         */
        rgbToHex: function (rgb, noHash) {
            if (!rgb) {
                rgb = this.options.styleEditorOptions.defaultColor;
                if (rgb.indexOf('#') !== 0) {
                    rgb = '#' + rgb;
                }
            }
            if (rgb.indexOf('#') === 0) {
                if (noHash) {
                    rgb.replace('#', '');
                }
                return rgb;
            }
            if (rgb.indexOf('(') < 0) {
                return '#' + rgb;
            }
            var rgbArray = rgb.substring(4).replace(')', '').split(',');
            var withoutHash = this._componentToHex(parseInt(rgbArray[0], 10)) + this._componentToHex(parseInt(rgbArray[1], 10)) +
                this._componentToHex(parseInt(rgbArray[2], 10));
            if (noHash) {
                return withoutHash;
            }
            return '#' + withoutHash;
        },
        /** get element selected to be styled */
        getCurrentElement: function () {
            if (!this.options.styleEditorOptions.currentElement) {
                return null;
            }
            if (this.options.styleEditorOptions.currentElement.target !== undefined) {
                return this.options.styleEditorOptions.currentElement.target;
            }
            return this.options.styleEditorOptions.currentElement;
        },
        /** set which element is selected to be styled */
        setCurrentElement: function (currentElement) {
            this.options.styleEditorOptions.currentElement.target = currentElement;
        },
        /** does current element have the fill option */
        fillCurrentElement: function () {
            return this.getCurrentElement().options.fill;
        },
        /** get current style of current element */
        getStyle: function (option) {
            var currentElement = this.getCurrentElement();
            var style = currentElement.options[option];
            if (style) {
                return style;
            }
            return null;
        },
        /** set new style to current element */
        setStyle: function (option, value) {
            var currentElement = this.getCurrentElement();
            if (currentElement instanceof L.Marker) {
                this.options.styleEditorOptions.markerType.setStyle(option, value);
            }
            else {
                var newStyle = {};
                newStyle[option] = value;
                currentElement.setStyle(newStyle);
            }
            this.fireChangeEvent(currentElement);
        },
        /** show hidden element */
        showElement: function (element) {
            if (element) {
                L.DomUtil.removeClass(element, 'leaflet-styleeditor-hidden');
            }
        },
        /** helper function to convert color to hex */
        _componentToHex: function (color) {
            var hex = color.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        },
        /** get the markers for a specific color **/
        getMarkersForColor: function (color) {
            color = this.rgbToHex(color);
            var markers = this.options.styleEditorOptions.markerType.options.markers;
            var controlMarkers = this.options.styleEditorOptions.markers;
            if (!Array.isArray(markers)) {
                // if color is specified return specific markers
                if (Object.keys(markers).includes(color)) {
                    markers = markers[color];
                }
                else {
                    markers = markers['default'];
                }
            }
            if (controlMarkers !== null) {
                if (!Array.isArray(controlMarkers)) {
                    var keys = Object.keys(controlMarkers);
                    if (keys.includes(color)) {
                        controlMarkers = controlMarkers[color];
                    }
                    else if (keys.includes('default')) {
                        controlMarkers = controlMarkers['default'];
                    }
                    else {
                        controlMarkers = markers;
                    }
                }
                return markers.filter(function (n) { return controlMarkers.includes(n); });
            }
            return markers;
        },
        /** get default marker for specific color **/
        getDefaultMarkerForColor: function (color) {
            color = this.rgbToHex(color);
            var markers = this.getMarkersForColor(color);
            var defMarkers = [];
            var defaultMarker = this.options.styleEditorOptions.defaultMarkerIcon;
            if (defaultMarker !== null) {
                if (typeof defaultMarker === 'string') {
                    defMarkers.push(defaultMarker);
                }
                if (Object.keys(defaultMarker).includes(color)) {
                    defMarkers.push(defaultMarker[color]);
                }
            }
            defaultMarker = this.options.styleEditorOptions.markerType.options.defaultMarkerIcon;
            if (defaultMarker !== undefined) {
                if (typeof defaultMarker === 'string') {
                    defMarkers.push(defaultMarker);
                }
                if (Object.keys(defaultMarker).includes(color)) {
                    defMarkers.push(defaultMarker[color]);
                }
            }
            defMarkers.filter(function (n) { return markers.includes(n); });
            if (defMarkers.length > 0) {
                return defMarkers[0];
            }
            return markers[0];
        }
    });
}
exports.default = setupUtil;