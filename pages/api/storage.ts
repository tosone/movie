import { NextApiRequest, NextApiResponse } from 'next';

import dbConnect from '../../utils/dbConnect';
import Storage, { StorageType } from "../../models/storage";

interface StorageCreateBodyType {
  type: string;
  accessKey: string;
  secretKey: string;
  bucket: string;
  region: string;
}

const StorageAPI = async (req: NextApiRequest, res: NextApiResponse): Promise<void | NextApiResponse<any>> => {
  await dbConnect();
  if (req.method === "POST") {
    const data: StorageCreateBodyType = req.body;
    let checkConflict = await Storage.findOne(data);
    if (checkConflict) {
      return res.status(409).send({ "message": "Already exist" })
    }
    let storage: StorageType = new Storage({
      type: data.type,
      accessKey: data.accessKey,
      secretKey: data.secretKey,
      bucket: data.bucket,
      region: data.region,
    });
    try {
      let result = await storage.save();
      return res.status(201).send({ data: result });
    } catch (error) {
      return res.status(500).send({ message: `internal server error: ${error}` });
    }
  }
}

export default StorageAPI;
