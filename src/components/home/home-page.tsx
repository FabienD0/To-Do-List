
import Image from "next/image";
import styles from "./home.module.css"
import { dataParameter } from "@/pages";
import { useEffect, useState } from "react";
import { useUser } from '@auth0/nextjs-auth0/client';
import { stat } from "fs";
import { useRouter } from 'next/router'
import { Header } from "../header/header";
import Link from "next/link";


import { FC } from 'react';
import todoDB from "data/todoDB";

interface Props {
  searchResultState: [string, React.Dispatch<React.SetStateAction<string>>];
}

export const HomePage: FC<Props> = ({ searchResultState }) => {




  const iconNoteSize = 25;

  const [userTodos, setUserTodos] = useState<dataParameter>([]);
  const [reloadState, setReloadState] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [searchBar, setSearchBar] = useState(false);
  const [searchResult, setSearchResult] = searchResultState;
  const { user, error, isLoading } = useUser();


  //Re-Render wheen route change
  const router = useRouter()
  const { status } = router.query

  //Re-Render when search bar type
  useEffect(() => {
  }, [searchBar])

  //Re-Render when we change the route
  useEffect(() => {
    const handleRouteChange = () => {
    };

    router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router])

  console.log(user)


  /*========================
  GET ToDos From Server
  ========================*/
  useEffect(() => {
    setFetchLoading(true);
    if (user) {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user?.email, status: status, search: searchResult })
      }
      if (!isLoading && user) {
        fetch(`/api/todo/getAll`, requestOptions)
          .then(res => res.json())
          .then(data => {
            setUserTodos(data.data.sort((a: any, b: any) => {
              const dateA: any = new Date(a.date);
              const dateB: any = new Date(b.date);
              return dateA - dateB;
            }))
            setFetchLoading(false);
          })
      }
    } else {
      if (!window.localStorage.todoDB) {
        console.log("Local Storage Created")
        window.localStorage.setItem('todoDB', JSON.stringify(todoDB));
        setUserTodos(todoDB)
        setFetchLoading(false);
      } else {
        if (status === undefined) {
          const dbLocal = JSON.parse(window.localStorage.getItem("todoDB") || "{}")
          setUserTodos(dbLocal);
          setFetchLoading(false);
        } else if (status === "pending") {
          const dbData = JSON.parse(window.localStorage.todoDB)
          const dbFilter = dbData.filter((data: { completed: boolean; }) => data.completed === false)
          setUserTodos(dbFilter);
          setFetchLoading(false);
        } else if (status === "completed") {
          const dbData = JSON.parse(window.localStorage.todoDB)
          const dbFilter = dbData.filter((data: { completed: boolean; }) => data.completed === true)
          setUserTodos(dbFilter);
          setFetchLoading(false);
        }
        else if (status === "favorite") {
          const dbData = JSON.parse(window.localStorage.todoDB)
          const dbFilter = dbData.filter((data: { favorite: boolean; }) => data.favorite === true)
          setUserTodos(dbFilter);
          setFetchLoading(false);
        }
        if (searchResult.length !== 0) {
          const dbData = JSON.parse(window.localStorage.todoDB)
          const dbFilter = dbData.filter((data: { description: string; }) => data.description.toLowerCase().includes(searchResult.toLowerCase()))
          setUserTodos(dbFilter);
          setFetchLoading(false);
        }
      }
    }

  }, [user, reloadState, router, searchResult])
  /*==========================
  Delete one ToDo From Server
  ===========================*/
  const handleDelete = (id: string) => {
    if (user) {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(id)
      }
      fetch(`/api/todo/deleteOne`, requestOptions)
        .then(res => res.json())
        .then(data => {

          setReloadState(!reloadState);
        })
    } else {
      const dbData = JSON.parse(window.localStorage.todoDB)
      const dbFilter = dbData.filter((data: { id: string; }) => data.id !== id)
      window.localStorage.setItem('todoDB', JSON.stringify(dbFilter));
      setReloadState(!reloadState);
    }

  }
  /*==========================
  Favorite one ToDo From Server
  ===========================*/
  const handleFavorite = (id: string, favorite: boolean) => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: id, favorite: !favorite })
    }
    fetch(`/api/todo/favoriteOne`, requestOptions)
      .then(res => res.json())
      .then(data => {
        setReloadState(!reloadState);
      })
  }
  /*==========================
  Complete one ToDo From Server
  ===========================*/
  const handleComplete = (id: string, completed: boolean) => {
    if (user) {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: id, completed: !completed })
      }
      fetch(`/api/todo/completeOne`, requestOptions)
        .then(res => res.json())
        .then(data => {
          setReloadState(!reloadState);
        })
    } else {
    }
    const dbData = JSON.parse(window.localStorage.todoDB)
    dbData.forEach((data: {
      id: string; data: []; completed: boolean
    }) => {
      if (data.id === id) {
        data.completed ? data.completed = false : data.completed = true;
      }
    })
    window.localStorage.setItem('todoDB', JSON.stringify(dbData));
    setReloadState(!reloadState);
  }


  //Return when USERS & FETCH is Loading.
  if (isLoading && fetchLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  return (
    <main className={styles.container}>
      <div className={styles.firstDivison}>
        <div className={styles.containerH1}>
          {status === undefined && <h1 className={styles.h1}>All<span className={styles.lengthTodo}>({userTodos.length})</span></h1>}
          {status === "pending" && <h1 className={styles.h1}>Pending<span className={styles.lengthTodo}>({userTodos.length})</span></h1>}
          {status === "completed" && <h1 className={styles.h1}>Completed<span className={styles.lengthTodo}>({userTodos.length})</span></h1>}
          {status === "favorite" && <h1 className={styles.h1}>Favorites<span className={styles.lengthTodo}>({userTodos.length})</span></h1>}
        </div>
        <div className={styles.containerNote}>
          {userTodos.map(todo => {
            return (<div key={todo.id} className={!todo.favorite ? styles.note : styles.noteFavorite}>
              <div className={styles.containerTitle}>
                <p className={styles.noteTitle}>{todo.categories}</p>
                <Link href={user ? `/modifyNote/?id=${todo.id}` : "/"}>
                  <div className={user ? "" : styles.tooltipModify}>
                    <Image className={user ? styles.modifyIcon : styles.modifyIconNoUser} alt="Modify Icon" src="/modify.png" width={30} height={30} />
                  </div>
                </Link>
              </div>
              <span className={styles.createdSpan}>{todo.created}</span>
              <p className={styles.noteDescription} >{todo.description}</p>
              <div className={styles.containerIcon}>
                <button style={{ all: "unset", cursor: "pointer" }} onClick={() => handleComplete(todo.id, todo.completed)}>
                  {!todo.completed ? <Image className={styles.iconHover} alt="Complete Note" src="/completeNote.png" width={iconNoteSize} height={iconNoteSize} /> :
                    <Image className={styles.iconHover} alt="Complete Note" src="/completeNoteTrue.png" width={iconNoteSize} height={iconNoteSize} />}
                </button>
                <button style={{ all: "unset", cursor: "pointer" }} onClick={() => handleDelete(todo.id)}>
                  <Image className={styles.iconHover} alt="Delete Note" src="/deleteNote.png" width={iconNoteSize} height={iconNoteSize} />
                </button>
                <div className={!user ? styles.tooltip : ""}>
                  <button style={{ all: "unset", cursor: "pointer" }} disabled={!user ? true : false} onClick={() => handleFavorite(todo.id, todo.favorite)}>
                    {!todo.favorite ? <Image style={!user ? { opacity: "50%" } : { opacity: "100%" }} className={styles.iconHover} alt="Favorite Note" src="/favoriteNote.png" width={iconNoteSize} height={iconNoteSize} />
                      :
                      <Image className={`${styles.iconHover}`} alt="Favorite Note" src="/favoriteNoteTrue.png" width={iconNoteSize} height={iconNoteSize} />}
                  </button>
                </div>

              </div>
            </div>)
          })}
        </div>
      </div>
      {/* <div className={styles.secondDivision}>
        <Image className={styles.rightArrow} alt="Right Arrow" src="/rightArrow.png" width={40} height={40} />
      </div> */}
    </main>
  );
};
