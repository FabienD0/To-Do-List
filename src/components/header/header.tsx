import styles from "./header.module.css"
import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from "next/router";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FC } from 'react';



interface Props {
  searchResultState: [string, React.Dispatch<React.SetStateAction<string>>];
}

export const Header: FC<Props> = ({ searchResultState }) => {

  //STATE from the main page
  const [searchResult, setSearchResult] = searchResultState;

  //STATE from header
  const { user, error, isLoading } = useUser();
  const [logOutMenu, setLogOutMenu] = useState(false);
  const [routeStatus, setRouteStatus] = useState<any>(undefined);


  const router = useRouter();

  //Block special character
  const keyOnly = (e: any) => {
    // let value =  e.target.value;
    if (!e.key.match(/[a-zA-Z0-9,]/) && !e.key.match(" ")) {
      e.preventDefault();
    }
  }
  //Function for the search bar
  const searchTodos = (e: any) => {
    // router.push(`?search=${e.target.value}`)
    setSearchResult(e.target.value.toLowerCase());
  }

  //Re-Render when logged
  useEffect(() => {
  }, [logOutMenu])

  //Function to login
  const handleClick = (e: any) => {
    e.preventDefault()
    router.push("/api/auth/login")
  }

  //Function to logout
  const handleClickLogOut = (e: any) => {
    e.preventDefault()
    router.push("/api/auth/logout")
  }

  //Return if something is loading
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  return (
    <header className={styles.container}>
      <div className={styles.firstDiv}>
        <input onKeyDown={keyOnly} onChange={searchTodos}
          type="text" id="searchBar" name="searchBar" className={styles.searchBar} placeholder="Search" />
      </div>
      {user ?
        <>
          <div onClick={(e) => setLogOutMenu(!logOutMenu)} className={`${styles.secondDiv} ${styles.secondDivHover}`}>
            <div className={styles.profileAvatar}>{user.nickname?.charAt(0).toLocaleUpperCase()}</div>
            <p className={styles.userName}>Hi, {user.nickname}</p>
            {!logOutMenu ? <Image alt="Down Arrow" src="/downArrow.png" width={20} height={20} /> :
              <Image className={styles.arrowUp} alt="Down Arrow" src="/downArrow.png" width={20} height={20} />}
          </div>
          {logOutMenu && <button onClick={handleClickLogOut} className={styles.logOutMenu}>Sign Out</button>}
        </>
        :
        <div className={styles.secondDiv}>
          <button onClick={handleClick} className={styles.loginButton}>Login</button>
        </div>}
    </header>
  );
};
