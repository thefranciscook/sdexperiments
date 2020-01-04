/* globals THREE, AFRAME */
// Initialize our BVH loader
let BVHLoader = new THREE.BVHLoader()

AFRAME.registerComponent('add-bvh', {
schema : {
    file : { default : '' },
    // By default we're going to hide all of our BVH skeletons
    visible : { default : false }
},
setUpBVH: function() {
    this.clock = new THREE.Clock();
    BVHLoader.load( this.data.file, function( result ) {
        result.skeleton.bones = result.skeleton.bones.map((bone) => {
            let geometry = new THREE.SphereGeometry( 1.0, 16, 16)
            let material = new THREE.MeshLambertMaterial( { color : 'blue' } )
            let mesh = new THREE.Mesh( geometry, material )

            this.el.sceneEl.object3D.add(mesh)
            bone.add(mesh)
            return bone
        })

        // A skeleton helper manages the bones & animations for use, yay!
        let skeletonHelper = new THREE.SkeletonHelper( result.skeleton.bones[ 0 ] )
        skeletonHelper.skeleton = result.skeleton; // allow animation mixer to bind to SkeletonHelper directly

        // Uncomment this line below if you want to see the THREE.js skeleton helper for the motion capture data
        // this.el.sceneEl.object3D.add(skeletonHelper)
        // Since we're adding spheres around line 14 for all the bones I chose to not add the SkeletonHelper to the scene,
        // so that it doesn't show up!

        this.boneContainer = new THREE.Group();
        this.boneContainer.add( result.skeleton.bones[ 0 ] );
        let newScale = 0.5
        this.boneContainer.scale.set(newScale, newScale, newScale)

        // this.el.object3D.add( skeletonHelper );
        this.el.object3D.add( this.boneContainer );

        // Actually play the motion capture animation
        this.mixer = new THREE.AnimationMixer( skeletonHelper );
        this.mixer.clipAction( result.clip ).setEffectiveWeight( 1.0 ).play();

        // Print a little check when each animation is done loading
        console.log("✅")
    }.bind(this))
},
init : function () {
    this.el.setAttribute('visible', this.data.visible)
},
tick : function () {
    // Animate the mocap data
    if ( this.mixer ) this.mixer.update( this.clock.getDelta() )
},
update: function () {
    // Set up the BVH skeleton whenever this component (add-bvh) gets updated in the scene.
    this.setUpBVH()
}
})
