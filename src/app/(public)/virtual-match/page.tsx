import { PublicShell } from "@/presentation/components/layouts/public-shell.client";
import VirtualMatchPage from "@/presentation/components/features/virtual-match/virtual-match-page";
import { DailyPicksList } from "@/presentation/components/features/virtual/daily-picks-list";
import { getVirtualRepository } from "@/infrastructure/repositories/virtual/betlab-virtual.repository";

export const metadata = {
    title: "Confrontation Virtuelle | BetLab",
    description: "Simulez des matchs entre n'importe quelles équipes avec notre moteur prédictif V2.1",
};

export default async function Page() {
    const repository = getVirtualRepository();
    const dailyPicks = await repository.getDailyPicks({
        minConfidence: 0.65,
        maxResults: 12
    });

    return (
        <div className="bg-background min-h-screen pb-20">
            <VirtualMatchPage />

            <div className="container mx-auto p-4 max-w-5xl">
                <div className="border-t border-dashed my-12" />
                <DailyPicksList picks={dailyPicks} />
            </div>
        </div>
    );
}

