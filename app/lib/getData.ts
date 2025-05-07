'use server';

import OpenAI from "openai";
import { getXataClient } from "../../src/xata";
import prisma from './prisma';

export async function getData(id: string) {
   const data = await prisma.documents.findFirst({ 
      where: { 
        id
      }
   })
   return data;
}
