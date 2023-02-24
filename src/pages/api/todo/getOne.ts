/**
 * 
 * @param {import('next').NextApiRequest} req
 * @param {import('next').NextApiResponse} res
 */

import clientPromise from "@../../lib/mongodb";


const getAll = async (req: any, res: any) => {

    const client = await clientPromise;

    try {
        await client.connect();
        const db = client.db("todolist");

        const result = await db.collection("todoDB").find({ email: req.body.email, id: req.body.id }).toArray();

        if (result) {
            res.status(201).json({ status: 200, data: result })
        } else {
            res.status(404).json({ status: 404, message: "Didn't find this Todo" })
        }
    }
    catch (e) {
        console.log(e);
    }
}


export default getAll;