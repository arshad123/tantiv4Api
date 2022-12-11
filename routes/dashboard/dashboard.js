const express = require("express");
const router = express.Router();
const _ = require("lodash");
const auth = require("../../middleware/auth");
const { Analytic } = require("../../models/analytic");

router.get("/", auth("admin"), async (req, res) => {
  const downloadUpload = await Analytic.aggregate([
    {
      $group: {
        _id: {
          day: { $dayOfMonth: "$createdAt" },
          month: { $month: "$createdAt" },
          year: { $year: "$createdAt" },
        },
        download: { $sum: "$download" },
        upload: { $sum: "$upload" },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
  ]);

  const totalHost = await Analytic.aggregate([
    {
      $group: {
        _id: "$hostName",
        upload: { $sum: "$upload" },
        download: { $sum: "$download" },
        timeUsage: { $sum: "$useageSeconds" },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const sumRecord = await Analytic.aggregate([
    {
      $group: {
        _id: null,
        download: { $sum: "$download" },
        upload: { $sum: "$upload" },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1, "_id.hour": 1 } },
  ]);

  const downloadUploadHourly = await Analytic.aggregate([
    {
      $group: {
        _id: {
          hour: { $hour: "$createdAt" },
          day: { $dayOfMonth: "$createdAt" },
          month: { $month: "$createdAt" },
          year: { $year: "$createdAt" },
        },
        download: { $sum: "$download" },
        upload: { $sum: "$upload" },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1, "_id.hour": 1 } },
  ]);

  return res.status(200).send({
    message: "Success",
    error: false,
    code: 200,
    totalHost,
    sumRecord,
    data: downloadUpload,
    downloadUploadHourly,
  });
});

router.get("/hosts", auth("admin"), async (req, res) => {
  const dailyData = await Analytic.aggregate([
    {
      $group: {
        _id: {
          day: { $dayOfMonth: "$createdAt" },
          month: { $month: "$createdAt" },
          year: { $year: "$createdAt" },
          hostName: "$hostName",
        },
        download: { $sum: "$download" },
        upload: { $sum: "$upload" },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.hostName": 1 } },
  ]);

  const hourly = await Analytic.aggregate([
    {
      $group: {
        _id: {
          hour: { $hour: "$createdAt" },
          day: { $dayOfMonth: "$createdAt" },
          month: { $month: "$createdAt" },
          year: { $year: "$createdAt" },
          hostName: "$hostName",
        },
        download: { $sum: "$download" },
        upload: { $sum: "$upload" },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1, "_id.hour": 1 } },
  ]);

  const hosts = await Analytic.aggregate([
    {
      $group: {
        _id: "$hostName",

        download: { $sum: "$download" },
        upload: { $sum: "$upload" },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.download": -1 } },
  ]);

  return res.status(200).send({
    message: "Success",
    error: false,
    code: 200,
    data: hourly,
    dailyData,
    hosts,
  });
});

// Events related to user
// router.get("/me", auth("user", "admin"), async (req, res) => {
//   const params = req.query;
//   const { error } = validateSearchRequest(params);
//   if (error) return res.status(400).json(response.error(error.details[0].message, 400));

//   const filterStages = [{ $match: { host: req.user._id, deletedAt: null } }, { $project: { __v: 0 } }];
//   filterStages.push(makeSortingQuery(params.sort, params.order));

//   const page = ("page" in params && parseInt(params.page)) > 0 ? parseInt(params.page) : 1;
//   const query = makePaginationQuery(filterStages, page, 20);
//   const data = await Event.aggregate(query);
//   res.status(200).json(response.successPagination(data));
// });

// function makeSortingQuery(sort, orderBy) {
//   const order = orderBy && orderBy == "desc" ? -1 : 1;
//   const sorting = {};
//   if (sort) {
//     switch (sort) {
//       case "startDate":
//         sorting.startDate = order;
//         sorting.endDate = order;
//         sorting.title = order;
//         break;
//       case "endDate":
//         sorting.endDate = order;
//         sorting.startDate = order;
//         sorting.title = order;
//         break;
//       case "createdAt":
//         sorting.createdAt = order;
//         break;
//       default:
//         sorting.title = order;
//         sorting.startDate = order;
//         sorting.endDate = order;
//         break;
//     }
//   } else {
//     sorting._id = order;
//   }

//   return { $sort: sorting };
// }

// router.get("/details/:id", auth("user", "admin", "none"), async (req, res) => {
//   const id = req.params.id;
//   if (!id) return res.status(400).json(response.error("Invalid id", 400));

//   const eventFilter = { deletedAt: null };
//   if (mongoose.Types.ObjectId.isValid(id)) {
//     eventFilter._id = mongoose.Types.ObjectId(id);
//   } else {
//     eventFilter.slug = id;
//   }
//   const event = await Event.findOne(
//     eventFilter,
//     { __v: 0, host: 0, hostType: 0 },
//     { lean: true }
//   );
//   if (!event)
//     return res.status(404).json(response.error("Event not found", 404));

//   res.status(200).json(response.success(event));
// });

// // Create Event
// router.post("/", auth("user", "admin"), async (req, res) => {
//   const { error } = validateAddEventRequest(req.body);
//   if (error)
//     return res.status(400).json(response.error(error.details[0].message, 400));

//   const body = _.omit(req.body, ["startDate", "endDate"]);
//   body.host = req.user._id;
//   body.hostType = req.user.userType;
//   body.eventStatus = "pending";
//   body.isCommunityEvent = !req.user.isAdmin;

//   body.startDate = new Date(parseInt(req.body.startDate));
//   body.endDate = new Date(parseInt(req.body.endDate));
//   if (req.body.startDate > req.body.endDate)
//     return res.status(400).json(response.error("Invalid dates", 400));

//   const allEvents = await Event.find({}, { slug: 1 }, { lean: true });
//   const allSlugs = allEvents.map((user) => user.slug);
//   body.slug = generateUniqueSlug(allSlugs, body.title.toSlug());

//   const event = new Event(body);
//   await event.save();
//   console.log(req.user);
//   sendEventCreatedToAdmin(
//     settings.adminEmails,
//     req.user.isAdmin ? "Admin" : req.user.firstName + " " + req.user.lastName,
//     event.title
//   );

//   const resp = _.omit(event.toObject(), ["__v"]);
//   res.status(200).json(response.success(resp));
// });

// function generateUniqueSlug(existing, slug) {
//   if (existing.includes(slug)) {
//     const newSlug = slug + "-" + Math.floor(Math.random() * 100);
//     return generateUniqueSlug(existing, newSlug);
//   }
//   return slug;
// }
// router.get("/featured", auth("admin", "user", "none"), async (req, res) => {
//   const filter = { deletedAt: null, eventStatus: "accepted", featured: true };
//   const event = await Event.findOne(filter);

//   const resp = event ? _.omit(event.toObject(), ["__v"]) : {};
//   res.status(200).json(response.success(resp));
// });

// router.put("/featured/:id", auth("admin"), async (req, res) => {
//   const id = req.params.id;
//   if (!id) return res.status(400).json(response.error("Invalid id", 400));
//   const { error } = validateStatusRequest(req.body);
//   if (error)
//     return res.status(400).json(response.error(error.details[0].message, 400));

//   await Event.updateMany({}, { $set: { featured: false } });
//   const filter = {};
//   if (mongoose.Types.ObjectId.isValid(id)) {
//     filter._id = mongoose.Types.ObjectId(id);
//   } else {
//     filter.slug = id;
//   }
//   const event = await Event.findOne(filter);
//   event.featured = true;
//   await event.save({ new: true });

//   const resp = _.omit(event.toObject(), ["__v"]);
//   res.status(200).json(response.success(resp));
// });

// router.put("/changeStatus/:id", auth("admin"), async (req, res) => {
//   const id = req.params.id;
//   if (!id) return res.status(400).json(response.error("Invalid id", 400));
//   const { error } = validateStatusRequest(req.body);
//   if (error)
//     return res.status(400).json(response.error(error.details[0].message, 400));

//   const update = req.body;
//   const filter = { deletedAt: null };
//   if (mongoose.Types.ObjectId.isValid(id)) {
//     filter._id = mongoose.Types.ObjectId(id);
//   } else {
//     filter.slug = id;
//   }
//   const event = await Event.findOne(filter);
//   console.log(filter, event);
//   event.eventStatus = update.status;
//   await event.save({ new: true });

//   const resp = _.omit(event.toObject(), ["__v"]);
//   res.status(200).json(response.success(resp));
// });

// router.put("/:id", auth("user", "admin"), async (req, res) => {
//   const id = req.params.id;
//   if (!id) return res.status(400).json(response.error("Invalid id", 400));

//   const { error } = validateUpdateEventRequest(req.body);
//   if (error)
//     return res.status(400).json(response.error(error.details[0].message, 400));

//   const filter = { deletedAt: null };
//   if (mongoose.Types.ObjectId.isValid(id)) {
//     filter._id = mongoose.Types.ObjectId(id);
//   } else {
//     filter.slug = id;
//   }
//   const event = await Event.findOne(filter);
//   if (!event) return res.status(404).json(response.error("Invalid event", 400));

//   const update = req.body;

//   if ("title" in update) {
//     if (update.title != event.title) {
//       const allEvents = await Event.find({}, { slug: 1 }, { lean: true });
//       const allSlugs = allEvents.map((user) => user.slug);
//       event.slug = generateUniqueSlug(allSlugs, update.title.toSlug());
//     }
//     event.title = update.title;
//   }

//   if ("description" in update) event.description = update.description;
//   if ("topicsCovered" in update) event.topicsCovered = update.topicsCovered;
//   if ("insightsGained" in update) event.insightsGained = update.insightsGained;
//   if ("type" in update) event.type = update.type;
//   if ("isPublished" in update) event.isPublished = update.isPublished;
//   if ("coverImage" in update) event.coverImage = update.coverImage;
//   if ("isFeatured" in update) event.isFeatured = update.isFeatured;
//   if ("speakers" in update) event.speakers = update.speakers;
//   if ("locationType" in update) {
//     event.locationType = update.locationType;
//     if (update.locationType == "in-person") {
//       event.link = "";
//       event.location = update.location;
//     } else {
//       event.location = "";
//       event.link = update.link;
//     }
//   }

//   if ("category" in update) {
//     const category = await EventCategory.findOne({
//       _id: mongoose.Types.ObjectId(req.body.category),
//       isActive: true,
//       deletedAt: null,
//     });
//     if (!category)
//       return res.status(400).json(response.error("Invalid category", 400));
//     event.category = {
//       id: category._id,
//       title: category.title,
//     };
//   }

//   if ("startDate" in update)
//     event.startDate = new Date(parseInt(update.startDate));
//   if ("endDate" in update) event.endDate = new Date(parseInt(update.endDate));

//   if ("images" in update) {
//     event.images = update.images;
//   }

//   await event.save({ new: true });

//   const resp = _.omit(event.toObject(), ["__v"]);
//   res.status(200).json(response.success(resp));
// });

// router.delete("/:id", auth("user", "admin"), async (req, res) => {
//   const id = req.params.id;
//   if (!id) return res.status(400).json(response.error("Invalid id", 400));

//   const now = new Date();
//   const filter = { deletedAt: null };
//   if (mongoose.Types.ObjectId.isValid(id)) {
//     filter._id = mongoose.Types.ObjectId(id);
//   } else {
//     filter.slug = id;
//   }
//   if (!req.user.isAdmin) {
//     filter.host = req.user._id;
//   }
//   const result = await Event.findOneAndUpdate(
//     filter,
//     { deletedAt: now, updatedBy: req.user.id.toString() },
//     { new: true }
//   );
//   if (!result)
//     return res.status(404).json(response.error("Invalid event", 404));

//   res.status(200).json(response.success("Success", null));
// });

// const coverStorage = multer.diskStorage({
//   destination: async function (req, file, cb) {
//     let tempPath = `${fileUploadPath}/temp/${req.user.id.toString()}/`;
//     let path = `${fileUploadPath}/events/${req.user.id.toString()}/`;
//     await fs.makeDirectory(tempPath);
//     await fs.makeDirectory(path);
//     req.filePath = path;
//     cb(null, tempPath);
//   },
//   filename: function (req, file, cb) {
//     const re = /(?:\.([^.]+))?$/;
//     let ext = re.exec(file.originalname)[1];
//     if (!ext) ext = "jpg";
//     const fileName = uuid();
//     req.fileName = fileName;
//     req.fileExtension = ext;
//     cb(null, fileName);
//   },
// });

// const coverUpload = multer({
//   storage: coverStorage,
//   limits: { fileSize: 20 * 1024 * 1024 },
//   fileFilter: (req, file, cb) => {
//     const allowedTypes = [
//       "image/jpg",
//       "image/jpeg",
//       "image/png",
//       "image/bmp",
//       "image/tiff",
//       "image/webp",
//     ];
//     if (allowedTypes.includes(file.mimetype)) {
//       cb(null, true);
//     } else {
//       cb(null, false);
//       return cb(new Error(`Allowed only ${allowedTypes}`));
//     }
//   },
// });

// router.post(
//   "/uploadCoverImage",
//   [auth("user", "admin"), coverUpload.single("image")],
//   async (req, res) => {
//     const file = req.file;
//     if (!file)
//       return res.status(400).json(response.error("image is required!", 400));

//     const imageURLs = await resizeImage(
//       file.path,
//       req.filePath,
//       req.fileName,
//       req.fileExtension
//     );
//     if (Object.keys(imageURLs).length != 4)
//       return res.status(400).json(response.error("Image upload failed!", 400));

//     for (const key of Object.keys(imageURLs)) {
//       const newPath = `events/cover/${req.user._id.toString()}/${
//         imageURLs[key].fileName
//       }`;
//       await s3.upload(imageURLs[key].path, newPath);
//       try {
//         await fs.deleteFile(imageURLs[key].path);
//       } catch (err) {
//         logger.error(err);
//       }
//       imageURLs[key] = newPath;
//     }

//     res.status(200).json(response.success(imageURLs));
//   }
// );

// const pictureStorage = multer.diskStorage({
//   destination: async function (req, file, cb) {
//     let tempPath = `${fileUploadPath}/temp/${req.params.id.toString()}/`;
//     let path = `${fileUploadPath}/events/${req.params.id.toString()}/`;
//     await fs.makeDirectory(tempPath);
//     await fs.makeDirectory(path);
//     req.filePath = path;
//     cb(null, tempPath);
//   },
//   filename: function (req, file, cb) {
//     const re = /(?:\.([^.]+))?$/;
//     let ext = re.exec(file.originalname)[1];
//     if (!ext) ext = "jpg";
//     const fileName = uuid();
//     req.fileName = fileName;
//     req.fileExtension = ext;
//     cb(null, fileName);
//   },
// });

// const pictureUpload = multer({
//   storage: pictureStorage,
//   limits: { fileSize: 20 * 1024 * 1024 },
//   fileFilter: (req, file, cb) => {
//     const allowedTypes = [
//       "image/jpg",
//       "image/jpeg",
//       "image/png",
//       "image/bmp",
//       "image/tiff",
//       "image/webp",
//     ];
//     if (allowedTypes.includes(file.mimetype)) {
//       cb(null, true);
//     } else {
//       cb(null, false);
//       return cb(new Error(`Allowed only ${allowedTypes}`));
//     }
//   },
// });

// const videoUpload = multer({
//   storage: pictureStorage,
//   limits: { fileSize: 200 * 1024 * 1024 },
//   fileFilter: (req, file, cb) => {
//     console.log(file.mimetype);
//     const allowedTypes = ["video/mp4", "video/mov", "video/quicktime"];
//     if (allowedTypes.includes(file.mimetype)) {
//       cb(null, true);
//     } else {
//       cb(null, false);
//       return cb(new Error(`Allowed only ${allowedTypes}`));
//     }
//   },
// });

// router.post(
//   "/uploadImage/:id",
//   [auth("user", "admin"), pictureUpload.single("image")],
//   async (req, res) => {
//     const id = req.params.id;
//     if (!id) return res.status(400).json(response.error("Invalid id", 400));

//     const filter = { deletedAt: null };
//     if (mongoose.Types.ObjectId.isValid(id)) {
//       filter._id = mongoose.Types.ObjectId(id);
//     } else {
//       filter.slug = id;
//     }
//     const event = await Event.findOne(filter);
//     if (!event)
//       return res.status(404).json(response.error("Invalid event", 400));

//     const file = req.file;
//     if (!file)
//       return res.status(400).json(response.error("image is required!", 400));

//     const imageURLs = await resizeImage(
//       file.path,
//       req.filePath,
//       req.fileName,
//       req.fileExtension
//     );
//     if (Object.keys(imageURLs).length != 4)
//       return res.status(400).json(response.error("Image upload failed!", 400));

//     for (const key of Object.keys(imageURLs)) {
//       const newPath = `events/photo/${id}/${imageURLs[key].fileName}`;
//       await s3.upload(imageURLs[key].path, newPath);
//       try {
//         await fs.deleteFile(imageURLs[key].path);
//       } catch (err) {
//         logger.error(err);
//       }
//       imageURLs[key] = newPath;
//     }
//     event.images.push({ urls: imageURLs });
//     await event.save();

//     res.status(200).json(response.success(event));
//   }
// );

// router.post(
//   "/uploadVideo/:id",
//   [auth("user", "admin"), videoUpload.single("video")],
//   async (req, res) => {
//     const id = req.params.id;
//     if (!id) return res.status(400).json(response.error("Invalid id", 400));

//     const filter = { deletedAt: null };
//     if (mongoose.Types.ObjectId.isValid(id)) {
//       filter._id = mongoose.Types.ObjectId(id);
//     } else {
//       filter.slug = id;
//     }
//     const event = await Event.findOne(filter);
//     if (!event)
//       return res.status(404).json(response.error("Invalid event", 400));

//     const file = req.file;
//     if (!file)
//       return res.status(400).json(response.error("video is required!", 400));

//     const newPath = `events/video/${id}/${uuid()}.${req.fileExtension}`;
//     await s3.upload(file.path, newPath);
//     try {
//       await fs.deleteFile(file.path);
//     } catch (err) {
//       logger.error(err);
//     }

//     event.videos.push({ url: newPath, type: "uploaded" });
//     await event.save();

//     res.status(200).json(response.success(event));
//   }
// );

// router.delete(
//   "/removeVideo/:id/:videoId",
//   auth("user", "admin"),
//   async (req, res) => {
//     const event = await Event.findOne({
//       _id: mongoose.Types.ObjectId(req.params.id),
//       host: req.user._id,
//       deletedAt: null,
//     });
//     const videoId = req.params.videoId;
//     if (!event) {
//       return res.status(404).json(response.error("Invalid event", 404));
//     }
//     const toBeDeleted = event.videos.id(videoId);

//     await s3.deleteFile(toBeDeleted.url);

//     event.videos = event.videos.filter((image) => image._id != videoId);
//     await event.save();
//     res.status(200).json(response.success(event));
//   }
// );

// router.delete(
//   "/removeImage/:id/:photoId",
//   auth("user", "admin"),
//   async (req, res) => {
//     const event = await Event.findOne({
//       _id: mongoose.Types.ObjectId(req.params.id),
//       host: req.user._id,
//       deletedAt: null,
//     });
//     const photoId = req.params.photoId;
//     if (!event) {
//       return res.status(404).json(response.error("Invalid event", 404));
//     }
//     const toBeDeleted = event.images.id(photoId);

//     for (const key of Object.keys(toBeDeleted.urls)) {
//       await s3.deleteFile(toBeDeleted.urls[key]);
//     }
//     event.images = event.images.filter((image) => image._id != photoId);
//     await event.save();
//     res.status(200).json(response.success(event));
//   }
// );

module.exports = router;
