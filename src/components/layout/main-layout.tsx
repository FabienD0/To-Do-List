import { Header } from "../header/header";
import { Navbar } from "../navbar/navbar";
import styles from "./main-layout.module.css"
import { Roboto } from '@next/font/google'
import { useState } from "react";

import { FC, ReactElement, cloneElement } from 'react';

export const roboto = Roboto({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
})


interface Props {
  children: ReactElement;
}

const MainLayout: FC<Props> = ({ children }: any) => {

  const [searchResult, setSearchResult] = useState("");
  const childrenWithProps = cloneElement(children, { searchResultState: [searchResult, setSearchResult] });

  return (
    <div className={`${styles.mainContainer} ${roboto.className}`}>
      <Navbar />
      <div className={styles.containerMid}>
        <Header searchResultState={[searchResult, setSearchResult]} />
        {childrenWithProps}
      </div>
    </div>
  );
};

export default MainLayout;

