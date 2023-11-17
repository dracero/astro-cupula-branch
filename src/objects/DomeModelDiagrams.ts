import * as THREE from "three";
import type { InstantValues } from "../models/SphereDomeModel";

export class DomeModelDiagrams extends THREE.Group {
  private sphereLine: THREE.Line<THREE.BufferGeometry, THREE.Material>;
  private contactArrow: THREE.ArrowHelper;
  private angleArc: THREE.Line<THREE.BufferGeometry, THREE.Material>;

  private weightSpan: HTMLSpanElement;
  private contactSpan: HTMLSpanElement;
  private frictionSpan: HTMLSpanElement;
  private thetaSpan: HTMLSpanElement;

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

    // Contact (normal) force
    this.contactArrow = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(), 2, 0xff00ff);
    (this.contactArrow.line.material as THREE.Material).depthTest = false;
    (this.contactArrow.cone.material as THREE.Material).depthTest = false;
    this.add(this.contactArrow);

    // Angle arc
    this.angleArc = new THREE.Line();
    this.angleArc.material.depthTest = false;
    this.angleArc.renderOrder = 1;
    this.add(this.angleArc);

    // HTML text boxes
    this.weightSpan = document.getElementById("weight-force");
    this.contactSpan = document.getElementById("contact-force");
    this.frictionSpan = document.getElementById("friction-force");
    this.thetaSpan = document.getElementById("theta-value");
  }

  update(values: InstantValues) {
    const { PI, atan } = Math;
    const { position, contactForce } = values;

    // Line to sphere
    const lineAttr = this.sphereLine.geometry.getAttribute("position");
    lineAttr.setXYZ(1, position.x, position.y, 0);
    lineAttr.needsUpdate = true;

    // Angle arc
    let theta = atan(position.x / position.y);
    if (theta < 0) theta = PI + theta;
    const arc = new THREE.ArcCurve(0, 0, 3, PI / 2, PI / 2 - theta, true);
    this.angleArc.geometry.setFromPoints(arc.getPoints(16));

    this.thetaSpan.innerText = `θ = ${theta.toFixed(2)}`;

    // Contact arrow
    const contactDir = new THREE.Vector3(contactForce.x, contactForce.y, 0).normalize();
    if (contactDir.lengthSq() == 0) {
      this.contactArrow.visible = false;
      this.contactSpan.innerText = "|| N || = 0";
    } else {
      this.contactArrow.visible = true;
      this.contactArrow.setDirection(contactDir);
      this.contactArrow.position.set(position.x, position.y, 0);
      this.contactSpan.innerText = `|| N || = ${contactForce.length().toFixed(2)}`;
    }
  }
}
