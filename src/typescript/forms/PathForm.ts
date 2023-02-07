import { Form } from '.'
import { ColorElement, OpacityElement, WeightElement, DashElement, PopupContentElement, } from '../formElements'
import { StyleableLayer, Path } from 'leaflet'
/** Form used to enable modification of a Geometry */
export class PathForm extends Form {
  formElements = {
    'color': ColorElement,
    'opacity': OpacityElement,
    'weight': WeightElement,
    'dashArray': DashElement,
    'popupContent': PopupContentElement
  }

  whenToShow(layers: StyleableLayer[]): Boolean {
    return layers.some(layer => layer instanceof Path)
  }
}