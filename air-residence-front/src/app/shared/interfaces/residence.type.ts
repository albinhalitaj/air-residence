import { ResidenceImagesType } from './residence-images.type';

export interface ResidenceType {
  id: string,
  title?: string,
  description?: string,
  category?: string,
  address?: string,
  city?: string,
  country?: string,
  zipCode?: string,
  ownerName?: string,
  email?: string,
  phone?: string,
  price?: number,
  images: ResidenceImagesType[]
}
