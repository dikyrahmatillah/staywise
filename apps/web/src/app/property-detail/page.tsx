import ReservationCard from "@/components/reservation-card/page";

export default function PropertyDetail() {
  return (
    <div className="w-full h-screen overflow-hidden relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <ReservationCard />
      </div>
    </div>
  );
}
