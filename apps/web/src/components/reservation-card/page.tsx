import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
export default function ReservationCard() {
  return (
    <div>
      <Card className="w-[412px] px-6 shadow">
        <CardTitle className="text-2xl font-medium">
          Add dates for prices
        </CardTitle>
        
        <Button className="text-[16px] rounded-full py-6">
          Check availability
        </Button>
      </Card>
    </div>
  );
}
