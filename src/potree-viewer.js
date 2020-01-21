import { LitElement, html } from 'lit-element'
import "./tool-bar"
import "gm-beta-potree/build/gm-beta-potree"
import "@geodan/gm-profile-panel/build/dist/gm-profile-panel"
import "@geodan/gm-document-reader/build/dist/gm-document-reader"


class PotreeViewer extends (LitElement) {
  static get properties() {
    return {
      gmconfig: {type: Object},
      datacatalog: Object,
      layerlist: Array,
    }
  }
  parseconfig(config){
    this.thematiclayers = config.map.layers.filter(d=>d.isBaseLayer==false).map(d=>{
      return {
        id: String(d.id),
        minzoom: 5.5,
        maxzoom: 12.5,
        metadata: {
          getFeatureInfoUrl: null,
          legendurl: null,
          maplayeropen: false,
          reference: false,
          title: d.title,
          userlayer: true,
          wms: false
        },
        type: 'ept',
        source: null
      };
    });

    this.backgroundLayers = config.map.layers.filter(d=>d.isBaseLayer==true).map(d=>{
      return {
        id: String(d.id),
        minzoom: 5.5,
        maxzoom: 12.5,
        metadata: {
          getFeatureInfoUrl: null,
          legendurl: null,
          maplayeropen: false,
          reference: false,
          title: d.title,
          userlayer: true,
          wms: false
        },
        type: 'ept',
        source: null
      };
    });

    this.datacatalog = [{
      type: "group",
      title: "puntenwolken",
      sublayers: config.map.layers.map(d=>{
        return {
          id: String(d.id),
          type: "ept",
          title: d.title,
          layerInfo: {
            id: String(d.id)
          }
        };
      })
    }]
  
    let el = this.shadowRoot.querySelector('gm-beta-potree');
    el.gmconfig = config;
      
  }
  updateLayerVisibility(layer){
    console.log(layer);
    let el = this.shadowRoot.querySelector('gm-beta-potree');
    el.toggleVisible(layer.layerid);
  }
  fitBounds(e){
    console.log(e.detail);
    proj4.defs("EPSG:28992","+proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.9999079 +x_0=155000 +y_0=463000 +ellps=bessel +towgs84=565.417,50.3319,465.552,-0.398957,0.343988,-1.8774,4.0725 +units=m +no_defs");
    let point = proj4('EPSG:4326','EPSG:28992',e.detail.point);
    let el = this.shadowRoot.querySelector('gm-beta-potree');
    el.flyTo(point);
  }
  constructor() {
    super();
    let self = this;
    this.datacatalog = null;
    this.layerlist = [];
    document.addEventListener('gm-document-retrieved',function(e) {
      self.parseconfig(e.detail.data);
    })
  }
  render() {
    return html`
      <style>
      :host{
          display: block;
          width: 100%;
          height: 100%;
      }
      #tool-bar {
            position: absolute;
            display: block;
            width: 100%; 
            left: 10px;
            top: 10px;
            box-sizing: border-box;
        }      
      
      #legend-container-container {
        position: absolute;
        display: flex;
        flex-direction: row;
        top: 10px;
        right: 10px;
        justify-content: flex-end;
        transition: right 0.5s ease;
        pointer-events: none;
        box-sizing: border-box;
      }
     
      </style>

      <gm-document-reader
        environment="p"
        gm-fire
        is-public
        is-public-account
        get-data
        account="GEOD5732RESE"
        service="config"
        name="17d55e26-e9d3-40c6-87c8-39baebc05df3"
    ></gm-document-reader>
    <gm-profile-panel logo-url="./images/geodan_beta.png"
        xdisplay-name="Voornaam Achternaam"
        xshow-initials
        geodan-maps-logout-url="https://services.geodan.nl/sso/sp/Logout"
        ahp-logout-url="https://apps.geodan.nl/sso/sp/Logout"
        logout-title="Uitloggen"
        show-menu
        menu-items='[{"title": "GeodanMaps", "url": "https://www.geodanmaps.nl/" }, {"title": "Geodan", "url": "https://www.geodan.nl"}]'></gm-profile-panel>
   
    <gm-beta-potree 
      center="[203064,502020]",
      zoom="14.3",
      bearing="0",
      pitch="45"
    ></gm-beta-potree>
    <tool-bar 
      .thematiclayers="${this.thematiclayers}"
      .backgroundLayers="${this.backgroundLayers}"
      @searchclick="${e=>this.fitBounds(e)}"
      @updatevisibility="${(e) => this.updateLayerVisibility(e.detail)}"
      ></tool-bar>
  `;
  }
}

window.customElements.define('potree-viewer', PotreeViewer);
