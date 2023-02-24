import { useUser } from '@auth0/nextjs-auth0/client';
import { useEffect, useState } from "react";
import { dataParameter } from "@/pages";
import { HomePage } from '@/components/home/home-page';
// import styles from "./home.module.css"
import Image from 'next/image';

const PendingNote = () => {

    const iconNoteSize = 30;


    const { user, error, isLoading } = useUser();
    const [fetchLoading, setFetchLoading] = useState(false);
    const [reloadState, setReloadState] = useState(false);
    const [userTodos, setUserTodos] = useState<dataParameter>([]);




    /*========================
    GET pending ToDos From Server
    ========================*/
    useEffect(() => {
        setFetchLoading(true);
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: user?.email, completed: false })
        }
        if (!isLoading && user) {
            fetch(`/api/todo/getPart`, requestOptions)
                .then(res => res.json())
                .then(data => {
                    console.log(data.data)
                    setUserTodos(data.data)
                    setFetchLoading(false);
                })
        }
    }, [user, reloadState])

    /*==========================
Delete one ToDo From Server
===========================*/
    const handleDelete = (id: string) => {
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
    }

    //Return when USERS & FETCH is Loading.
    if (isLoading && fetchLoading) return <div>Loading...</div>;
    if (error) return <div>{error.message}</div>;


    return (<section className={styles.container}>
        <div className={styles.topContainer}>
            <div className={styles.containerH1}>
                <h1 className={styles.h1}>Home</h1>
            </div>
            <div className={styles.containerSort}>
                <Image alt="Sort" src="/sort.png" width={50} height={50} />
            </div>
        </div>
        <div className={styles.containerNote}>
            {userTodos.map(todo => {
                return (<div key={todo.id} className={styles.note}>
                    <div className={styles.containerTitle}>
                        <p className={styles.noteTitle}>{todo.categories}</p>
                        <Image className={styles.modifyIcon} alt="Modify Icon" src="/modify.png" width={30} height={30} />
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

                        <button style={{ all: "unset", cursor: "pointer" }} onClick={() => handleFavorite(todo.id, todo.favorite)}>
                            {!todo.favorite ? <Image className={styles.iconHover} alt="Favorite Note" src="/favoriteNote.png" width={iconNoteSize} height={iconNoteSize} />
                                :
                                <Image className={styles.iconHover} alt="Favorite Note" src="/favoriteNoteTrue.png" width={iconNoteSize} height={iconNoteSize} />}
                        </button>

                    </div>
                </div>)
            })}
            <Image className={styles.rightArrow} alt="Right Arrow" src="/rightArrow.png" width={70} height={70} />
        </div>
    </section>)
}


export default PendingNote
