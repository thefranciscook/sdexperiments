/* global AFRAME, THREE */

/*const glsl = require('glslify');
const vertexShader = glsl.file('../shaders/vertex.glsl');
const fragmentShader = glsl.file('../shaders/fragment.glsl');*/

AFRAME.registerComponent('material-depth', {

  init: function () {
    this.el.addEventListener('model-loaded', () => this.update());
  },

  /**
   * Apply the material to the current entity.
   */
  update: function () {
    const mesh = this.el.getObject3D('mesh');
    var camera = document.querySelector("[camera]").getObject3D('camera');

    if (mesh) {
      //mesh.material = this.material;
      mesh.material = new THREE.ShaderMaterial({
        vertexShader: document.querySelector( '#post-vert' ).textContent.trim(),
  			fragmentShader: document.querySelector( '#post-frag' ).textContent.trim(),
        uniforms: {
  						cameraNear: { value: camera.near },
  						cameraFar: { value: camera.far },
  						tDiffuse: { value: mesh.texture },
  						tDepth: { value: mesh.depthTexture }
  					}
      });
    }
  },


  tick: function (t) {

  }

})
