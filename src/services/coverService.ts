import { Cover } from '@prisma/client';

import prisma from '../config/db';

export const create = async (cover: Omit<Cover, 'id'>) => {
  const newEntry = await prisma.cover.create({
    data: {
      name: cover.name,
      description: cover.description,
    },
  });

  return newEntry;
};

export const update = async (id: number, cover: Partial<Cover>) => {
  const updatedEntry = await prisma.cover.update({
    where: {
      id,
    },
    data: cover,
  });

  return updatedEntry;
};

export const remove = async (id: number) => {
  const removedItem = await prisma.cover.update({
    where: {
      id,
    },
    data: {
      removed: true,
    },
  });

  return removedItem;
};

export const findAll = async () => {
  return prisma.cover.findMany({
    where: {
      removed: false,
    },
  });
};
