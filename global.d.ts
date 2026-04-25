declare module "*.css" {}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ambientLight: any;
      directionalLight: any;
      mesh: any;
      boxGeometry: any;
      meshStandardMaterial: any;
      group: any;
    }
  }
}

export {};
