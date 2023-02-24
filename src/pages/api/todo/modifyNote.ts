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

        const result = await db.collection("todoDB").updateOne({ email: req.body.email, id: req.body.id }, { $set: { description: req.body.description, categories: req.body.categorie } });


        if (result.acknowledged) {
            res.status(201).json({ status: 201, data: req.body });

        } else {
            res.status(500).json({ status: 500, data: req.body, message: "error" })
        }
    } catch (e) {
        console.log(e);
    }

    client.close();
}


export default addNote;