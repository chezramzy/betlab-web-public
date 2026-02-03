import { PublicShell } from "@/presentation/components/layouts/public-shell.client";
import VirtualMatchPage from "@/presentation/components/features/virtual-match/virtual-match-page";

export const metadata = {
    title: "Confrontation Virtuelle | BetLab",
    description: "Simulez des matchs entre n'importe quelles équipes avec notre moteur prédictif V2.1",
};

export default function Page() {
    return (
        <div className="bg-background min-h-screen">
            <VirtualMatchPage />
        </div>
    );
}
