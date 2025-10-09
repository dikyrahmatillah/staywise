import { prisma } from "../configs/prisma.config.js";

export class PropertyRelationsRepository {
  async getReviewStats(
    propertyId: string
  ): Promise<{ count: number; averageRating: number }> {
    const [reviewCount, avg] = await Promise.all([
      prisma.review.count({ where: { propertyId } }),
      prisma.review.aggregate({
        where: { propertyId },
        _avg: { rating: true },
      }),
    ]);

    return {
      count: reviewCount,
      averageRating: avg._avg.rating ?? 0,
    };
  }

  /**
   * Delete all facilities for a property
   */
  async deleteFacilities(propertyId: string): Promise<void> {
    await prisma.propertyFacility.deleteMany({
      where: { propertyId },
    });
  }

  /**
   * Create multiple facilities for a property
   */
  async createFacilities(propertyId: string, facilities: any[]): Promise<void> {
    await prisma.propertyFacility.createMany({
      data: facilities.map((facility) => ({
        propertyId,
        facility: facility.facility,
      })),
    });
  }

  async deletePictures(propertyId: string): Promise<void> {
    await prisma.propertyPicture.deleteMany({
      where: { propertyId },
    });
  }

  async createPictures(propertyId: string, pictures: any[]): Promise<void> {
    await prisma.propertyPicture.createMany({
      data: pictures.map((picture) => ({
        propertyId,
        imageUrl: picture.imageUrl,
        note: picture.note,
      })),
    });
  }
}
