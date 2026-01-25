/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import fetch from 'node-fetch';

export async function OxyEbay(query: string) {
  const username = process.env.OXYLABS_USERNAME!;
  const password = process.env.OXYLABS_PASSWORD!;

  const body = {
    source: 'ebay_search',
    query,
    parse: true, 
  };

  const response = await fetch('https://realtime.oxylabs.io/v1/queries', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization:
        'Basic ' +
        Buffer.from(`${username}:${password}`).toString('base64'),
    },
    body: JSON.stringify(body),
  });

  const data: any = await response.json();

  console.log('Results: ', data.results?.[0])

  const items = data.results?.[0]?.content?.results;

  if (!items) {
    console.error('Unexpected Oxylabs eBay response:', JSON.stringify(data, null, 2));
    return [];
  }

  const mapped = items.slice(0, 5).map((item: any) => ({
    platform: 'ebay',
    title: item.title,
    price: item.price?.value
      ? `${item.price.currency} ${item.price.value}`
      : null,
    images: item.image ? [item.image] : [],
    url: item.url,
  }));

  console.log('Parsed Oxylabs eBay items:', mapped);

  return mapped;
}

export async function OxyAmazon(query: string) {
  const username = process.env.OXYLABS_USERNAME!;
  const password = process.env.OXYLABS_PASSWORD!;

  const body = {
    source: 'amazon_search',
    query,
    parse: true, 
  };

  const response = await fetch('https://realtime.oxylabs.io/v1/queries', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization:
        'Basic ' +
        Buffer.from(`${username}:${password}`).toString('base64'),
    },
    body: JSON.stringify(body),
  });

  const data: any = await response.json();

  console.log('Results: ', data.results?.[0]?.content)

  const items = data.results?.[0]?.content?.results;

  if (!items) {
    console.error('Unexpected Oxylabs Amazon response:', JSON.stringify(data, null, 2));
    return [];
  }

  const mapped = items.slice(0, 5).map((item: any) => ({
    platform: 'ebay',
    title: item.title,
    price: item.price?.value
      ? `${item.price.currency} ${item.price.value}`
      : null,
    images: item.image ? [item.image] : [],
    url: item.url,
  }));

  console.log('Parsed Oxylabs Amazon items:', mapped);

  return mapped;
}
