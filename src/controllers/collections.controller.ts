import { NextFunction, Request, Response } from "express";
import {
  createCollection,
  deleteCollections,
  findAllCollection,
  findByIdCollection,
  updateCollections,
} from "../services/collections.service";
import config from "config";

const uploadURL = config.get<string>("baseURL");

export const createCollectionHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, category, description } = JSON.parse(req.body.data);
  try {
    const user = res.locals.user;
    const file = `${uploadURL}${req.file?.filename}`;
    const collection = await createCollection({
      name: name,
      category: category,
      description: description,
      image: file,
      owner: user,
    });

    res.status(201).json({
      status: "success",
      data: {
        collection,
      },
    });
  } catch (err: any) {
    next(err);
  }
};

export const deleteCollectionsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const collections = await deleteCollections(req.body);
    res.status(200).json({
      status: "success",
      result: collections,
      data: {
        collections,
      },
    });
  } catch (err: any) {
    next(err);
  }
};

export const updateCollectionsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id, name, category, description } = req.body;
    const collection = await updateCollections(id, name, category, description);
    res.status(200).json({
      status: "success",
      result: collection,
    });
  } catch (err: any) {
    next(err);
  }
};

export const getCollectionHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // const items =
    console.log(req.params.id);
    const collection = await findByIdCollection(req.params.id);
    res.status(200).json({
      status: "success",
      // result: items.length,
      data: {
        collection,
      },
    });
  } catch (err: any) {
    next(err);
  }
};

export const getAllCollectionsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = res.locals.user;
    const collections = await findAllCollection(user);
    res.status(200).json({
      status: "success",
      result: collections.length,
      data: {
        collections,
      },
    });
  } catch (err: any) {
    next(err);
  }
};
