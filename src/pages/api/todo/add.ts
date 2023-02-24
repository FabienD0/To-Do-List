/**
 * 
 * @param {import('next').NextApiRequest} req
 * @param {import('next').NextApiResponse} res
 */

import clientPromise from "@../../lib/mongodb";


const addNote = async (req: any, res: any) => {

    const client = await clientPromise;

    try {
        await client.connect();
        const db = client.db("todolist");

        const result = await db.collection("todoDB").insertOne(req.body);
        const notesFromUser = await db.collection("todoDB").find({ email: req.body.email }).toArray();


        if (result.acknowledged) {
            if (notesFromUser.length > 40) {
                res.status(404).json({ status: 404, data: req.body, message: "Maximum on this account reached (20)" })
            } else {
                res.status(201).json({ status: 201, data: req.body });
            }
        } else {
            res.status(500).json({ status: 500, data: req.body, message: "error" })
        }
    } catch (e) {
        console.log(e);
    }

    client.close();
}


export default addNote;