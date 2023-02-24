import Image from "next/image";
import styles from "../components/createNote/createNote.module.css"
import { dataParameter } from "@/pages";
import { use, useEffect, useState } from "react";
import { useUser } from '@auth0/nextjs-auth0/client';
import { v4 } from 'uuid';
import { useRouter } from "next/router";
import { Header } from "@/components/header/header";

import todoDB from "data/todoDB"




const CreateNote = ({ result }: any) => {

  const [descriptionText, setDescriptionText] = useState("");
  const [clearText, setClearText] = useState(false);
  const [categorie, setCategorie] = useState("");
  const { user, error, isLoading } = useUser();
  const router = useRouter()

  //Today's date
  let newDate = new Date()
  let date = newDate.getDate();
  let month = newDate.getMonth() + 1;
  let year = newDate.getFullYear();
  let fullDate = `${year}-${month < 10 ? `0${month}` : `${month}`}-${date}`
  //Variables
  const iconNoteSize = 70;

  //Post Method to create ToDo to server
  const handleSend = async () => {
    //Body to send
    const postBody = {
      email: user?.email,
      id: v4(),
      categories: categorie,
      created: fullDate,
      description: descriptionText,
      completed: false,
      favorite: false,
      date: newDate,
    }

    //If logged in
    if (user) {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postBody)
      };

      await fetch("/api/todo/add", requestOptions)
        .then(res => res.json())
        .then(data => {
          if (data.status === 201) {
            setCategorie("")
            setDescriptionText("")
            setClearText(!clearText);
            router.push("/")
          } else {
            console.log(data)
          }

        })
      //If not logged in
    } else {

      const todo = {
        email: "noUser@todo.com",
        _id: "noUser",
        id: v4(),
        categories: categorie,
        created: fullDate,
        description: descriptionText,
        completed: false,
        favorite: false
      }
      const dbData = JSON.parse(window.localStorage.todoDB)
      dbData.push(todo)
      window.localStorage.setItem('todoDB', JSON.stringify(dbData));
      setCategorie("")
      setDescriptionText("")
      setClearText(!clearText);
      router.push("/")
    }
  }

  useEffect(() => {
    setDescriptionText("")
  }, [clearText])


  //Loading State
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;
  //Return
  return (
    <>
      {/* <Header /> */}
      <div className={styles.container}>
        <h1 className={styles.h1}>Create To-Do</h1>
        <div className={styles.containerNote}>
          <div className={styles.note}>
            <div className={styles.containerTitle}>
              <select className={styles.noteTitle} onChange={(e) => setCategorie(e.target.value)}>
                <option hidden value="">Categories</option>
                <option>Chores</option>
                <option>Learning</option>
                <option>Mind Care</option>
                <option>Body Care</option>
                <option>People</option>
                <option>Others</option>
              </select>
            </div>
            <textarea className={styles.noteDescription} placeholder="Description..." value={descriptionText}
              onChange={(e) => setDescriptionText(e.target.value)} />
            <div className={styles.containerIcon}>
              <Image onClick={handleSend} alt="Complete Note" src="/completeNote.png" width={iconNoteSize} height={iconNoteSize} />
              <Image onClick={() => setClearText(!clearText)}
                alt="Delete Note"
                src="/deleteNote.png"
                width={iconNoteSize}
                height={iconNoteSize} />
            </div>
          </div>
        </div>
      </div>
    </>)
}

export default CreateNote