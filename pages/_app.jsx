import Head from "next/head";
import "node_modules/cropperjs/dist/cropper.css";
import "styles/bootstrap.scss";
import "styles/global.css";

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
