/**
 * 
 * @param {import('next').NextApiRequest} req
 * @param {import('next').NextApiResponse} res
 */

import clientPromise from "@../../lib/mongodb";


const deleteOne = async (req: any, res: any) => {

    const client = await clientPromise;

    try {
        await client.connect();
        const db = client.db("todolist");


        const result = await db.collection("todoDB").deleteOne({ id: req.body });

        if (result && result.deletedCount !== 0) {
            res.status(200).json({ status: 200, data: result });
        } else {
            res.status(404).json({ status: 404, data: req.body, message: "No note with this ID" })
        }
    }
    catch (e) {
        console.log(e);
    }
}


export default deleteOne;