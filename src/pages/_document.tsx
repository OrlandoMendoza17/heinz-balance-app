import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="es">
      <Head />
      <body>
        <Main />
        <>
          {/* <Portal/> component Root Element */}
          <div id="modal"></div>
          <div id="alert"></div>
        </>        
        <NextScript />
      </body>
    </Html>
  );
}
