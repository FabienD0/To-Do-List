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
        const resultCompleted = await db.collection("todoDB").find({ email: req.body.email, completed: true }).toArray();
        const resultPending = await db.collection("todoDB").find({ email: req.body.email, completed: false }).toArray();
        const resultFavorite = await db.collection("todoDB").find({ email: req.body.email, favorite: true }).toArray();
        const resultSearch = await db.collection("todoDB").find({ email: req.body.email, description: { $regex: new RegExp(req.body.search, "i") } }).toArray();





        if (result && !req.body.status && req.body.search.length === 0) {
            res.status(201).json({ status: 201, data: result });
        } else if (resultCompleted && req.body.status === 'completed') {
            res.status(201).json({ status: 201, data: resultCompleted });
        } else if (resultPending && req.body.status === "pending") {
            res.status(201).json({ status: 201, data: resultPending });
        } else if (resultFavorite && req.body.status === "favorite") {
            res.status(201).json({ status: 201, data: resultFavorite });
        } else if (resultSearch && req.body.search.length !== 0) {
            res.status(201).json({ status: 201, data: resultSearch })
        } else {
            res.status(500).json({ status: 500, data: req.body, message: "No ToDo from this E.Mail" })
        }
    }
    catch (e) {
        console.log(e);
    }
}


export default getAll;