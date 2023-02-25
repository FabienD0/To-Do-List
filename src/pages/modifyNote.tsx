import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useUser } from '@auth0/nextjs-auth0/client';
import { dataParameter } from "@/pages";
import styles from "../components/modifyNote/modifyNote.module.css"
import Image from "next/image";


const ModifyNote = () => {
    const { user, error, isLoading } = useUser();
    const [fetchLoading, setFetchLoading] = useState(false);
    const [todo, setTodo] = useState<dataParameter>();
    const [clearText, setClearText] = useState<boolean>(false);
    const [descriptionText, setDescriptionText] = useState<string>("");
    const [categorie, setCategorie] = useState<string>("");


    const router = useRouter()
    const { id } = router.query

    const iconNoteSize = 70;
    /*========================
    GET ToDos From Server
    ========================*/
    useEffect(() => {
        setFetchLoading(true);
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: user?.name, id: id })
        }
        if (!isLoading && user) {
            fetch(`/api/todo/getOne`, requestOptions)
                .then(res => res.json())
                .then(data => {
                    setTodo(data.data)
                    setDescriptionText(data.data[0].description)
                    setCategorie(data.data[0].categories)
                    setFetchLoading(false);
                })
        }
    }, [router])

    /*========================
    Modify ToDos From Server
    ========================*/
    const handleSend = async () => {

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: user?.email, id: id, description: descriptionText, categorie: categorie })
        };

        await fetch("/api/todo/modifyNote", requestOptions)
            .then(res => res.json())
            .then(data => {
                if (data.status === 201) {
                    setCategorie("")
                    setDescriptionText("")
                    router.push("/")
                } else {
                    console.log(data)
                }

            })
    }

    //Re-Render when clearText
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
                <h1 className={styles.h1}>Modify To-Do</h1>
                <div className={styles.containerNote}>
                    <div className={styles.note}>
                        <div className={styles.containerTitle}>
                            <select className={styles.noteTitle} onChange={(e) => setCategorie(e.target.value)}>
                                <option hidden value="">{categorie}</option>
                                <option>Chores</option>
                                <option>Learning</option>
                                <option>Mind Care</option>
                                <option>Body Care</option>
                                <option>People</option>
                                <option>Others</option>
                            </select>
                        </div>
                        <textarea className={styles.noteDescription} value={descriptionText}
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

export default ModifyNote