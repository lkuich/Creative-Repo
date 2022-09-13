const express = require("express");
const Boom = require("@hapi/boom");
const { v4: uuidv4 } = require("uuid");
const {
  S3Client,
  HeadObjectCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");
const multer = require("multer");
const multerS3 = require("multer-s3");

const { S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY, S3_BUCKET } = process.env;

const knex = require("./db");

const s3Client = new S3Client({
  credentials: {
    accessKeyId: S3_ACCESS_KEY_ID,
    secretAccessKey: S3_SECRET_ACCESS_KEY,
  },
  forcePathStyle: true,
  region: "us-west-1",
});

const router = express.Router();

const upload = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: S3_BUCKET,
    metadata: (req, file, cb) => {
      cb(null, {
        originalname: file.originalname,
      });
    },
    contentType: function (req, file, cb) {
      cb(null, file.mimetype);
    },
    key: function (req, file, cb) {
      // generate unique file names to be saved on the server
      const uuid = uuidv4();
      const key = `${req.s3_key_prefix}${uuid}`;

      req.saved_files.push({
        originalname: file.originalname,
        mimetype: file.mimetype,
        encoding: file.encoding,
        key,
      });

      cb(null, key);
    },
  }),
});

const upload_auth = (req, res, next) => {
  // path to where the file will be uploaded to
  try {
    req.s3_key_prefix = req.headers["x-path"].replace(/^\/+/g, ""); //remove = first '/' if any
  } catch (e) {
    return next(Boom.badImplementation("x-path header required"));
  }

  // all uploaded files gets pushed in to this array
  // this array is returned back to the client once all uploads are
  // completed

  req.saved_files = [];
  next();
};

router.post(
  "/upload",
  upload_auth,
  upload.array("files", 50),
  async function (req, res) {
    const media = await persistMedia(req.saved_files);

    res.json(media);
  }
);

// Update our Media table in the database
async function persistMedia(files) {
  const transaction = await knex.transaction();

  try {
    const [ids] = await Promise.all(
      files.map(async ({ key, originalname, mimetype }) => {
        return await knex("media")
          .insert(
            {
              key,
              filename: originalname,
              mimetype,
            },
            ["id", "key"]
          )
          .transacting(transaction);
      })
    );
    await transaction.commit();
    return ids;
  } catch (e) {
    await transaction.rollback();
  }

  return [];
}

router.get("/file/*", async (req, res) => {
  const Key = `${req.params[0]}`;
  const params = {
    Bucket: S3_BUCKET,
    Key,
  };

  try {
    const head = await s3Client.send(new HeadObjectCommand(params));

    //Add the content type to the response ( it's not propagated from the S3 SDK)
    res.set("Content-Type", head.ContentType);
    res.set("Content-Length", head.ContentLength);
    res.set("Last-Modified", head.LastModified);
    res.set(
      "Content-Disposition",
      `inline; filename="${head.Metadata.originalname}"`
    );
    res.set("ETag", head.ETag);

    const object = await s3Client.send(new GetObjectCommand(params));

    return object.Body.pipe(res);
  } catch (e) {
    console.error(e.stack);

    return res.status(500).send();
  }
});

module.exports = router;
