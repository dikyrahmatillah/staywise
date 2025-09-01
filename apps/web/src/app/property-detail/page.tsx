import ReservationCard from "@/components/reservation-card/reservation-card";
import { ReviewSection } from "@/components/review/review-section";

export default function PropertyDetail() {
  const sampleReviewData = {
    overallRating: 4.82,
    totalReviews: 90,
    ratingDistribution: {
      5: 85,
      4: 3,
      3: 1,
      2: 1,
      1: 0,
    },
    reviews: [
      {
        id: 1,
        userName: "Asri Octiana",
        // userAvatar: "/woman-profile.png",
        experienceText: "7 years on Airbnb",
        timeAgo: "1 week ago",
        rating: 5,
        reviewText:
          "my partner and I really enjoy our stay at Yona's place. the place is clean and comfy, and they really provide everything. the area was quiet, exactly what we were looking for. the hos...",
        fullReview:
          "my partner and I really enjoy our stay at Yona's place. the place is clean and comfy, and they really provide everything. the area was quiet, exactly what we were looking for. the host was very responsive and helpful throughout our stay.",
      },
      {
        id: 2,
        userName: "Ulima",
        // userAvatar: "/person-travel-photo.png",
        experienceText: "2 years on Airbnb",
        timeAgo: "2 weeks ago",
        rating: 5,
        reviewText:
          "it's comfortable, clean, bright, and has a very unique and well-designed concept. The whole place feels cozy and relaxing, perfect for a ...",
        fullReview:
          "it's comfortable, clean, bright, and has a very unique and well-designed concept. The whole place feels cozy and relaxing, perfect for a weekend getaway. The host was amazing and very accommodating.",
      },
    ],
  };
  return (
    <div className="flex flex-col gap-24 mx-24">
      <div className="w-full h-1/3 bg-blue-400">Property Image</div>
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-primary">
          <h2 className="font-sans font-medium text-3xl">
            Property Detail Placeholder
          </h2>
        </div>
        <div className="w-full h-screen overflow-hidden relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <ReservationCard />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-6 py-12">
        <h3 className="font-sans font-medium text-3xl">Reviews</h3>
        <div className="py-8 border-b-2 border-t-2">
          <ReviewSection data={sampleReviewData} />
        </div>
      </div>
    </div>
  );
}
