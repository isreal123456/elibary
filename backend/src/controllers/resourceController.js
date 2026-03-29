import Resource from '../models/Resource.js';

function serializeResource(resourceDocument) {
  const resource =
    typeof resourceDocument.toObject === 'function'
      ? resourceDocument.toObject()
      : resourceDocument;

  return {
    id: resource._id.toString(),
    title: resource.title,
    category: resource.category,
    type: resource.type,
    fileUrl: resource.fileUrl,
    createdByName: resource.createdByName,
    createdAt: resource.createdAt,
    updatedAt: resource.updatedAt,
  };
}

export async function getResources(req, res) {
  try {
    const resources = await Resource.find().sort({ createdAt: -1 });

    res.status(200).json({
      resources: resources.map(serializeResource),
    });
  } catch (error) {
    res.status(500).json({ message: 'Unable to fetch resources right now.' });
  }
}

export async function createResource(req, res) {
  try {
    const title = req.body.title?.trim();
    const category = req.body.category?.trim();
    const type = req.body.type?.trim();
    const fileUrl = req.body.fileUrl?.trim();

    if (!title || !category || !type || !fileUrl) {
      res.status(400).json({ message: 'Title, category, type, and file URL are required.' });
      return;
    }

    const resource = await Resource.create({
      title,
      category,
      type,
      fileUrl,
      createdBy: req.user._id,
      createdByName: req.user.name,
    });

    res.status(201).json({
      message: 'Resource created successfully.',
      resource: serializeResource(resource),
    });
  } catch (error) {
    res.status(500).json({ message: 'Unable to create resource right now.' });
  }
}
