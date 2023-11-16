import * as THREE from "three";

export class DomeModelDiagrams extends THREE.Group {
  private sphereLine: THREE.Line<THREE.BufferGeometry, THREE.Material>;
  private angleArc: THREE.Line<THREE.BufferGeometry, THREE.Material>;

  constructor() {
    super();

    // Axes helper
    const axes = new THREE.AxesHelper(20);
    (axes.material as THREE.Material).depthTest = false;
    axes.renderOrder = 1;
    this.add(axes);

    // Line to sphere
    const sphereLineGeom = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]);
    this.sphereLine = new THREE.Line(sphereLineGeom);
    this.sphereLine.material.depthTest = false;
    this.sphereLine.renderOrder = 1;
    this.add(this.sphereLine);

    // Angle arc
    this.angleArc = new THREE.Line();
    this.angleArc.material.depthTest = false;
    this.angleArc.renderOrder = 1;
    this.add(this.angleArc);
  }

  update(spherePos: THREE.Vector3) {
    const { PI, atan } = Math;

    // Line to sphere
    const lineAttr = this.sphereLine.geometry.getAttribute("position");
    lineAttr.setXYZ(1, spherePos.x, spherePos.y, spherePos.z);
    lineAttr.needsUpdate = true;

    // Angle arc
    let theta = atan(spherePos.x / spherePos.y);
    if (theta < 0) theta = PI + theta;
    const arc = new THREE.ArcCurve(0, 0, 3, PI / 2, PI / 2 - theta, true);
    this.angleArc.geometry.setFromPoints(arc.getPoints(16));
  }
}
