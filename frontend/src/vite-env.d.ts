/// <reference types="vite/client" />

declare module "*.css" {
  const content: { [key: string]: string };
  export default content;
}

declare module "*.scss" {
  const content: { [key: string]: string };
  export default content;
}

declare module "*.sass" {
  const content: { [key: string]: string };
  export default content;
}
