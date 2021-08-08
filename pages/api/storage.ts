import qiniu from "qiniu";
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
    let checkConflict = await Storage.findOne({ type: data.type, bucket: data.bucket, region: data.region });
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
    let result = await allMovies(storage);
    try {
      let result = await storage.save();
      return res.status(201).send({ data: result });
    } catch (error) {
      return res.status(500).send({ message: `internal server error: ${error}` });
    }
  }
}

interface StorageMovie {
  key: string;
  hash: string;
  fsize: number;
  mimeType: string;
  putTime: number;
  type: number;
  status: number;
  md5: string;
}

interface StorageMoviePages {
  movies: StorageMovie[];
  marker: string;
}

const allMovies = async (storage: StorageType): Promise<StorageMovie[] | Error> => {
  let movies: StorageMovie[] = [];
  let marker: string = "";
  while (true) {
    let result = await getMoviePage(storage, marker)
    if (result instanceof Error) {
      return Promise.resolve(result);
    }
    marker = result.marker;
    movies.push(...result.movies);
    if (!result.marker) {
      break;
    }
  }
  return Promise.resolve(movies);
}

const getMoviePage = (storage: StorageType, marker: String): Promise<StorageMoviePages | Error> => {
  var mac = new qiniu.auth.digest.Mac(storage.accessKey, storage.secretKey);
  var config = new qiniu.conf.Config({ useHttpsDomain: true, zone: qiniu.zone.Zone_z1 });
  var bucketManager = new qiniu.rs.BucketManager(mac, config);
  var bucket = storage.bucket;
  // bucketManager.listPrefix(bucket, { limit: 10, marker: marker }, (err, respBody, respInfo) => {
  //   console.log(respBody, respInfo);
  // })
  return new Promise((resolve) => {
    bucketManager.listPrefix(bucket, { limit: 2, marker: marker }, (err, respBody, respInfo) => {
      // console.log(respBody, respInfo);
      if (err) {
        resolve(err);
      }
      let movies: StorageMovie[] = [];
      for (let m of respBody.items) {
        let movie: StorageMovie = {
          key: m.key,
          hash: m.hash,
          fsize: m.fsize,
          mimeType: m.mimeType,
          putTime: m.putTime,
          type: m.type,
          status: m.status,
          md5: m.md5,
        }
        movies.push(movie);
      }
      let page: StorageMoviePages = {
        movies: movies,
        marker: respBody.marker,
      }
      resolve(page);
    });
  });
}

export default StorageAPI;
