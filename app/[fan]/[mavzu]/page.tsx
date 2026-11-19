import MavzuContent from "./MavzuContent";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ fan: string; mavzu: string }>;
}

export default async function MavzuPage({ params }: Props) {
  const { fan, mavzu } = await params;
  const fanDecoded = decodeURIComponent(fan);
  const mavzuDecoded = decodeURIComponent(mavzu);
  return <MavzuContent fan={fanDecoded} mavzu={mavzuDecoded} />;
}
