/**
 * 
 * @param {import('next').NextApiRequest} req
 * @param {import('next').NextApiResponse} res
 */

import clientPromise from "@../../lib/mongodb";


const favoriteOne = async (req: any, res: any) => {

    const client = await clientPromise;

    try {
        await client.connect();
        const db = client.db("todolist");


        const result = await db.collection("todoDB").updateOne({ id: req.body.id }, { $set: { favorite: req.body.favorite } })

        if (result) {
            res.status(200).json({ status: 200, data: result });
        } else {
            res.status(404).json({ status: 404, data: req.body, message: "Error Try Again" })
        }
    }
    catch (e) {
        console.log(e);
    }
}


export default favoriteOne;