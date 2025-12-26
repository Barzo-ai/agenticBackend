/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */

export function normalize(products: any[]) {
  // eslint-disable-next-line prettier/prettier
  return products.map(p => ({
    ...p,
    price: Number(p.price?.replace(/[^0-9]/g, ''))
  }));
}
