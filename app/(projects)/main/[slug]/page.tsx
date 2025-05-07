
import React from 'react' 
import Mainchat from '@/components/mainchat';
import { getData } from '@/lib/getData';
import { Metadata } from 'next';
import { getXataClient } from '../../../../src/xata';
import prisma from '../../../lib/prisma';


export async function generateMetadata(props: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const params = await props.params;
    // read route params
    const id = params.id

    // fetch data
    // const data = await xata.db.document.filter('id', id).getFirst();

    const data = await prisma.documents.findFirst({ 
       where: { 
         id
       }
    })

    return {
      title: data?.file_key,
      description: data?.id
    }
}


export default async function page(props: { params: Promise<{ slug: string }> }) {
    const params = await props.params;
    const { slug } = params;

    const data =  await getData(slug);
    const clientData = JSON.parse(JSON.stringify(data));

    return <Mainchat data={clientData} />;
}
