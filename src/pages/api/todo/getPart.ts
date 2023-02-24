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


        const result = await db.collection("todoDB").find({ email: req.body.email }).toArray();


        if (result) {
            res.status(201).json({ status: 201, data: result });
        } else {
            res.status(500).json({ status: 500, data: req.body, message: "No ToDo from this E.Mail" })
        }
    }
    catch (e) {
        console.log(e);
    }
}


export default getAll;